# CampusCare - Qt 6 QML Desktop Client

## Overview
This folder contains the complete native C++ and Qt Quick (QML) codebase for the CampusCare Desktop Application.

## Requirements
- **Qt 6.5+** (tested with Qt 6.5+ / Qt 6.11.2) with components:
  - `Qt6::Core`
  - `Qt6::Gui`
  - `Qt6::Qml`
  - `Qt6::Quick`
  - `Qt6::QuickControls2`
  - `Qt6::Network`
- **C++17 Compiler** (MinGW 64-bit or MSVC 2019/2022)
- **CMake 3.16+**
- **Ninja** (optional, recommended)

## Project Structure
- `CMakeLists.txt` - CMake project build configuration
- `build_qt.bat` - Automated build script for MinGW / Qt on Windows
- `src/` - Native C++ business logic, REST API networking, and data models:
  - `main.cpp` - Entry point and QML engine initialization
  - `AppController.h` / `.cpp` - Central controller bridging backend data and UI
  - `NetworkManager.h` / `.cpp` - Supabase REST API client and authentication
  - `DataModels.h` / `.cpp` - Data structures and QObject model representations
- `qml/` - UI layouts, views, and components:
  - `Main.qml` - Main window shell and page stack
  - `components/` - Reusable UI elements (dialogs, cards, modals)
  - `screens/` - Application screens (Dashboard, Schools, Lab Map, Tickets, System Details, etc.)

## How to Open and Develop in Qt Creator
1. Open **Qt Creator**.
2. Click **File -> Open File or Project...**
3. Select `CMakeLists.txt` in this folder.
4. Choose your configured Qt 6 Kit (e.g., Qt 6.x MinGW 64-bit or MSVC).
5. Click **Configure Project**.
6. Hit **Run (Ctrl + R)** or **Build (Ctrl + B)**.

## How to Build from Command Line (Windows)
If using MinGW and standard Qt installation paths:
```bat
build_qt.bat
```
Or manually using CMake:
```bash
mkdir build
cd build
cmake -G "Ninja" -DCMAKE_BUILD_TYPE=Release ..
ninja
```
