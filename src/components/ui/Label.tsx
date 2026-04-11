import React from 'react'
import { Text } from 'react-native'
import { cn } from '@/utils'

interface LabelProps {
  children: React.ReactNode
  className?: string
  /** Ignored on React Native; included for API compatibility with web. */
  htmlFor?: string
}

export function Label ({ children, className, htmlFor: _htmlFor }: LabelProps) {
  return (
    <Text className={cn('text-sm font-medium leading-none text-foreground', className)}>
      {children}
    </Text>
  )
}
