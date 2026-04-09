import React from 'react'
import { View, Text } from 'react-native'

export default function PeersPage () {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-muted-foreground">No connected peers</Text>
    </View>
  )
}
