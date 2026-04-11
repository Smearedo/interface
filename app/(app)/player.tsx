import React, { useRef, useEffect, useCallback } from 'react'
import { View, Text, Pressable, Dimensions, Platform } from 'react-native'
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av'
import { useRouter } from 'expo-router'
import { ChevronLeft, Play, Pause, SkipForward, SkipBack, Maximize } from 'lucide-react-native'
import { usePlayerStore } from '@/stores/player'
import { toTS } from '@/utils'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function PlayerPage () {
  const router = useRouter()
  const videoRef = useRef<Video>(null)
  const {
    isPlaying, currentTime, duration, videoUrl,
    setPlaying, setCurrentTime, setDuration, setShowControls, showControls
  } = usePlayerStore()

  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }, [isPlaying, setShowControls])

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    }
  }, [])

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return
    setCurrentTime(status.positionMillis / 1000)
    setDuration((status.durationMillis ?? 0) / 1000)
    setPlaying(status.isPlaying)
  }, [setCurrentTime, setDuration, setPlaying])

  const togglePlayPause = async () => {
    if (!videoRef.current) return
    if (isPlaying) {
      await videoRef.current.pauseAsync()
    } else {
      await videoRef.current.playAsync()
    }
    resetHideTimer()
  }

  const seek = async (seconds: number) => {
    if (!videoRef.current) return
    await videoRef.current.setPositionAsync((currentTime + seconds) * 1000)
    resetHideTimer()
  }

  if (!videoUrl) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-muted-foreground">No video selected</Text>
      </View>
    )
  }

  return (
    <Pressable className="flex-1 bg-black" onPress={resetHideTimer}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      {showControls && (
        <View className="absolute inset-0 bg-black/40">
          {/* Top bar */}
          <View className="flex-row items-center px-4 pt-12">
            <Pressable onPress={() => router.back()}>
              <ChevronLeft size={28} color="#ffffff" />
            </Pressable>
          </View>

          {/* Center controls */}
          <View className="flex-1 flex-row items-center justify-center gap-12">
            <Pressable onPress={() => seek(-10)}>
              <SkipBack size={32} color="#ffffff" />
            </Pressable>
            <Pressable onPress={togglePlayPause}>
              {isPlaying ? (
                <Pause size={48} color="#ffffff" />
              ) : (
                <Play size={48} color="#ffffff" />
              )}
            </Pressable>
            <Pressable onPress={() => seek(10)}>
              <SkipForward size={32} color="#ffffff" />
            </Pressable>
          </View>

          {/* Bottom bar */}
          <View className="px-4 pb-8">
            <View className="h-1 bg-white/30 rounded-full overflow-hidden">
              <View
                className="h-full bg-white rounded-full"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-white text-xs">{toTS(currentTime)}</Text>
              <Text className="text-white text-xs">{toTS(duration)}</Text>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  )
}
