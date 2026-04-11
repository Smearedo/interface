import React from 'react'
import { ScrollView, type ScrollViewProps } from 'react-native'
import { cn } from '@/utils'

interface ScrollAreaProps extends ScrollViewProps {
  className?: string
  children: React.ReactNode
}

export function ScrollArea ({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollView
      className={cn('flex-1', className)}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  )
}
