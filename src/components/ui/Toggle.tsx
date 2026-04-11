import React from 'react'
import { Switch, type SwitchProps } from 'react-native'

interface ToggleProps extends SwitchProps {
  className?: string
}

export function Toggle ({ value, onValueChange, ...props }: ToggleProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#27272a', true: '#fafafa' }}
      thumbColor={value ? '#18181b' : '#a1a1aa'}
      ios_backgroundColor="#27272a"
      {...props}
    />
  )
}
