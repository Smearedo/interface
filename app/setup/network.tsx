import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui'
import { StatusDot } from '@/components'

export default function NetworkSetupPage () {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnected(true)
      setChecking(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-2xl font-bold">Network Check</Text>
      <Text className="text-muted-foreground text-center mt-2">
        Checking your network connectivity...
      </Text>

      <View className="mt-8 items-center">
        {checking ? (
          <ActivityIndicator size="large" color="#fafafa" />
        ) : (
          <View className="flex-row items-center gap-2">
            <StatusDot status={connected ? 'online' : 'offline'} />
            <Text className="text-foreground">{connected ? 'Connected' : 'No Connection'}</Text>
          </View>
        )}
      </View>

      <View className="w-full mt-12 gap-4">
        <Button onPress={() => router.push('/setup/extensions' as never)} className="w-full">
          Continue
        </Button>
        <Button variant="ghost" onPress={() => router.push('/setup/extensions' as never)} className="w-full">
          Skip
        </Button>
      </View>

      <View className="absolute bottom-8 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-foreground" />
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-muted" />
      </View>
    </View>
  )
}
