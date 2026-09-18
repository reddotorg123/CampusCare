# CampusCare iOS Build & Sideload Guide (v1.0.0)

## Overview & Architecture
The CampusCare iOS application is powered by **Capacitor 8** wrapping the latest production React / Vite client.
All web assets and native capacitor configurations are synced inside `ios/App/`.

> [!NOTE]
> **Why iOS `.ipa` files cannot be generated directly on Windows:**
> Apple's iOS toolchain (`xcodebuild`, iOS SDK, Swift compiler, codesign) is strictly macOS-exclusive. 
> To provide you with zero-setup, automated `.ipa` builds without needing a Mac, this repository includes an automated GitHub Actions CI/CD workflow (`.github/workflows/ios-build.yml`).

---

## Method 1: Download `.ipa` via GitHub Actions (Recommended for Windows Users)

1. **Commit & Push** your changes to GitHub (`main` or `master` branch).
2. Go to your GitHub repository in your browser:
   - Click the **Actions** tab.
   - Select the workflow: **Build Native iOS App (Sideloadly IPA)**.
   - You can also click **Run workflow** manually anytime.
3. Once the workflow finishes (approx. 2-3 minutes), scroll down to the **Artifacts** section.
4. Download **`CampusCare-IPA`** (contains `CampusCare.ipa`).

---

## Method 2: Sideloading `CampusCare.ipa` onto your iPhone / iPad (Windows PC)

Using **Sideloadly** (Free, no jailbreak required):
1. Download & install **Sideloadly** on your Windows PC ([sideloadly.io](https://sideloadly.io/)).
2. Connect your iPhone/iPad to your PC via USB cable and tap **Trust this Computer**.
3. Open Sideloadly:
   - Drag and drop `CampusCare.ipa` into the Sideloadly window.
   - Enter your Apple ID (used for free signing certificate).
   - Click **Start**.
4. Once completed, unlock your iPhone:
   - Go to **Settings > General > VPN & Device Management**.
   - Tap your Apple ID profile and select **Trust**.
5. Launch **CampusCare** from your home screen!

---

## Method 3: Local Mac / Xcode Build (If you have a Mac)

If you have a macOS machine:
1. Clone or copy this repository to your Mac.
2. Open terminal in the project directory:
   ```bash
   npm install
   npm run build
   npx cap sync ios
   npx cap open ios
   ```
3. In Xcode, select your connected iPhone or a Simulator from the scheme bar.
4. Click **Product > Run** (or **Product > Archive** to export your signed IPA or distribute via TestFlight).
