/**
 * Update checking module for Expo.
 *
 * The head app compares UI and native client versions using semver
 * and listens for service worker updates.
 *
 * For Expo, we use expo-updates for OTA updates.
 */

import { APP_VERSION } from './constants'

/** Check if an update is available (stub). */
export const outdatedComponent: Promise<'ui' | 'client' | undefined> = Promise.resolve(undefined)

/** Promise that resolves when an OTA update is ready (stub). */
export const uiUpdate = new Promise<void>(() => {
  // In Expo, updates are handled by expo-updates
  // This promise intentionally never resolves in the stub
  // TODO: integrate with expo-updates API
})

export function getAppVersion (): string {
  return APP_VERSION
}
