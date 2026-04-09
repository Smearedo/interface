import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button } from '@/components/ui'

export default function ExtensionsSettingsPage () {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border flex-row items-center justify-between">
        <Text className="text-foreground font-semibold text-lg">Extensions</Text>
        <Button size="sm" variant="outline">
          Add Extension
        </Button>
      </View>
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="items-center justify-center py-20">
          <Text className="text-muted-foreground text-center">
            No extensions installed.{'\n'}Add extensions to enhance your experience.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
