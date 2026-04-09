import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
  anilistToken: string | null
  malToken: string | null
  kitsuToken: string | null
  anilistViewer: Record<string, unknown> | null
  malViewer: Record<string, unknown> | null
  kitsuViewer: Record<string, unknown> | null
  syncSettings: { al: boolean; local: boolean; kitsu: boolean; mal: boolean }
  setupFinished: number
  setAnilistToken: (token: string | null) => void
  setMalToken: (token: string | null) => void
  setKitsuToken: (token: string | null) => void
  setAnilistViewer: (viewer: Record<string, unknown> | null) => void
  setMalViewer: (viewer: Record<string, unknown> | null) => void
  setKitsuViewer: (viewer: Record<string, unknown> | null) => void
  setSyncSettings: (settings: Partial<AuthState['syncSettings']>) => void
  setSetupFinished: (version: number) => void
  hasAuth: () => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      anilistToken: null,
      malToken: null,
      kitsuToken: null,
      anilistViewer: null,
      malViewer: null,
      kitsuViewer: null,
      syncSettings: { al: true, local: true, kitsu: true, mal: true },
      setupFinished: 0,
      setAnilistToken: (token) => set({ anilistToken: token }),
      setMalToken: (token) => set({ malToken: token }),
      setKitsuToken: (token) => set({ kitsuToken: token }),
      setAnilistViewer: (viewer) => set({ anilistViewer: viewer }),
      setMalViewer: (viewer) => set({ malViewer: viewer }),
      setKitsuViewer: (viewer) => set({ kitsuViewer: viewer }),
      setSyncSettings: (settings) => set((state) => ({
        syncSettings: { ...state.syncSettings, ...settings }
      })),
      setSetupFinished: (version) => set({ setupFinished: version }),
      hasAuth: () => {
        const state = get()
        return !!(state.anilistToken || state.malToken || state.kitsuToken)
      },
      logout: () => set({
        anilistToken: null,
        malToken: null,
        kitsuToken: null,
        anilistViewer: null,
        malViewer: null,
        kitsuViewer: null
      })
    }),
    {
      name: 'hayase-auth',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
