import React from 'react'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui'

export default function ExtensionsSetupPage () {
  const router = useRouter()

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-2xl font-bold">Extensions</Text>
      <Text className="text-muted-foreground text-center mt-2">
        Extensions enhance your experience with additional features and sources.
      </Text>

      <Text className="text-muted-foreground text-center mt-8 text-sm">
        You can add extensions later in Settings → Extensions
      </Text>

      <View className="w-full mt-12 gap-4">
        <Button onPress={() => router.push('/setup/storage' as never)} className="w-full">
          Continue
        </Button>
      </View>

      <View className="absolute bottom-8 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-foreground" />
        <View className="h-2 w-2 rounded-full bg-muted" />
      </View>
    </View>
  )
}
