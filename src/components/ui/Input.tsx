import React from 'react'
import { TextInput, type TextInputProps } from 'react-native'
import { cn } from '@/utils'

interface InputProps extends TextInputProps {
  className?: string
}

export function Input ({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground',
        className
      )}
      placeholderTextColor="#a1a1aa"
      {...props}
    />
  )
}
