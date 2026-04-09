import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { Input, Button } from '@/components/ui'

export default function W2GPage () {
  const router = useRouter()
  const [roomId, setRoomId] = useState('')

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8)
    router.push(`/(app)/w2g/${id}` as never)
  }

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/(app)/w2g/${roomId.trim()}` as never)
    }
  }

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-2xl font-bold">Watch Together</Text>
      <Text className="text-muted-foreground text-center mt-2">
        Watch anime together with friends in real-time sync.
      </Text>

      <View className="w-full mt-8 gap-4">
        <Button onPress={createRoom} className="w-full">
          Create Room
        </Button>

        <View className="flex-row items-center gap-2">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-muted-foreground text-xs">OR</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <Input
          placeholder="Enter room code..."
          value={roomId}
          onChangeText={setRoomId}
        />
        <Button variant="secondary" onPress={joinRoom} className="w-full">
          Join Room
        </Button>
      </View>
    </View>
  )
}
