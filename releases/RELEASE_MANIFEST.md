# 🚀 CampusCare Multi-Platform Release Manifest (v1.0.0)

> **Latest Build Timestamp**: 18-September-2026 10:45 AM IST  
> **Application Version**: `v1.0.0`  
> **Bundle Identifier**: `com.campuscare.app`

This document provides a clean, organized overview of all compiled applications, their exact disk locations, file sizes, build statuses, and installation instructions.

---

## 📦 Master Application Inventory

| # | Platform / App Type | Target Format | Version | Exact Relative Location | File Size | Status |
|---|:---|:---:|:---:|:---|:---:|:---:|
| 1 | **Windows Desktop** | `.exe` (+ Runtime) | `1.0.0` | [`releases/windows/CampusCare-Windows-v1.0.0/CampusCare.exe`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/windows/CampusCare-Windows-v1.0.0/CampusCare.exe) | 7.27 MB *(Executable)* | ✅ **Updated & Packaged** |
| 2 | **Android Mobile** | `.apk` | `1.0.0` | [`releases/android/CampusCare-v1.0.0.apk`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/android/CampusCare-v1.0.0.apk) | 4.51 MB | ✅ **Recompiled & Tested** |
| 3 | **iOS Mobile** | `.ipa` / Xcode | `1.0.0` | [`releases/ios/README.md`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/ios/README.md) & [`.github/workflows/ios-build.yml`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/.github/workflows/ios-build.yml) | Sideloadly IPA Ready | ⚡ **Synced & CI-Ready** |
| 4 | **Web Production** | HTML/JS/CSS | `1.0.0` | [`releases/web/index.html`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/web/index.html) (also [`dist/`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/dist)) | 580 KB *(gzipped: 151 KB)* | ✅ **Updated & Built** |

---

## 🌟 Key Architecture & Feature Updates

1. **Lab Map "Systems" Tab Crash Fixed**:
   - Resolved the `device.status.replace` uncaught exception caused by layout elements (`table`, `label`, `teacher_desk`, `entrance`) that do not possess a `status` string.
   - Filtered systems to actual PC workstations, guarded all status strings (`(status || 'working').replace(/_/g, ' ')`), and added real-time search (by code, asset tag, IP, processor, RAM) and filter chips.
2. **Fully Editable "Details" Tab**:
   - Lab information is no longer static or hardcoded.
   - Added an **"Edit Lab Info"** modal allowing schools to update: Lab Name, Code, Room / Floor, In-Charge Staff, Phone Number, Network Infrastructure, Central UPS Backup, Operating Hours, and Notes.
3. **Feed & Edit System Hardware Specifications**:
   - Schools can view and edit complete hardware specifications for every PC workstation:
     - Processor (CPU), RAM, Storage (SSD/HDD), Operating System
     - Static / DHCP IP Address, MAC Address
     - Monitor Display, Peripherals (Keyboard/Mouse), Serial Number, Physical Location / Bench
   - Edits persist directly to local storage and update across the app in real time.
4. **Multi-Lab Support for a Single School**:
   - A single school/college can now create and manage **multiple computer labs** (e.g. Main Lab, AI & Robotics Lab, Multimedia Lab, Language Lab).
   - Integrated an interactive **Lab Switcher dropdown** in the header to jump between labs with 1 tap.
   - Added a **"+ Add Lab"** creation modal to generate new labs with custom initial workstation counts and independent 2D layouts.
5. **Multi-Tenancy Data Isolation**:
   - When a School or College staff member logs in, they **strictly see only their own school, their own labs, and their own tickets**.
6. **Clean Authentication (Zero Fake Demo Data)**:
   - Starts with a clean Sign In / Register system where institutions register their real names and initial labs.

---

## 📂 Exact File Paths & Directory Structure

```text
SCHOOL TICKET APPICATION/
├── releases/
│   ├── RELEASE_MANIFEST.md                     <-- (This Document)
│   ├── android/
│   │   └── CampusCare-v1.0.0.apk               <-- Updated Android Debug APK (4.32 MB)
│   ├── windows/
│   │   └── CampusCare-Windows-v1.0.0/          <-- Self-Contained Portable Windows Package
│   │       ├── CampusCare.exe                  <-- Native Qt 6.11 C++/QML Executable (7.27 MB)
│   │       ├── Run-CampusCare.bat              <-- One-Click Launcher Script
│   │       ├── Qt6Core.dll, Qt6Gui.dll, ...   <-- Packaged Qt 6.11 Runtime DLLs
│   │       ├── platforms/, qml/, tls/          <-- Required Qt plugins and QML controls
│   │       └── translations/                   <-- Localization files
│   ├── ios/
│   │   └── README.md                           <-- Step-by-step Sideloadly & GitHub Actions guide
│   └── web/
│       ├── index.html                          <-- Production HTML entry point
│       └── assets/                             <-- Minified production JS & CSS bundles
├── dist-apk/
│   └── CampusCare.apk                          <-- Mirrored copy for legacy batch scripts
└── dist-windows/
    └── CampusCare.exe                          <-- Mirrored copy for legacy setups
```

---

## 💻 Platform Details & How to Run / Install

### 1. Windows Desktop App (`CampusCare.exe`)
* **Technology**: Native Qt 6.11.2 (MinGW 64-bit C++ & QML)
* **Exact Folder**: `D:\documents\PROJECT FILES_BP\ANTIGRAVITY APP FILES\SCHOOL TICKET APPICATION\releases\windows\CampusCare-Windows-v1.0.0\`
* **To Launch**: Double-click [`Run-CampusCare.bat`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/windows/CampusCare-Windows-v1.0.0/Run-CampusCare.bat) or [`CampusCare.exe`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/windows/CampusCare-Windows-v1.0.0/CampusCare.exe).

---

### 2. Android Mobile App (`CampusCare-v1.0.0.apk`)
* **Technology**: Capacitor 8 + Android Gradle SDK
* **Exact Path**: `D:\documents\PROJECT FILES_BP\ANTIGRAVITY APP FILES\SCHOOL TICKET APPICATION\releases\android\CampusCare-v1.0.0.apk`
* **To Install**: Sideload onto your Android phone via USB/WhatsApp or run:
  ```powershell
  adb install -r "releases\android\CampusCare-v1.0.0.apk"
  ```

---

### 3. iOS Mobile App (`CampusCare.ipa`)
* **Technology**: Capacitor 8 iOS + Swift/Xcode
* **Sync Status**: Assets synchronized with `npx cap sync ios`.
* **To Build / Download**: Trigger GitHub Action [`.github/workflows/ios-build.yml`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/.github/workflows/ios-build.yml) to download the `.ipa`, then sideload via **Sideloadly** (see [`releases/ios/README.md`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/releases/ios/README.md)).

---

### 4. Web Production App
* **Technology**: Vite 8 + React 19 + Supabase JS Client
* **Exact Folder**: `D:\documents\PROJECT FILES_BP\ANTIGRAVITY APP FILES\SCHOOL TICKET APPICATION\releases\web\` (and `dist\`)
* **To Preview**:
  ```powershell
  npm run preview
  ```
