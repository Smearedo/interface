import React, { useEffect, useRef } from 'react'
import { Animated, type ViewStyle } from 'react-native'
import { cn } from '@/utils'

interface SkeletonProps {
  className?: string
  style?: ViewStyle
}

export function Skeleton ({ className, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      className={cn('rounded-md bg-muted', className)}
      style={[style, { opacity }]}
    />
  )
}
