import React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

interface PictureInPictureProps {
  size?: number
  color?: string
}

export function PictureInPicture ({ size = 24, color = 'currentColor' }: PictureInPictureProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3" />
      <Rect width="10" height="7" x="12" y="13" rx="2" fill={color} />
    </Svg>
  )
}
