# Edge Detection App 
 
A real-time edge detection viewer built with Android, OpenCV (C++), OpenGL ES, and TypeScript. 
 
## Features 
 
### Android App 
- Real-time camera feed capture using Camera2 API 
- OpenCV edge detection processing in C++ via JNI 
- OpenGL ES 2.0 rendering 
- Permission handling for camera access 
 
### Web Viewer 
- TypeScript-based web interface 
- Canvas-based frame display 
- FPS counter and frame statistics 
- Clean, modular code structure 
 
## Architecture 
 
``` 
Camera Feed  JNI  OpenCV (C++)  OpenGL ES  Display 
                    
               Web Viewer (TypeScript) 
``` 
 
## Project Structure 
 
``` 
EdgeDetectionApp/ 
ÃÄÄ app/                    # Android app (Kotlin) 
³   ÃÄÄ src/main/ 
³   ³   ÃÄÄ java/com/example/edgedetectionapp/ 
³   ³   ÃÄÄ res/ 
³   ³   ÀÄÄ cpp/ 
³   ÀÄÄ build.gradle 
ÃÄÄ web/                    # TypeScript web viewer 
³   ÃÄÄ src/ 
³   ÃÄÄ dist/ 
³   ÀÄÄ package.json 
ÀÄÄ README.md 
``` 
 
## Setup Instructions 
 
### Android Setup 
1. Install Android SDK and NDK 
2. Install OpenCV Android SDK 
3. Build with Gradle: `./gradlew build` 
4. Install on device: `./gradlew installDebug` 
 
### Web Setup 
1. Navigate to `/web` directory 
2. Run `npm install` 
3. Run `npm run build` 
4. Open `index.html` in browser 
 
## Technical Details 
 
- **JNI**: Java  C++ communication for OpenCV processing 
- **OpenCV**: Canny edge detection algorithm 
- **OpenGL ES 2.0**: Real-time rendering 
- **TypeScript**: Modular web viewer with DOM updates 
- **Camera2 API**: Modern camera integration 
 
## Development Process 
 
This project was developed with incremental commits showing: 
1. Project structure setup 
2. Android configuration and permissions 
3. UI layout and resources 
4. Main activity implementation 
5. Camera manager with Camera2 API 
6. JNI bridge for OpenCV 
7. OpenGL renderer setup 
8. C++ OpenCV implementation 
9. TypeScript web viewer 
10. Documentation and README 
 
## Screenshots 
 
[Add screenshots of working app here] 
