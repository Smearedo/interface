import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function ThreadPage () {
  const { threadId } = useLocalSearchParams<{ threadId: string }>()

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-foreground text-xl font-bold">Thread #{threadId}</Text>
        <Text className="text-muted-foreground mt-2">Forum thread content will appear here.</Text>
      </ScrollView>
    </View>
  )
}
