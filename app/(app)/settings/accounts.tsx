import React from 'react'
import { View, Text, ScrollView, Linking } from 'react-native'
import { Button, Avatar, Separator } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'

export default function AccountsSettingsPage () {
  const { anilistToken, malToken, kitsuToken, logout } = useAuthStore()

  const handleAnilistLogin = () => {
    const clientId = '26159'
    const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`
    Linking.openURL(url)
  }

  const handleMalLogin = () => {
    // MAL OAuth flow would go here
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">Accounts</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-4">
        {/* AniList */}
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-base mb-2">AniList</Text>
          {anilistToken ? (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Avatar size={32} fallback="A" />
                <Text className="text-foreground text-sm">Connected</Text>
              </View>
              <Button variant="destructive" size="sm" onPress={() => useAuthStore.getState().setAnilistToken(null)}>
                Disconnect
              </Button>
            </View>
          ) : (
            <Button variant="outline" onPress={handleAnilistLogin} className="w-full">
              Connect AniList
            </Button>
          )}
        </View>

        <Separator className="mb-6" />

        {/* MyAnimeList */}
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-base mb-2">MyAnimeList</Text>
          {malToken ? (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Avatar size={32} fallback="M" />
                <Text className="text-foreground text-sm">Connected</Text>
              </View>
              <Button variant="destructive" size="sm" onPress={() => useAuthStore.getState().setMalToken(null)}>
                Disconnect
              </Button>
            </View>
          ) : (
            <Button variant="outline" onPress={handleMalLogin} className="w-full">
              Connect MyAnimeList
            </Button>
          )}
        </View>

        <Separator className="mb-6" />

        {/* Kitsu */}
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-base mb-2">Kitsu</Text>
          {kitsuToken ? (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Avatar size={32} fallback="K" />
                <Text className="text-foreground text-sm">Connected</Text>
              </View>
              <Button variant="destructive" size="sm" onPress={() => useAuthStore.getState().setKitsuToken(null)}>
                Disconnect
              </Button>
            </View>
          ) : (
            <Button variant="outline" onPress={() => {}} className="w-full">
              Connect Kitsu
            </Button>
          )}
        </View>

        {(anilistToken || malToken || kitsuToken) && (
          <>
            <Separator className="mb-6" />
            <Button variant="destructive" onPress={logout} className="w-full">
              Logout All Accounts
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  )
}
