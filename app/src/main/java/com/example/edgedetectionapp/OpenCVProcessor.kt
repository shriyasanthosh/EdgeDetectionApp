package com.example.edgedetectionapp 
 
import android.graphics.SurfaceTexture 
 
class OpenCVProcessor { 
    companion object { 
        init { 
            System.loadLibrary("opencv_processor") 
        } 
    } 
 
    external fun processFrame(surfaceTexture: SurfaceTexture) 
    external fun initializeOpenCV() 
    external fun cleanup() 
 
    init { 
        initializeOpenCV() 
    } 
} 
