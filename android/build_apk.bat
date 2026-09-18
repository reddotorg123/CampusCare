@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\jagad\AppData\Local\Android\Sdk"

echo [1/4] Compiling React web bundle with Vite...
cd ..
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web build failed with exit code %ERRORLEVEL%
    cd android
    exit /b %ERRORLEVEL%
)

echo [2/4] Syncing web assets into Android project...
call npx cap copy android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Capacitor copy failed with exit code %ERRORLEVEL%
    cd android
    exit /b %ERRORLEVEL%
)
cd android

echo [3/4] Building CampusCare Android Debug APK with JBR + Gradle 8.14.3...
call "C:\Users\jagad\Downloads\gradle-8.14.3\bin\gradle.bat" assembleDebug

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gradle build failed with exit code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo [4/4] Verifying APK output...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo [SUCCESS] Found app\build\outputs\apk\debug\app-debug.apk
    if not exist "..\dist-apk" mkdir "..\dist-apk"
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "..\dist-apk\CampusCare.apk"
    if not exist "..\releases\android" mkdir "..\releases\android"
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "..\releases\android\CampusCare-v1.0.0.apk"
    echo [SUCCESS] Copied to dist-apk\CampusCare.apk and releases\android\CampusCare-v1.0.0.apk
) else (
    echo [ERROR] Output APK not found
    exit /b 1
)
