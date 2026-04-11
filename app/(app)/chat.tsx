import React from 'react'
import { View, Text } from 'react-native'

/* Chat page is currently disabled in Hayase.
   The original SvelteKit code has the entire IRC chat component commented out. */

export default function ChatPage () {
  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-2xl font-bold mb-3">Chat</Text>
      <Text className="text-muted-foreground text-center">
        IRC Chat is not currently available.
      </Text>
    </View>
  )
}
