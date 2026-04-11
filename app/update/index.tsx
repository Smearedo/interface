import React from 'react'
import { View, Text } from 'react-native'
import { Separator } from '@/components/ui'
import { Button } from '@/components/ui'

export default function UpdatePage () {
  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-foreground text-6xl text-center font-bold">Update Required</Text>
      <Separator className="my-6 w-40" />
      <Text className="text-foreground text-xl text-center mb-6">
        A mandatory update is available.{'\n'}Please update to continue.
      </Text>

      <Button className="font-bold" size="lg" onPress={() => {}}>
        Update
      </Button>
    </View>
  )
}
