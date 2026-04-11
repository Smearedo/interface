import React from 'react'
import { View } from 'react-native'
import { cn } from '@/utils'

type StatusVariant = 'online' | 'offline' | 'idle' | 'error' |
  'CURRENT' | 'PLANNING' | 'COMPLETED' | 'PAUSED' | 'REPEATING' | 'DROPPED' | 'PENDING'

interface StatusDotProps {
  status: StatusVariant
  className?: string
}

const statusColors: Record<StatusVariant, string> = {
  // Generic variants
  online: 'bg-green-500',
  offline: 'bg-zinc-500',
  idle: 'bg-yellow-500',
  error: 'bg-red-500',
  // AniList status variants matching HEAD exactly
  CURRENT: 'bg-[rgb(61,180,242)]',
  PLANNING: 'bg-[rgb(247,154,99)]',
  COMPLETED: 'bg-[rgb(123,213,85)]',
  PAUSED: 'bg-[rgb(250,122,122)]',
  REPEATING: 'bg-[#3baeea]',
  DROPPED: 'bg-[rgb(200,80,80)]',
  PENDING: 'bg-[rgb(180,180,180)]'
}

export function StatusDot ({ status, className }: StatusDotProps) {
  return (
    <View className={cn('h-2 w-2 rounded-full', statusColors[status] ?? statusColors.offline, className)} />
  )
}
