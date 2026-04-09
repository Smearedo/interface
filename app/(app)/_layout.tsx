import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Stack } from 'expo-router'
import { Sidebar } from '@/components/Sidebar'

export default function AppLayout () {
  const { width } = useWindowDimensions()
  const showSidebar = width >= 768

  return (
    <View className="flex-1 flex-row bg-background">
      {showSidebar && <Sidebar />}
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#09090b' },
            animation: 'fade'
          }}
        />
      </View>
    </View>
  )
}
