import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { Logo } from '@/components/icons'
import { useAuthStore } from '@/stores/auth'
import { SETUP_VERSION } from '@/modules/constants'

export default function SplashPage () {
  const router = useRouter()
  const setupFinished = useAuthStore((s) => s.setupFinished)
  const scale = useRef(new Animated.Value(5)).current

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      delay: 200,
      useNativeDriver: true
    }).start()

    const timer = setTimeout(() => {
      if (setupFinished >= SETUP_VERSION) {
        router.replace('/(app)/home' as never)
      } else {
        router.replace('/setup' as never)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [router, setupFinished, scale])

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Logo size={40} />
      </Animated.View>
    </View>
  )
}
