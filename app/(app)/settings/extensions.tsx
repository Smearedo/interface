import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Button, Select, Toggle } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'
import { videoResolutions, lookupPreferences } from '@/modules/settings'

export default function ExtensionsSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, padding: 16 }}>
        <Text className="text-xl font-bold text-foreground">Lookup Settings</Text>
        <SettingCard
          title="Torrent Quality"
          description="What quality to use when trying to find torrents. None might rarely find less results than specific qualities. This doesn't exclude other qualities from being found like 4K or weird DVD resolutions. Non-1080p resolutions might not be available for all shows, or find way less results."
        >
          <Select
            options={Object.entries(videoResolutions).map(([value, label]) => ({ value, label }))}
            value={settings.searchQuality}
            onValueChange={(v) => setSettings({ searchQuality: v as typeof settings.searchQuality })}
          />
        </SettingCard>
        <SettingCard
          title="Auto-Select Torrents"
          description="Automatically selects torrents based on quality and amount of seeders. Disable this to have more precise control over played torrents."
        >
          <Toggle
            value={settings.searchAutoSelect}
            onValueChange={(v) => setSettings({ searchAutoSelect: v })}
          />
        </SettingCard>
        <SettingCard
          title="Lookup Preference"
          description="What to prioritize when looking for and sorting results. Quality will focus on the best quality available which often means big file sizes, Size will focus on the smallest file size available, and Availability will pick results with the most peers regardless of size and quality."
        >
          <Select
            options={Object.entries(lookupPreferences).map(([value, label]) => ({ value, label }))}
            value={settings.lookupPreference}
            onValueChange={(v) => setSettings({ lookupPreference: v as typeof settings.lookupPreference })}
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">Extension Settings</Text>
        <View className="items-center justify-center py-20">
          <Text className="text-muted-foreground text-center">
            No extensions installed.{'\n'}Add extensions to enhance your experience.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
