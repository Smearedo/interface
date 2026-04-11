import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

export interface Settings {
  volume: number
  playerAutoplay: boolean
  playerAutoPiP: boolean
  playerPause: boolean
  playerAutocomplete: boolean
  playerDeband: boolean
  subtitleStyle: 'none' | 'gandhisans' | 'notosans' | 'roboto'
  searchQuality: '2160' | '1080' | '720' | '480' | ''
  searchAutoSelect: boolean
  lookupPreference: 'quality' | 'size' | 'seeders'
  torrentSpeed: number
  torrentPersist: boolean
  torrentDHT: boolean
  torrentPeX: boolean
  torrentPort: number
  torrentStreamedDownload: boolean
  dhtPort: number
  missingFont: boolean
  maxConns: number
  subtitleRenderHeight: '0' | '1440' | '1080' | '720' | '480'
  subtitleLanguage: string
  audioLanguage: string
  enableDoH: boolean
  hideToTray: boolean
  doHURL: string
  showDetailsInRPC: boolean
  showNavigation: boolean
  torrentPath: string
  angle: string
  idleAnimation: boolean
  uiScale: number
  enableExternal: boolean
  playerPath: string
  playerSeek: string
  playerSkip: boolean
  playerSkipFiller: boolean
  minimalPlayerUI: boolean
  androidStorageType: string
  showHentai: boolean
  hideSpoilers: boolean
  unsafeWebGPU: boolean
}

const defaults: Settings = {
  volume: 1,
  playerAutoplay: true,
  playerAutoPiP: false,
  playerPause: true,
  playerAutocomplete: true,
  playerDeband: false,
  subtitleStyle: 'none',
  searchQuality: '1080',
  searchAutoSelect: true,
  lookupPreference: 'quality',
  torrentSpeed: 40,
  torrentPersist: false,
  torrentDHT: false,
  torrentPeX: false,
  torrentPort: 0,
  torrentStreamedDownload: true,
  dhtPort: 0,
  missingFont: true,
  maxConns: 50,
  subtitleRenderHeight: Platform.OS === 'android' ? '720' : '0',
  subtitleLanguage: 'eng',
  audioLanguage: 'jpn',
  enableDoH: false,
  hideToTray: false,
  doHURL: 'https://cloudflare-dns.com/dns-query',
  showDetailsInRPC: true,
  showNavigation: false,
  torrentPath: '',
  angle: 'default',
  idleAnimation: false,
  uiScale: 1,
  enableExternal: false,
  playerPath: '',
  playerSeek: '2',
  playerSkip: false,
  playerSkipFiller: false,
  minimalPlayerUI: false,
  androidStorageType: 'cache',
  showHentai: false,
  hideSpoilers: false,
  unsafeWebGPU: false
}

interface SettingsState {
  settings: Settings
  setSettings: (partial: Partial<Settings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: { ...defaults },
      setSettings: (partial) => set((state) => ({
        settings: { ...state.settings, ...partial }
      })),
      resetSettings: () => set({ settings: { ...defaults } })
    }),
    {
      name: 'hayase-settings',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
