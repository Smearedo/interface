import React from 'react'
import { View, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'

interface BannerImageProps {
  uri?: string | null
  height?: number
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export function BannerImage ({ uri, height = 200 }: BannerImageProps) {
  if (!uri) return null

  return (
    <View style={{ width: SCREEN_WIDTH, height, position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', '#09090b']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.6 }}
      />
    </View>
  )
}
