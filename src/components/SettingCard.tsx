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
    <View className={cn('flex-col md:flex-row md:items-center justify-between bg-neutral-950 rounded-md px-6 py-4 gap-3', className)}>
      <View className="flex-1">
        <Text className="text-foreground text-sm font-bold">{title}</Text>
        {description && (
          <Text className="text-muted-foreground text-xs mt-0.5">{description}</Text>
        )}
      </View>
      {children}
    </View>
  )
}
