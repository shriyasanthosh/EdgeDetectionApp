cmake_minimum_required(VERSION 3.22.1)

project("edgedetectionapp")

# Add OpenCV
set(OpenCV_DIR ${CMAKE_SOURCE_DIR}/../../../../jni/opencv)
find_package(OpenCV REQUIRED)

# Add the native library
add_library(opencv_processor SHARED
    opencv_processor.cpp)

# Link OpenCV libraries
target_link_libraries(opencv_processor
    ${OpenCV_LIBS}
    android
    log)

# Include OpenCV headers
target_include_directories(opencv_processor PRIVATE
    ${OpenCV_INCLUDE_DIRS})
