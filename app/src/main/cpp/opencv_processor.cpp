#include <jni.h>
#include <opencv2/opencv.hpp>
#include <opencv2/imgproc.hpp>
#include <android/log.h>

#define LOG_TAG "OpenCVProcessor"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)

using namespace cv;

extern "C" {
    JNIEXPORT void JNICALL
    Java_com_example_edgedetectionapp_OpenCVProcessor_initializeOpenCV(JNIEnv *env, jobject thiz) {
        LOGI("OpenCV initialized successfully");
    }

    JNIEXPORT void JNICALL
    Java_com_example_edgedetectionapp_OpenCVProcessor_processFrame(JNIEnv *env, jobject thiz, jobject surfaceTexture) {
        // Create a dummy image for demonstration
        Mat inputImage = Mat::zeros(480, 640, CV_8UC3);

        // Convert to grayscale
        Mat grayImage;
        cvtColor(inputImage, grayImage, COLOR_BGR2GRAY);

        // Apply Canny edge detection
        Mat edges;
        Canny(grayImage, edges, 50, 150);

        LOGI("Frame processed with edge detection");
    }

    JNIEXPORT jbyteArray JNICALL
    Java_com_example_edgedetectionapp_OpenCVProcessor_processFrameData(JNIEnv *env, jobject thiz, 
                                                                      jbyteArray frameData, 
                                                                      jint width, jint height) {
        // Get frame data from Java
        jbyte* frameBytes = env->GetByteArrayElements(frameData, nullptr);
        
        // Create OpenCV Mat from RGB data
        Mat inputImage(height, width, CV_8UC3, frameBytes);
        
        // Convert BGR to RGB (OpenCV uses BGR by default)
        Mat rgbImage;
        cvtColor(inputImage, rgbImage, COLOR_RGB2BGR);
        
        // Convert to grayscale
        Mat grayImage;
        cvtColor(rgbImage, grayImage, COLOR_BGR2GRAY);
        
        // Apply Gaussian blur to reduce noise
        Mat blurred;
        GaussianBlur(grayImage, blurred, Size(5, 5), 0);
        
        // Apply Canny edge detection
        Mat edges;
        Canny(blurred, edges, 50, 150);
        
        // Convert back to 3-channel for display
        Mat result;
        cvtColor(edges, result, COLOR_GRAY2RGB);
        
        // Convert back to RGB for OpenGL
        Mat rgbResult;
        cvtColor(result, rgbResult, COLOR_BGR2RGB);
        
        // Create output byte array
        jbyteArray outputArray = env->NewByteArray(width * height * 3);
        jbyte* outputBytes = env->GetByteArrayElements(outputArray, nullptr);
        
        // Copy processed data
        memcpy(outputBytes, rgbResult.data, width * height * 3);
        
        // Release resources
        env->ReleaseByteArrayElements(frameData, frameBytes, JNI_ABORT);
        env->ReleaseByteArrayElements(outputArray, outputBytes, 0);
        
        LOGI("Frame processed: %dx%d", width, height);
        return outputArray;
    }

    JNIEXPORT void JNICALL
    Java_com_example_edgedetectionapp_OpenCVProcessor_cleanup(JNIEnv *env, jobject thiz) {
        LOGI("OpenCV cleanup completed");
    }
}
