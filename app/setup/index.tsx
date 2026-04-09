import React from 'react'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui'
import { Logo } from '@/components/icons'

export default function SetupPage () {
  const router = useRouter()

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Logo size={64} />
      <Text className="text-foreground text-3xl font-bold mt-6">Welcome to Hayase</Text>
      <Text className="text-muted-foreground text-center mt-2 text-base">
        Let's set up your anime experience. This will only take a moment.
      </Text>

      <View className="w-full mt-12 gap-4">
        <Button onPress={() => router.push('/setup/network' as never)} className="w-full">
          Get Started
        </Button>
      </View>

      <View className="absolute bottom-8 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-foreground" />
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-muted" />
        <View className="h-2 w-2 rounded-full bg-muted" />
      </View>
    </View>
  )
}
