import { getSupabaseClient } from '../supabaseClient';
import { Capacitor } from '@capacitor/core';

/**
 * CampusCare Over-The-Air (OTA) Update Service
 * Seamlessly checks, notifies, and applies OTA updates across Web and Android (Capacitor).
 */

export const APP_CURRENT_VERSION = '1.0.1';
export const APP_BUILD_NUMBER = 2;

/**
 * Helper to compare semantic versions (e.g. '1.0.1' > '1.0.0')
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
 * Check for updates against public/version.json and optional Supabase table
 */
export async function checkOtaUpdate() {
  try {
    // 1. Fetch version.json with cache buster
    const res = await fetch(`/version.json?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });

    if (!res.ok) {
      return { updateAvailable: false, currentVersion: APP_CURRENT_VERSION };
    }

    const data = await res.json();
    const remoteVersion = data.version;
    const updateAvailable = isNewerVersion(remoteVersion, APP_CURRENT_VERSION);

    const isNative = Capacitor.isNativePlatform();
    const platformKey = isNative ? 'android' : 'web';
    const platformData = data.platforms?.[platformKey] || {};

    return {
      updateAvailable,
      currentVersion: APP_CURRENT_VERSION,
      latestVersion: remoteVersion,
      changelog: platformData.changelog || data.changelog || 'New enhancements and live cloud sync updates.',
      releaseDate: data.releaseDate,
      downloadUrl: platformData.apkUrl || data.platforms?.android?.apkUrl || '',
      isNative,
      platformKey
    };
  } catch (err) {
    console.warn('OTA update check error:', err);
    return { updateAvailable: false, currentVersion: APP_CURRENT_VERSION, error: err.message };
  }
}

/**
 * Apply the OTA update:
 * - On Web: Purge CacheStorage, ServiceWorker caches, and reload fresh assets.
 * - On Android: If APK download available, trigger download or reload web runtime.
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

    // If native Android and APK is provided, prompt download
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
