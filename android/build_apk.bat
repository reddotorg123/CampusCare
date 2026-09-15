@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\jagad\AppData\Local\Android\Sdk"

echo [1/3] Building CampusCare Android Debug APK with JBR (Java 25) + Gradle 8.14.3...
call "C:\Users\jagad\Downloads\gradle-8.14.3\bin\gradle.bat" assembleDebug

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gradle build failed with exit code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo [2/3] Verifying APK output...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo [SUCCESS] Found app\build\outputs\apk\debug\app-debug.apk
    if not exist "..\dist-apk" mkdir "..\dist-apk"
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "..\dist-apk\CampusCare.apk"
    echo [3/3] Copied to dist-apk\CampusCare.apk
) else (
    echo [ERROR] Output APK not found
    exit /b 1
)
