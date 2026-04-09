import React from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function W2GRoomPage () {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground text-xl font-bold">Room: {id}</Text>
      <Text className="text-muted-foreground mt-2">Watch Together session</Text>
      <View className="w-full aspect-video bg-black mt-4 rounded-lg items-center justify-center">
        <Text className="text-muted-foreground">Video player placeholder</Text>
      </View>
    </View>
  )
}
