import { Capacitor } from '@capacitor/core';

/**
 * CampusCare Over-The-Air (OTA) Update Service
 * Seamlessly checks, notifies, and applies OTA updates across Web, Android, and iOS (Capacitor).
 */

export const APP_CURRENT_VERSION = '1.0.3';
export const APP_BUILD_NUMBER = 4;

/**
 * Helper to compare semantic versions (e.g. '1.0.3' > '1.0.2')
 */
export function isNewerVersion(remote, current) {
  if (!remote || !current) return false;
  const rParts = remote.replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const cParts = current.replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(rParts.length, cParts.length); i++) {
    const r = rParts[i] || 0;
    const c = cParts[i] || 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
}

/**
 * Check for updates against remote GitHub raw and fallback local version.json
 */
export async function checkOtaUpdate() {
  const remoteEndpoints = [
    `https://raw.githubusercontent.com/reddotorg123/CampusCare/main/public/version.json?_t=${Date.now()}`,
    `/version.json?_t=${Date.now()}`
  ];

  let data = null;
  for (const url of remoteEndpoints) {
    try {
      const res = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        data = await res.json();
        if (data && data.version) break;
      }
    } catch {
      // try fallback endpoint
    }
  }

  if (!data) {
    return { 
      updateAvailable: false, 
      currentVersion: APP_CURRENT_VERSION,
      latestVersion: APP_CURRENT_VERSION,
      buildNumber: APP_BUILD_NUMBER,
      isUpToDate: true
    };
  }

  const remoteVersion = data.version;
  const remoteBuild = data.buildNumber || 0;
  const versionNewer = isNewerVersion(remoteVersion, APP_CURRENT_VERSION);
  const buildNewer = !versionNewer && (remoteVersion === APP_CURRENT_VERSION) && (remoteBuild > APP_BUILD_NUMBER);
  const updateAvailable = versionNewer || buildNewer;

  const isNative = Capacitor.isNativePlatform();
  const platformKey = isNative ? (Capacitor.getPlatform() || 'android') : 'web';
  const platformData = data.platforms?.[platformKey] || data.platforms?.android || {};

  return {
    updateAvailable,
    isUpToDate: !updateAvailable,
    currentVersion: APP_CURRENT_VERSION,
    latestVersion: remoteVersion,
    buildNumber: remoteBuild,
    changelog: platformData.changelog || data.changelog || 'New enhancements and live cloud sync updates.',
    releaseDate: data.releaseDate,
    downloadUrl: platformData.apkUrl || platformData.downloadUrl || 'https://github.com/reddotorg123/CampusCare/releases/latest/download/CampusCare.apk',
    isNative,
    platformKey
  };
}

/**
 * Apply the OTA update:
 * - On Web: Purge CacheStorage, ServiceWorker caches, and reload fresh assets.
 * - On Android/iOS: If APK download available, trigger download or open in system browser.
 */
export async function applyOtaUpdate(otaInfo) {
  try {
    // Clear browser CacheStorage if supported
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // Unregister any stale service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.update().catch(() => {});
      }
    }

    // If native Android/iOS and download URL is provided, open system browser
    if (Capacitor.isNativePlatform() && otaInfo?.downloadUrl) {
      window.open(otaInfo.downloadUrl, '_system');
      return;
    }

    // Reload browser window to fetch latest bundle
    window.location.reload(true);
  } catch (e) {
    console.error('Failed to apply OTA update automatically:', e);
    window.location.reload();
  }
}
