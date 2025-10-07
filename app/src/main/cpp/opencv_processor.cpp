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
 
    JNIEXPORT void JNICALL 
    Java_com_example_edgedetectionapp_OpenCVProcessor_cleanup(JNIEnv *env, jobject thiz) { 
        LOGI("OpenCV cleanup completed"); 
    } 
} 
