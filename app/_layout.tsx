import 'react-native-reanimated'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import {
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  Nunito_400Regular_Italic,
  Nunito_700Bold_Italic
} from '@expo-google-fonts/nunito'
import * as SplashScreen from 'expo-splash-screen'
import '../src/global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout () {
  const [fontsLoaded] = useFonts({
    'Nunito-ExtraLight': Nunito_200ExtraLight,
    'Nunito-Light': Nunito_300Light,
    Nunito: Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
    'Nunito-Black': Nunito_900Black,
    'Nunito-Italic': Nunito_400Regular_Italic,
    'Nunito-BoldItalic': Nunito_700Bold_Italic
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
