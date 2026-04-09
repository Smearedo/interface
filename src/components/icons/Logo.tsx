import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface LogoProps {
  size?: number
  color?: string
}

export function Logo ({ size = 40, color = '#ffffff' }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
