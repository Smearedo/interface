import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle, Slider } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'

export default function InterfaceSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, padding: 16 }}>
        <Text className="text-xl font-bold text-foreground">Visibility Settings</Text>
        <SettingCard
          title="Show Hentai"
          description={"Shows hentai content throughout the app. If disabled all hentai content will be hidden and not shown in search results, but shown if present in your list.\n\nThis is also an AniList account setting, so make sure it is enabled in account settings as well to avoid inconsistencies."}
        >
          <Toggle
            value={settings.showHentai}
            onValueChange={(v) => setSettings({ showHentai: v })}
          />
        </SettingCard>
        <SettingCard
          title="Hide Spoilers"
          description="Hides potential spoilers such as titles, descriptions, episode images and ratings throughout the app."
        >
          <Toggle
            value={settings.hideSpoilers}
            onValueChange={(v) => setSettings({ hideSpoilers: v })}
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">UI Settings</Text>
        <SettingCard
          title="Navigation Buttons"
          description="Show backwards/forwards navigation buttons for when mouse buttons aren't available."
        >
          <Toggle
            value={settings.showNavigation}
            onValueChange={(v) => setSettings({ showNavigation: v })}
          />
        </SettingCard>
      </ScrollView>
    </View>
  )
}
