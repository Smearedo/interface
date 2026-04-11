import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Separator } from '@/components/ui'
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
    <View className="flex-1 bg-background items-center justify-center gap-9">
      <View className="flex-row items-center justify-center">
        <Text className="text-foreground text-6xl font-light">Redirecting...</Text>
      </View>
      <Separator className="w-40" />
      <Text className="text-foreground text-xl font-light">This should take no more than a second.</Text>
    </View>
  )
}
