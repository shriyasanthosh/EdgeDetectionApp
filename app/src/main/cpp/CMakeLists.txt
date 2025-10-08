cmake_minimum_required(VERSION 3.22.1)

project("edgedetectionapp")

# Set OpenCV path - adjust this path to your OpenCV Android SDK location
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

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
