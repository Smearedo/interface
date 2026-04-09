import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, Linking } from 'react-native'
import { Button, Input, Toggle, Avatar, Separator } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'

const titleTypes = {
  ROMAJI: 'Romaji (Shingeki no Kyojin)',
  ENGLISH: 'English (Attack on Titan)',
  NATIVE: 'Native (進撃の巨人)',
  ROMAJI_STYLISED: 'Romaji Stylised',
  ENGLISH_STYLISED: 'English Stylised',
  NATIVE_STYLISED: 'Native Stylised'
} as const

export default function AccountsSettingsPage () {
  const { anilistToken, malToken, kitsuToken } = useAuthStore()
  const [kitsuLogin, setKitsuLogin] = useState('')
  const [kitsuPassword, setKitsuPassword] = useState('')

  const handleAnilistLogin = () => {
    const clientId = '26159'
    const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`
    Linking.openURL(url)
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* AniList */}
      <View>
        <View className="bg-neutral-900 px-6 py-4 rounded-t-md flex-row items-center gap-3">
          {anilistToken ? (
            <View className="flex-row items-center gap-3 flex-1">
              <Avatar size={32} fallback="A" />
              <View>
                <Text className="text-foreground text-sm">Connected</Text>
                <Text className="text-muted-foreground text-[9px] leading-snug">AniList</Text>
              </View>
            </View>
          ) : (
            <View className="flex-1">
              <Text className="text-foreground text-sm">Not logged in</Text>
              <Text className="text-muted-foreground text-[9px] leading-snug">AniList</Text>
            </View>
          )}
        </View>
        <View className="bg-neutral-950 px-6 py-4 rounded-b-md flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            {anilistToken ? (
              <Button variant="secondary" onPress={() => useAuthStore.getState().setAnilistToken(null)}>
                Logout
              </Button>
            ) : (
              <Button variant="secondary" onPress={handleAnilistLogin}>
                Login
              </Button>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            <Toggle value={true} onValueChange={() => {}} />
            <Text className="text-foreground text-sm">Enable Sync</Text>
          </View>
        </View>
      </View>

      {/* Kitsu */}
      <View>
        <View className="bg-neutral-900 px-6 py-4 rounded-t-md flex-row items-center gap-3">
          {kitsuToken ? (
            <View className="flex-row items-center gap-3 flex-1">
              <Avatar size={32} fallback="K" />
              <View>
                <Text className="text-foreground text-sm">Connected</Text>
                <Text className="text-muted-foreground text-[9px] leading-snug">Kitsu</Text>
              </View>
            </View>
          ) : (
            <View className="flex-1">
              <Text className="text-foreground text-sm">Not logged in</Text>
              <Text className="text-muted-foreground text-[9px] leading-snug">Kitsu</Text>
            </View>
          )}
        </View>
        <View className="bg-neutral-950 px-6 py-4 rounded-b-md flex-row justify-between items-center">
          {kitsuToken ? (
            <Button variant="secondary" onPress={() => useAuthStore.getState().setKitsuToken(null)}>
              Logout
            </Button>
          ) : (
            <Button variant="secondary" onPress={() => {}}>
              Login
            </Button>
          )}
          <View className="flex-row items-center gap-2">
            <Toggle value={true} onValueChange={() => {}} />
            <Text className="text-foreground text-sm">Enable Sync</Text>
          </View>
        </View>
      </View>

      {/* MyAnimeList */}
      <View>
        <View className="bg-neutral-900 px-6 py-4 rounded-t-md flex-row items-center gap-3">
          {malToken ? (
            <View className="flex-row items-center gap-3 flex-1">
              <Avatar size={32} fallback="M" />
              <View>
                <Text className="text-foreground text-sm">Connected</Text>
                <Text className="text-muted-foreground text-[9px] leading-snug">MyAnimeList</Text>
              </View>
            </View>
          ) : (
            <View className="flex-1">
              <Text className="text-foreground text-sm">Not logged in</Text>
              <Text className="text-muted-foreground text-[9px] leading-snug">MyAnimeList</Text>
            </View>
          )}
        </View>
        <View className="bg-neutral-950 px-6 py-4 rounded-b-md flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            {malToken ? (
              <Button variant="secondary" onPress={() => useAuthStore.getState().setMalToken(null)}>
                Logout
              </Button>
            ) : (
              <Button variant="secondary" onPress={() => {}}>
                Login
              </Button>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            <Toggle value={true} onValueChange={() => {}} />
            <Text className="text-foreground text-sm">Enable Sync</Text>
          </View>
        </View>
      </View>

      {/* Other / Local */}
      <View>
        <View className="bg-neutral-900 px-6 py-4 rounded-t-md flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-foreground text-sm">Other</Text>
            <Text className="text-muted-foreground text-[9px] leading-snug">Local</Text>
          </View>
        </View>
        <View className="bg-neutral-950 px-6 py-4 rounded-b-md flex-row justify-end items-center h-17 gap-4">
          <Text className="text-muted-foreground text-xs">Works Offline</Text>
          <View className="flex-row items-center gap-2">
            <Toggle value={true} onValueChange={() => {}} />
            <Text className="text-foreground text-sm">Enable Sync</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
