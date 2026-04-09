import React, { useState } from 'react'
import { View, Text, Pressable, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui'
import { Logo } from '@/components/icons'
import { WEB_URL } from '@/modules/constants'

export default function SetupPage () {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Logo size={208} />
      <View className="items-center mt-14">
        <View className="relative">
          <Text className="text-foreground text-5xl font-bold text-center">Welcome to Hayase</Text>
          <Text className="text-theme text-lg absolute -top-5 -right-20 rotate-12" style={{ transform: [{ rotate: '12deg' }] }}>Previously known as Miru!</Text>
        </View>
      </View>
      <Text className="text-muted-foreground text-center mt-3 px-3">Let's set up your perfect streaming environment.</Text>

      <View className="flex-row items-center pt-12 pb-3 px-5 gap-2">
        <Pressable
          onPress={() => setChecked(!checked)}
          className={`w-5 h-5 rounded border ${checked ? 'bg-foreground border-foreground' : 'border-muted-foreground'} items-center justify-center`}
        >
          {checked && <Text className="text-background text-xs font-bold">✓</Text>}
        </Pressable>
        <Text className="text-muted-foreground text-base font-medium leading-snug flex-1">
          I agree to the{' '}
          <Text className="text-primary underline" onPress={() => Linking.openURL(`${WEB_URL}/terms`)}>Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-primary underline" onPress={() => Linking.openURL(`${WEB_URL}/privacy`)}>Privacy Policy</Text>
        </Text>
      </View>

      <Button
        disabled={!checked}
        className="text-lg font-bold"
        onPress={() => checked && router.replace('/setup/storage' as never)}
      >
        {!checked ? 'Accept terms to continue' : 'Start Setup'}
      </Button>
    </View>
  )
}
