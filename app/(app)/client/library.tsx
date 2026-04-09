import React from 'react'
import { View, Text } from 'react-native'

export default function LibraryPage () {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-muted-foreground">Your torrent library is empty</Text>
    </View>
  )
}
