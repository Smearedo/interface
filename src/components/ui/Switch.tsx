import React from 'react'
import { type SwitchProps } from 'react-native'
import { Toggle } from './Toggle'

/**
 * Switch component — re-exports the existing Toggle component
 * for API compatibility with the head repo which uses "Switch".
 */
export const Switch: React.FC<SwitchProps & { className?: string }> = Toggle
