import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface LogoProps {
  size?: number
  color?: string
}

export function Logo ({ size = 40, color = '#ffffff' }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 66.145833 66.145833" fill={color}>
      <Path d="M.00000117 61.5156237V4.6302097l66.145831 37.041664v19.84375l-47.624995-26.72291v16.40416zm66.145831-30.42707-23.5479 16-13.229174 23.547916-13.22917Z" />
    </Svg>
  )
}
