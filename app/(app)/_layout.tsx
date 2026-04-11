import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import { Stack } from 'expo-router'
import { Sidebar } from '@/components/Sidebar'
import { Online } from '@/components/Online'

export default function AppLayout () {
  const { width } = useWindowDimensions()
  const showSidebar = width >= 768

  return (
    <View className="flex-1 flex-col bg-background">
      <Online />
      <View className="flex-1 flex-row">
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
    </View>
  )
}
