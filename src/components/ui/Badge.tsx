import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@/utils'

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children: React.ReactNode
  className?: string
}

const variantStyles = {
  default: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  outline: 'border border-border bg-transparent'
}

const textStyles = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground'
}

export function Badge ({ variant = 'default', children, className }: BadgeProps) {
  return (
    <View className={cn('flex-row items-center rounded-full px-2.5 py-0.5', variantStyles[variant], className)}>
      {typeof children === 'string' ? (
        <Text className={cn('text-xs font-semibold', textStyles[variant])}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}
