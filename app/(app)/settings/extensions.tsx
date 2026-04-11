import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Button, Input, Select, Tabs, Toggle } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'
import { videoResolutions, lookupPreferences } from '@/modules/settings'

const extensionTabs = [
  { value: 'extensions', label: 'Extensions' },
  { value: 'repositories', label: 'Repositories' }
]

export default function ExtensionsSettingsPage () {
  const { settings, setSettings } = useSettingsStore()
  const [extensionUrl, setExtensionUrl] = useState('')

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
        <Tabs items={extensionTabs} defaultValue="extensions">
          {(activeTab) => (
            <View className="mt-3">
              {activeTab === 'extensions' && (
                <View className="gap-3">
                  <View className="flex-row gap-2">
                    <Input
                      value={extensionUrl}
                      onChangeText={setExtensionUrl}
                      placeholder="Extension URL or Repository"
                      className="flex-1 bg-background"
                    />
                    <Button variant="secondary" size="default">
                      <Text className="text-secondary-foreground text-sm font-bold">Add Extension</Text>
                    </Button>
                  </View>
                  <View className="items-center justify-center py-16">
                    <Text className="text-muted-foreground text-center">
                      No extensions installed.{'\n'}Add extensions to enhance your experience.
                    </Text>
                  </View>
                </View>
              )}
              {activeTab === 'repositories' && (
                <View className="gap-3">
                  <View className="flex-row gap-2">
                    <Input
                      value=""
                      placeholder="Repository URL"
                      className="flex-1 bg-background"
                    />
                    <Button variant="secondary" size="default">
                      <Text className="text-secondary-foreground text-sm font-bold">Add Repository</Text>
                    </Button>
                  </View>
                  <View className="items-center justify-center py-16">
                    <Text className="text-muted-foreground text-center">
                      No repositories added.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </Tabs>
      </ScrollView>
    </View>
  )
}
