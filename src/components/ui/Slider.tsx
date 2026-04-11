import React from 'react'
import { View } from 'react-native'
import { cn } from '@/utils'

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function Slider ({ value, min = 0, max = 100, className }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <View className={cn('h-2 w-full rounded-full bg-secondary', className)}>
      <View
        className="h-full rounded-full bg-primary"
        style={{ width: `${percentage}%` }}
      />
    </View>
  )
}
