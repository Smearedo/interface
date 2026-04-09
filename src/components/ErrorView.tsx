import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { Separator } from './ui/Separator'

interface ErrorViewProps {
  statusCode?: number
  message?: string
}

export function ErrorView ({ statusCode = 404, message = 'Error' }: ErrorViewProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center gap-9 px-4">
      <View className="flex-row items-center justify-center">
        <Text className="text-foreground text-6xl font-light">{statusCode}</Text>
        <Separator orientation="vertical" className="mx-6 h-20" />
        <Text className="text-foreground text-xl font-light flex-shrink">{message}</Text>
      </View>
      <Image
        source={require('../../static/confused.webp')}
        style={{ width: 300, height: 300 }}
        contentFit="contain"
      />
    </View>
  )
}
