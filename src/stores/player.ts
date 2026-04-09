import { create } from 'zustand'

interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  videoUrl: string | null
  mediaId: number | null
  episode: number | null
  showControls: boolean
  setPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setFullscreen: (fullscreen: boolean) => void
  setVideoUrl: (url: string | null) => void
  setMedia: (mediaId: number | null, episode: number | null) => void
  setShowControls: (show: boolean) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  videoUrl: null,
  mediaId: null,
  episode: null,
  showControls: true,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ isMuted: muted }),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setVideoUrl: (url) => set({ videoUrl: url }),
  setMedia: (mediaId, episode) => set({ mediaId, episode }),
  setShowControls: (show) => set({ showControls: show }),
  reset: () => set({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    videoUrl: null,
    mediaId: null,
    episode: null,
    showControls: true
  })
}))
