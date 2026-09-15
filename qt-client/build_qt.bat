@echo off
setlocal
echo =========================================================
echo Setting up Qt 6.11.2 MinGW Build Environment...
echo =========================================================

set PATH=C:\Qt\6.11.2\mingw_64\bin;C:\Qt\Tools\mingw1310_64\bin;C:\Qt\Tools\Ninja;C:\Qt\Tools\CMake_64\bin;%PATH%
set CMAKE_PREFIX_PATH=C:\Qt\6.11.2\mingw_64

if not exist build mkdir build
cd build

echo Configuring with CMake...
cmake -G "Ninja" -DCMAKE_BUILD_TYPE=Release -DCMAKE_PREFIX_PATH="C:/Qt/6.11.2/mingw_64" ..
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] CMake configuration failed!
    exit /b %ERRORLEVEL%
)

echo Building with Ninja...
ninja
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ninja build failed!
    exit /b %ERRORLEVEL%
)

echo =========================================================
echo [SUCCESS] CampusCare Qt 6 Native Executable Built!
echo Output: %CD%\CampusCare.exe
echo =========================================================
