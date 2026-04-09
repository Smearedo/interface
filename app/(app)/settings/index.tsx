import React from 'react'
import { View, Text, ScrollView, Pressable, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { Heart } from 'lucide-react-native'
import { APP_VERSION } from '@/modules/constants'

interface NavItem {
  title: string
  path: string
}

const items: NavItem[] = [
  { title: 'Player', path: '/(app)/settings/player' },
  { title: 'Client', path: '/(app)/settings/client' },
  { title: 'Interface', path: '/(app)/settings/interface' },
  { title: 'Extensions', path: '/(app)/settings/extensions' },
  { title: 'Accounts', path: '/(app)/settings/accounts' },
  { title: 'App', path: '/(app)/settings/app' },
  { title: 'Changelog', path: '/(app)/settings/changelog' }
]

export default function SettingsPage () {
  const router = useRouter()

  return (
    <View className="flex-1 bg-background p-3">
      <View className="mb-1">
        <Text className="text-foreground text-2xl font-bold">Settings</Text>
        <Text className="text-muted-foreground">
          Manage your app settings, preferences and accounts.
        </Text>
      </View>
      <View className="h-px bg-border my-3" />
      <ScrollView className="flex-1">
        {/* Support the Project box */}
        <Pressable
          onPress={() => Linking.openURL('https://github.com/sponsors/ThaUnknown/')}
          className="px-6 py-4 rounded bg-fuchsia-400 mb-4"
        >
          <Text className="font-bold text-secondary text-base">Support the Project</Text>
          <Text className="text-xs text-secondary mt-1">Please consider supporting the development of Hayase by donating!</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Heart size={18} color="#fa68b6" fill="#fa68b6" />
            <Text className="font-bold text-secondary">Donate</Text>
          </View>
        </Pressable>

        {/* Navigation items */}
        {items.map((item) => (
          <Pressable
            key={item.path}
            onPress={() => router.push(item.path as never)}
            className="px-4 py-3 rounded-md hover:bg-accent"
          >
            <Text className="text-foreground text-sm font-medium">{item.title}</Text>
          </Pressable>
        ))}

        {/* Version info at bottom */}
        <View className="mt-auto pt-5 px-2">
          <Text className="text-muted-foreground text-xs font-light">Interface v{APP_VERSION}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
