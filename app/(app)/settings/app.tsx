import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle, Select } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'
import { videoResolutions, lookupPreferences } from '@/modules/settings'

export default function AppSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">App Settings</Text>
      </View>
      <ScrollView className="flex-1">
        <SettingCard title="Autoplay" description="Auto-play next episode">
          <Toggle
            value={settings.playerAutoplay}
            onValueChange={(v) => setSettings({ playerAutoplay: v })}
          />
        </SettingCard>
        <SettingCard title="Auto-Complete" description="Mark episode as watched automatically">
          <Toggle
            value={settings.playerAutocomplete}
            onValueChange={(v) => setSettings({ playerAutocomplete: v })}
          />
        </SettingCard>
        <SettingCard title="Skip Opening" description="Auto-skip opening themes">
          <Toggle
            value={settings.playerSkip}
            onValueChange={(v) => setSettings({ playerSkip: v })}
          />
        </SettingCard>
        <SettingCard title="Skip Filler" description="Auto-skip filler episodes">
          <Toggle
            value={settings.playerSkipFiller}
            onValueChange={(v) => setSettings({ playerSkipFiller: v })}
          />
        </SettingCard>
        <SettingCard title="Search Quality">
          <Select
            options={Object.entries(videoResolutions).map(([value, label]) => ({ value, label }))}
            value={settings.searchQuality}
            onValueChange={(v) => setSettings({ searchQuality: v as typeof settings.searchQuality })}
          />
        </SettingCard>
        <SettingCard title="Lookup Preference">
          <Select
            options={Object.entries(lookupPreferences).map(([value, label]) => ({ value, label }))}
            value={settings.lookupPreference}
            onValueChange={(v) => setSettings({ lookupPreference: v as typeof settings.lookupPreference })}
          />
        </SettingCard>
        <SettingCard title="Auto-Select" description="Automatically select best torrent result">
          <Toggle
            value={settings.searchAutoSelect}
            onValueChange={(v) => setSettings({ searchAutoSelect: v })}
          />
        </SettingCard>
      </ScrollView>
    </View>
  )
}
