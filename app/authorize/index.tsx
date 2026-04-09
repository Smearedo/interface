import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuthStore } from '@/stores/auth'

export default function AuthorizePage () {
  const router = useRouter()
  const params = useLocalSearchParams<{ access_token?: string; code?: string }>()
  const setAnilistToken = useAuthStore((s) => s.setAnilistToken)

  useEffect(() => {
    if (params.access_token) {
      setAnilistToken(params.access_token)
      router.replace('/(app)/settings/accounts' as never)
    } else if (params.code) {
      // Handle MAL auth code
      router.replace('/(app)/settings/accounts' as never)
    }
  }, [params, setAnilistToken, router])

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#fafafa" />
      <Text className="text-muted-foreground mt-4">Authenticating...</Text>
    </View>
  )
}
