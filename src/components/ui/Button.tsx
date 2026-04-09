import React from 'react'
import { Pressable, Text, type PressableProps } from 'react-native'
import { cn } from '@/utils'

interface ButtonProps extends PressableProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
  className?: string
  textClassName?: string
}

const variantStyles = {
  default: 'bg-primary',
  destructive: 'bg-destructive',
  outline: 'border border-border bg-transparent',
  secondary: 'bg-secondary',
  ghost: 'bg-transparent',
  link: 'bg-transparent'
}

const variantTextStyles = {
  default: 'text-primary-foreground',
  destructive: 'text-destructive-foreground',
  outline: 'text-foreground',
  secondary: 'text-secondary-foreground',
  ghost: 'text-foreground',
  link: 'text-primary underline'
}

const sizeStyles = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10'
}

export function Button ({
  variant = 'default',
  size = 'default',
  children,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-center rounded-md',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn('text-sm font-medium', variantTextStyles[variant], textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
