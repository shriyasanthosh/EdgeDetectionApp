package com.example.edgedetectionapp

import android.content.Context
import android.graphics.SurfaceTexture
import android.hardware.camera2.*
import android.util.Size
import android.view.Surface
import android.view.TextureView
import androidx.core.app.ActivityCompat
import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.ImageFormat
import android.media.ImageReader
import android.os.Handler
import android.os.HandlerThread
import java.nio.ByteBuffer
import com.example.edgedetectionapp.OpenGLRenderer

class CameraManager(
    private val context: Context,
    private val textureView: TextureView,
    private val openCVProcessor: OpenCVProcessor,
    private val openGLRenderer: OpenGLRenderer,
    private val fpsCounter: android.widget.TextView
) {
    private var cameraDevice: CameraDevice? = null
    private var captureSession: CameraCaptureSession? = null
    private var imageReader: ImageReader? = null
    private var backgroundThread: HandlerThread? = null
    private var backgroundHandler: Handler? = null
    private var frameCount = 0
    private var lastTime = System.currentTimeMillis()

    init {
        setupTextureView()
        startBackgroundThread()
    }

    private fun setupTextureView() {
        textureView.surfaceTextureListener = object : TextureView.SurfaceTextureListener {
            override fun onSurfaceTextureAvailable(surface: SurfaceTexture, width: Int, height: Int) {
                openCamera()
            }

            override fun onSurfaceTextureSizeChanged(surface: SurfaceTexture, width: Int, height: Int) {}

            override fun onSurfaceTextureDestroyed(surface: SurfaceTexture): Boolean = false

            override fun onSurfaceTextureUpdated(surface: SurfaceTexture) {
                // Frame updated - this is where we capture frames for processing
                captureFrame()
            }
        }
    }

    private fun captureFrame() {
        // Capture current frame from TextureView
        val bitmap = textureView.getBitmap()
        if (bitmap != null) {
            processFrame(bitmap)
        }
    }

    private fun processFrame(bitmap: Bitmap) {
        try {
            // Convert bitmap to byte array for OpenCV processing
            val width = bitmap.width
            val height = bitmap.height
            val pixels = IntArray(width * height)
            bitmap.getPixels(pixels, 0, width, 0, 0, width, height)
            
            // Convert ARGB to RGB
            val rgbData = ByteArray(width * height * 3)
            for (i in pixels.indices) {
                val pixel = pixels[i]
                rgbData[i * 3] = (pixel shr 16 and 0xFF).toByte()     // R
                rgbData[i * 3 + 1] = (pixel shr 8 and 0xFF).toByte()  // G
                rgbData[i * 3 + 2] = (pixel and 0xFF).toByte()        // B
            }
            
            // Process with OpenCV on background thread
            backgroundHandler?.post {
                try {
                    val processedData = openCVProcessor.processFrameData(rgbData, width, height)
                    
                    // Update OpenGL renderer on main thread
                    (context as? android.app.Activity)?.runOnUiThread {
                        openGLRenderer.updateFrame(processedData, width, height)
                    }
                } catch (e: Exception) {
                    android.util.Log.e("CameraManager", "Error processing frame: ${e.message}")
                }
            }
            
            // Update FPS counter
            updateFPS()
        } catch (e: Exception) {
            android.util.Log.e("CameraManager", "Error in processFrame: ${e.message}")
        }
    }

    private fun updateFPS() {
        frameCount++
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastTime >= 1000) {
            val fps = (frameCount * 1000) / (currentTime - lastTime)
            // Update FPS display on UI thread
            (context as? android.app.Activity)?.runOnUiThread {
                fpsCounter.text = "FPS: $fps"
            }
            frameCount = 0
            lastTime = currentTime
        }
    }

    private fun openCamera() {
        try {
            val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            val cameraId = cameraManager.cameraIdList[0]

            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_GRANTED) {

                cameraManager.openCamera(cameraId, object : CameraDevice.StateCallback() {
                    override fun onOpened(camera: CameraDevice) {
                        cameraDevice = camera
                        createCaptureSession()
                    }

                    override fun onDisconnected(camera: CameraDevice) {
                        camera.close()
                        cameraDevice = null
                    }

                    override fun onError(camera: CameraDevice, error: Int) {
                        camera.close()
                        cameraDevice = null
                    }
                }, backgroundHandler)
            }
        } catch (e: CameraAccessException) {
            e.printStackTrace()
        }
    }

    private fun createCaptureSession() {
        try {
            val surface = Surface(textureView.surfaceTexture)
            val captureRequestBuilder = cameraDevice?.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
            captureRequestBuilder?.addTarget(surface)

            cameraDevice?.createCaptureSession(
                listOf(surface),
                object : CameraCaptureSession.StateCallback() {
                    override fun onConfigured(session: CameraCaptureSession) {
                        captureSession = session
                        try {
                            val captureRequest = captureRequestBuilder?.build()
                            captureSession?.setRepeatingRequest(captureRequest, null, backgroundHandler)
                        } catch (e: CameraAccessException) {
                            e.printStackTrace()
                        }
                    }

                    override fun onConfigureFailed(session: CameraCaptureSession) {
                        // Handle configuration failure
                    }
                },
                backgroundHandler
            )
        } catch (e: CameraAccessException) {
            e.printStackTrace()
        }
    }

    private fun startBackgroundThread() {
        backgroundThread = HandlerThread("CameraBackground").also { it.start() }
        backgroundHandler = Handler(backgroundThread?.looper!!)
    }

    private fun stopBackgroundThread() {
        backgroundThread?.quitSafely()
        try {
            backgroundThread?.join()
            backgroundThread = null
            backgroundHandler = null
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
    }

    fun close() {
        captureSession?.close()
        cameraDevice?.close()
        stopBackgroundThread()
    }
}