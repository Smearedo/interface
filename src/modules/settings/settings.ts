import Debug from 'debug'

import { useSettingsStore } from '@/stores/settings'

const _debug = Debug('ui:settings')

/** Get current settings (non-reactive) */
export function getSettings () {
  return useSettingsStore.getState().settings
}

/** Update settings (non-reactive) */
export function updateSettings (partial: Record<string, unknown>) {
  useSettingsStore.getState().setSettings(partial)
}

const __DEV__ = process.env.NODE_ENV === 'development'

const alID = __DEV__ ? '26159' : '3461'
const malID = 'd93b624a92e431a9b6dfe7a66c0c5bbb'

/** AniList client ID */
export const anilistClientID = alID

/** MAL client ID */
export const malClientID = malID

/** NSFW filter - returns ['Hentai'] or null based on settings */
export function nsfw (): ['Hentai'] | null {
  const settings = getSettings()
  return settings.showHentai ? null : ['Hentai']
}

// Subscribe to debug key changes
let _currentDebug = ''
export function setDebugKey (value: string) {
  _currentDebug = value
  Debug.enable(value)
}

export function getDebugKey (): string {
  return _currentDebug
}

// Log settings changes
useSettingsStore.subscribe((state) => {
  _debug('settings changed', state.settings)
})
