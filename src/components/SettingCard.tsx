import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@/utils'

interface SettingCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function SettingCard ({ title, description, children, className }: SettingCardProps) {
  return (
    <View className={cn('flex-row items-center justify-between py-4 px-4 border-b border-border', className)}>
      <View className="flex-1 mr-4">
        <Text className="text-foreground text-sm font-medium">{title}</Text>
        {description && (
          <Text className="text-muted-foreground text-xs mt-0.5">{description}</Text>
        )}
      </View>
      {children}
    </View>
  )
}
