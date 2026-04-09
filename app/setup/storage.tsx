import React from 'react'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { SETUP_VERSION } from '@/modules/constants'

export default function StorageSetupPage () {
  const router = useRouter()
  const setSetupFinished = useAuthStore((s) => s.setSetupFinished)

  const handleFinish = () => {
    setSetupFinished(SETUP_VERSION)
    router.replace('/(app)/home' as never)
  }

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-2xl font-bold">Storage</Text>
      <Text className="text-muted-foreground text-center mt-2">
        Configure where downloaded content is stored on your device.
      </Text>

      <Text className="text-muted-foreground text-center mt-8 text-sm">
        You can change storage settings later in Settings → Client
      </Text>

      <View className="w-full mt-12 gap-4">
        <Button onPress={handleFinish} className="w-full">
          Finish Setup
        </Button>
      </View>

      <View className="absolute bottom-8 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-foreground" />
      </View>
    </View>
  )
}
