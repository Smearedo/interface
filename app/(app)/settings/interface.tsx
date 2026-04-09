import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'

export default function InterfaceSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">Interface</Text>
      </View>
      <ScrollView className="flex-1">
        <SettingCard title="Show Navigation" description="Always show navigation labels">
          <Toggle
            value={settings.showNavigation}
            onValueChange={(v) => setSettings({ showNavigation: v })}
          />
        </SettingCard>
        <SettingCard title="Minimal Player UI" description="Show a minimal player interface">
          <Toggle
            value={settings.minimalPlayerUI}
            onValueChange={(v) => setSettings({ minimalPlayerUI: v })}
          />
        </SettingCard>
        <SettingCard title="Hide Spoilers" description="Hide spoiler content in descriptions">
          <Toggle
            value={settings.hideSpoilers}
            onValueChange={(v) => setSettings({ hideSpoilers: v })}
          />
        </SettingCard>
        <SettingCard title="Show Adult Content" description="Show adult (18+) content in results">
          <Toggle
            value={settings.showHentai}
            onValueChange={(v) => setSettings({ showHentai: v })}
          />
        </SettingCard>
      </ScrollView>
    </View>
  )
}
