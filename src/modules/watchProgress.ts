import AsyncStorage from '@react-native-async-storage/async-storage'

export interface WatchProgress {
  episode: number
  currentTime: number
  safeduration: number
}

const STORAGE_KEY = 'watchProgress'

let _progressData: Record<number, WatchProgress> = {}
let _loaded = false

async function _ensureLoaded () {
  if (_loaded) return
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (raw) _progressData = JSON.parse(raw)
  } catch {
    // ignore
  }
  _loaded = true
}

async function _save () {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_progressData))
}

export function liveAnimeProgress (mediaId: number): { progress: number; episode: number } | undefined {
  if (!mediaId) return
  const entry = _progressData[mediaId]
  if (!entry) return
  return {
    progress: Math.ceil(entry.currentTime / entry.safeduration * 100),
    episode: entry.episode
  }
}

export function getAnimeProgress (mediaId: number): WatchProgress | undefined {
  return _progressData[mediaId]
}

export async function setAnimeProgress (mediaId: number, progress: WatchProgress) {
  await _ensureLoaded()
  _progressData[mediaId] = progress
  await _save()
}

// Load on module init
_ensureLoaded()
