import React from 'react'
import { Stack } from 'expo-router'

export default function AnimeLayout () {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#09090b' },
        animation: 'slide_from_right'
      }}
    />
  )
}
