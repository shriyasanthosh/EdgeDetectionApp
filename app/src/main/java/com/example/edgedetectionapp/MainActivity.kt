package com.example.edgedetectionapp 
 
import android.Manifest 
import android.content.pm.PackageManager 
import android.os.Bundle 
import android.view.TextureView 
import android.widget.Toast 
import androidx.appcompat.app.AppCompatActivity 
import androidx.core.app.ActivityCompat 
import androidx.core.content.ContextCompat 
 
class MainActivity : AppCompatActivity() { 
    private val CAMERA_PERMISSION_REQUEST = 1001 
 
    private lateinit var textureView: TextureView 
 
    override fun onCreate(savedInstanceState: Bundle?) { 
        super.onCreate(savedInstanceState) 
        setContentView(R.layout.activity_main) 
 
        initializeViews() 
 
        if (checkCameraPermission()) { 
            initializeCamera() 
        } else { 
            requestCameraPermission() 
        } 
    } 
 
    private fun initializeViews() { 
        textureView = findViewById(R.id.texture_view) 
    } 
 
    private fun checkCameraPermission(): Boolean { 
        return ContextCompat.checkSelfPermission( 
            this, 
            Manifest.permission.CAMERA 
        ) == PackageManager.PERMISSION_GRANTED 
    } 
 
    private fun requestCameraPermission() { 
        ActivityCompat.requestPermissions( 
            this, 
            arrayOf(Manifest.permission.CAMERA), 
            CAMERA_PERMISSION_REQUEST 
        ) 
    } 
 
    private fun initializeCamera() { 
        // TODO: Initialize camera manager 
        Toast.makeText(this, "Camera initialized!", Toast.LENGTH_SHORT).show() 
    } 
 
    override fun onRequestPermissionsResult( 
        requestCode: Int, 
        permissions: Array<out String>, 
        grantResults: IntArray 
    ) { 
        super.onRequestPermissionsResult(requestCode, permissions, grantResults) 
 
        if (requestCode == CAMERA_PERMISSION_REQUEST) { 
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) { 
                initializeCamera() 
            } else { 
                Toast.makeText(this, "Camera permission required", Toast.LENGTH_SHORT).show() 
            } 
        } 
    } 
} 
