import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'

export default function ClientSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">Client Settings</Text>
      </View>
      <ScrollView className="flex-1">
        <SettingCard title="Persist Torrents" description="Keep torrents after closing the app">
          <Toggle
            value={settings.torrentPersist}
            onValueChange={(v) => setSettings({ torrentPersist: v })}
          />
        </SettingCard>
        <SettingCard title="DHT" description="Enable Distributed Hash Table">
          <Toggle
            value={settings.torrentDHT}
            onValueChange={(v) => setSettings({ torrentDHT: v })}
          />
        </SettingCard>
        <SettingCard title="PeX" description="Enable Peer Exchange">
          <Toggle
            value={settings.torrentPeX}
            onValueChange={(v) => setSettings({ torrentPeX: v })}
          />
        </SettingCard>
        <SettingCard title="Streamed Download" description="Download while streaming">
          <Toggle
            value={settings.torrentStreamedDownload}
            onValueChange={(v) => setSettings({ torrentStreamedDownload: v })}
          />
        </SettingCard>
        <SettingCard title="DNS over HTTPS" description="Enable DoH for privacy">
          <Toggle
            value={settings.enableDoH}
            onValueChange={(v) => setSettings({ enableDoH: v })}
          />
        </SettingCard>
      </ScrollView>
    </View>
  )
}
