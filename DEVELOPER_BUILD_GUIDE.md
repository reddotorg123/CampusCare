# 🛠️ CampusCare Multi-Platform Developer & Build Guide

> **For Engineers, Mobile Developers & Desktop Contributors**

CampusCare is an enterprise cross-platform system. As a developer, **all source code for Android, iOS, Windows Desktop, and Web is fully hosted in this repository**. You do not commit compiled binary files (`.apk`, `.ipa`, `.exe`) to Git because:
1. Binaries are compiled outputs of source code.
2. Git is designed for text source code; large binaries slow down clone times.
3. Every developer and CI pipeline builds fresh binaries directly from the latest source code.

This guide explains how any team member can build and develop each platform locally and in the cloud.

---

## 📱 1. Developing & Building Android (`.apk`)

The native Android project is located in [`android/`](file:///android/).

### Prerequisites:
- **Node.js** (v20+) & **npm**
- **Java JDK 17**
- **Android Studio** (with Android SDK Platform 34+)

### Build Commands:
```bash
# 1. Build the latest web application bundle
npm run build

# 2. Sync web assets and Capacitor plugins to Android project
npx cap sync android

# 3. Build APK from Command Line:
cd android
./gradlew assembleDebug      # Linux / macOS
# or on Windows:
.\gradlew.bat assembleDebug

# Output APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Developing in Android Studio:
```bash
npx cap open android
```
This opens the project in Android Studio for debugging with Emulators or physical devices.

---

## 🍎 2. Developing & Building iOS (`.ipa`)

The native iOS project is located in [`ios/`](file:///ios/).

### Prerequisites:
- **macOS** with **Xcode 15+** (Required by Apple for local iOS compiling)
- **CocoaPods** / Swift Package Manager

### Build Commands on Mac:
```bash
# 1. Build web application bundle
npm run build

# 2. Sync assets to iOS Xcode project
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```
In Xcode:
- Select your target device or simulator.
- Press `Cmd + R` to build and run, or `Product > Archive` to generate an IPA / App Store release.

### Building iOS on Windows (Without a Mac):
We provide an automated GitHub Actions CI workflow in [`.github/workflows/ios-build.yml`](file:///.github/workflows/ios-build.yml):
1. Push your changes to GitHub.
2. GitHub runs a cloud macOS runner (`macos-14`), compiles Xcode, and packages an unsigned Sideloadly-ready `CampusCare.ipa`.
3. Download it directly from the **Actions > Artifacts** tab!

---

## 💻 3. Developing & Building Windows Desktop (`.exe`)

The native Windows desktop client is located in [`qt-client/`](file:///qt-client/) and is written in **Qt 6 C++ and QML**.

### Prerequisites:
- **Qt 6.5+** (Qt 6.11 recommended with `mingw_64` or `msvc2022_64`)
- **CMake** (v3.16+)
- **Ninja** or MinGW Makefiles

### Build Commands:
```bash
cd qt-client

# 1. Create build directory
mkdir build && cd build

# 2. Configure with CMake (pointing to your Qt installation)
cmake .. -G "Ninja" -DCMAKE_BUILD_TYPE=Release -DCMAKE_PREFIX_PATH="C:/Qt/6.11.2/mingw_64"

# 3. Compile executable
ninja
# Output: qt-client/build/CampusCare.exe

# 4. Deploy all Qt runtime DLLs so it can run on any Windows PC
windeployqt --qmldir ../qml CampusCare.exe
```

### Developing in Qt Creator:
- Open `qt-client/CMakeLists.txt` directly inside **Qt Creator**.
- Choose your desktop Qt 6 kit.
- Hit **Run** (`Ctrl + R`) with live QML Hot Reload support.

---

## 🌐 4. Developing & Building Web Application

The web frontend is built with **React 19, Vite, and vanilla CSS** in [`src/`](file:///src/).

### Commands:
```bash
# Start development server with Hot Module Replacement (HMR)
npm run dev

# Run Oxlint static analysis
npm run lint

# Compile production bundle
npm run build
# Output located in dist/
```

---

## ☁️ 5. Automated Cloud Builds (GitHub Actions CI/CD)

Whenever anyone pushes to `main`, GitHub automatically builds all packages in the cloud:

| Workflow | Platform | Output Artifact |
| :--- | :--- | :--- |
| [`.github/workflows/android-build.yml`](file:///.github/workflows/android-build.yml) | Android Mobile | `CampusCare-Android-APK` (`.apk`) |
| [`.github/workflows/ios-build.yml`](file:///.github/workflows/ios-build.yml) | Apple iOS | `CampusCare-IPA` (`.ipa`) |
| [`.github/workflows/windows-build.yml`](file:///.github/workflows/windows-build.yml) | Windows Desktop | `CampusCare-Windows-Portable` (`.zip`) |
| [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml) | Web Production | Automated Lint & Build Test Verification |

### How Non-Technical Team Members Download Ready-to-Use Builds:
1. Go to the repository on GitHub: `https://github.com/reddotorg123/CampusCare/actions`
2. Click on the latest workflow run.
3. Under **Artifacts**, download the ready-to-install app for your device!
