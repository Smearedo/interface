import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import '../src/global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout () {
  const [fontsLoaded] = useFonts({
    Nunito: require('../assets/Molot-webfont.woff')
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'fade'
        }}
      />
    </View>
  )
}
