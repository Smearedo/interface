import React from 'react'
import { View, Text } from 'react-native'
import { Button } from '@/components/ui'

export default function UpdatePage () {
  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-2xl font-bold">Update Available</Text>
      <Text className="text-muted-foreground text-center mt-2">
        A new version of Hayase is available. Please update to continue.
      </Text>

      <View className="w-full mt-12 gap-4">
        <Button className="w-full">
          Update Now
        </Button>
      </View>
    </View>
  )
}
