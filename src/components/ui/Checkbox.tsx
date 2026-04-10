import React from 'react'
import { Pressable, View } from 'react-native'
import { Check } from 'lucide-react-native'
import { cn } from '@/utils'

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox ({ checked = false, onCheckedChange, disabled = false, className }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        'h-5 w-5 shrink-0 rounded-sm border border-primary items-center justify-center',
        checked && 'bg-primary',
        disabled && 'opacity-50',
        className
      )}
    >
      {checked && (
        <View className="items-center justify-center">
          <Check size={14} color={checked ? '#18181b' : 'transparent'} strokeWidth={3} />
        </View>
      )}
    </Pressable>
  )
}
