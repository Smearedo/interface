import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import {
  User, Palette, Settings, Download, Puzzle, FileText
} from 'lucide-react-native'

interface SettingsItem {
  icon: React.ReactNode
  label: string
  description: string
  path: string
}

export default function SettingsPage () {
  const router = useRouter()

  const items: SettingsItem[] = [
    { icon: <User size={20} color="#a1a1aa" />, label: 'Accounts', description: 'AniList, MyAnimeList, Kitsu', path: '/(app)/settings/accounts' },
    { icon: <Palette size={20} color="#a1a1aa" />, label: 'Interface', description: 'Theme, appearance, layout', path: '/(app)/settings/interface' },
    { icon: <Settings size={20} color="#a1a1aa" />, label: 'App', description: 'General application settings', path: '/(app)/settings/app' },
    { icon: <Download size={20} color="#a1a1aa" />, label: 'Client', description: 'Torrent client settings', path: '/(app)/settings/client' },
    { icon: <Puzzle size={20} color="#a1a1aa" />, label: 'Extensions', description: 'Manage extensions', path: '/(app)/settings/extensions' },
    { icon: <FileText size={20} color="#a1a1aa" />, label: 'Changelog', description: 'View recent changes', path: '/(app)/settings/changelog' }
  ]

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">Settings</Text>
      </View>
      <ScrollView className="flex-1">
        {items.map((item) => (
          <Pressable
            key={item.path}
            onPress={() => router.push(item.path as never)}
            className="flex-row items-center px-4 py-4 border-b border-border"
          >
            {item.icon}
            <View className="ml-3 flex-1">
              <Text className="text-foreground text-sm font-medium">{item.label}</Text>
              <Text className="text-muted-foreground text-xs">{item.description}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}
