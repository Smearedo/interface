import React, { useEffect, useRef, useState } from 'react'
import { Animated, Text, View } from 'react-native'
import { CloudOff } from 'lucide-react-native'
import { useOnline } from '@/hooks/useOnline'

export function Online () {
  const online = useOnline()
  const [hideFirst, setHideFirst] = useState(false)
  const height = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!online && !hideFirst) {
      setHideFirst(true)
    }
  }, [online, hideFirst])

  useEffect(() => {
    if (online && hideFirst) {
      // "Back online" – show green bar then auto-hide after 2s
      Animated.sequence([
        Animated.timing(height, { toValue: 24, duration: 300, useNativeDriver: false }),
        Animated.delay(2000),
        Animated.timing(height, { toValue: 0, duration: 300, useNativeDriver: false })
      ]).start()
    } else if (!online) {
      // "Offline" – animate in
      Animated.timing(height, { toValue: 24, duration: 300, useNativeDriver: false }).start()
    } else {
      height.setValue(0)
    }
  }, [online, hideFirst, height])

  if (!hideFirst) return null

  if (online) {
    return (
      <Animated.View style={{ height, overflow: 'hidden' }} className="bg-green-600 items-center justify-center flex-row z-40 px-4">
        <Text className="text-white text-xs">Back online</Text>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={{ height, overflow: 'hidden' }} className="bg-neutral-950 items-center justify-center flex-row z-40 px-4">
      <View className="me-2">
        <CloudOff size={16} color="#ffffff" />
      </View>
      <Text className="text-white text-xs">Offline</Text>
    </Animated.View>
  )
}
