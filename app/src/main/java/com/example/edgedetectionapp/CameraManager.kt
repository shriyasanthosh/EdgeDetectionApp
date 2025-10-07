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
 
class CameraManager( 
    private val context: Context, 
    private val textureView: TextureView 
) { 
    private var cameraDevice: CameraDevice? = null 
    private var captureSession: CameraCaptureSession? = null 
 
    init { 
        setupTextureView() 
    } 
 
    private fun setupTextureView() { 
        textureView.surfaceTextureListener = object : TextureView.SurfaceTextureListener { 
            override fun onSurfaceTextureAvailable(surface: SurfaceTexture, width: Int, height: Int) { 
                openCamera() 
            } 
 
            override fun onSurfaceTextureSizeChanged(surface: SurfaceTexture, width: Int, height: Int) {} 
 
            override fun onSurfaceTextureDestroyed(surface: SurfaceTexture): Boolean = false 
 
            override fun onSurfaceTextureUpdated(surface: SurfaceTexture) { 
                processFrame(surface) 
            } 
        } 
    } 
 
    private fun processFrame(surface: SurfaceTexture) { 
        // TODO: Send frame to OpenCV processor 
        // This will be called for each camera frame 
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
                }, null) 
            } 
        } catch (e: CameraAccessException) { 
            e.printStackTrace() 
        } 
    } 
 
    private fun createCaptureSession() { 
        try { 
            val surfaceTexture = textureView.surfaceTexture 
            val surface = Surface(surfaceTexture) 
 
            val builder = cameraDevice?.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW) 
            builder?.addTarget(surface) 
 
            cameraDevice?.createCaptureSession( 
                listOf(surface), 
                object : CameraCaptureSession.StateCallback() { 
                    override fun onConfigured(session: CameraCaptureSession) { 
                        captureSession = session 
                        try { 
                            session.setRepeatingRequest(builder?.build()!!, null, null) 
                        } catch (e: CameraAccessException) { 
                            e.printStackTrace() 
                        } 
                    } 
 
                    override fun onConfigureFailed(session: CameraCaptureSession) {} 
                }, 
                null 
            ) 
        } catch (e: CameraAccessException) { 
            e.printStackTrace() 
        } 
    } 
 
    fun startCamera() { 
        if (textureView.isAvailable) { 
            openCamera() 
        } 
    } 
} 
