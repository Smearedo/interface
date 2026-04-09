import React from 'react'
import { View } from 'react-native'
import { cn } from '@/utils'

interface StatusDotProps {
  status: 'online' | 'offline' | 'idle' | 'error'
  className?: string
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-zinc-500',
  idle: 'bg-yellow-500',
  error: 'bg-red-500'
}

export function StatusDot ({ status, className }: StatusDotProps) {
  return (
    <View className={cn('h-2 w-2 rounded-full', statusColors[status], className)} />
  )
}
