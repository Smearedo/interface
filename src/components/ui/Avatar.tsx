import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { cn } from '@/utils'

interface AvatarProps {
  src?: string | null
  fallback?: string
  size?: number
  className?: string
}

export function Avatar ({ src, fallback = '?', size = 40, className }: AvatarProps) {
  return (
    <View
      className={cn('rounded-full overflow-hidden bg-muted items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: size, height: size }}
          contentFit="cover"
        />
      ) : (
        <Text className="text-muted-foreground text-sm font-medium">
          {fallback.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  )
}
