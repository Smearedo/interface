import React from 'react'
import { View, Text, type ViewProps } from 'react-native'
import { cn } from '@/utils'

interface CardProps extends ViewProps {
  className?: string
  children: React.ReactNode
}

export function Card ({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('rounded-lg border border-border bg-card', className)} {...props}>
      {children}
    </View>
  )
}

export function CardHeader ({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </View>
  )
}

export function CardTitle ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-lg font-semibold leading-none tracking-tight text-card-foreground', className)}>
      {children}
    </Text>
  )
}

export function CardDescription ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  )
}

export function CardContent ({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </View>
  )
}

export function CardFooter ({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('flex flex-row items-center p-6 pt-0', className)} {...props}>
      {children}
    </View>
  )
}
