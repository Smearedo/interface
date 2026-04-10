import React from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { SettingCard } from '@/components'
import { Button, Toggle, Select } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'

const debugOpts = {
  '': 'None',
  '*': 'All',
  'torrent:*,webtorrent:*,simple-peer,bittorrent-protocol,bittorrent-dht,bittorrent-lsd,torrent-discovery,bittorrent-tracker:*,ut_metadata,nat-pmp,nat-api': 'Torrent',
  'ui:*': 'Interface'
}

export default function AppSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  const handleReset = () => {
    Alert.alert(
      'Reset Everything',
      'This will reset all settings to their defaults. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset all settings
            useSettingsStore.getState().resetSettings()
          }
        }
      ]
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, padding: 16 }}>
        <Text className="text-xl font-bold text-foreground">App Settings</Text>

        <View className="flex-row gap-3">
          <Button className="flex-1 font-bold" onPress={() => {}}>
            Import Settings From File
          </Button>
          <Button className="flex-1 font-bold" onPress={() => {}}>
            Export Settings To File
          </Button>
        </View>
        <Button variant="destructive" className="font-bold" onPress={handleReset}>
          Reset EVERYTHING To Default
        </Button>

        <Text className="text-xl font-bold text-foreground mt-4">Debug Settings</Text>
        <SettingCard
          title="Logging Levels"
          description="Enable logging of specific parts of the app. These logs are saved to %appdata$/Hayase/logs/main.log or ~/config/Hayase/logs/main.log."
        >
          <Select
            options={Object.entries(debugOpts).map(([value, label]) => ({ value, label }))}
            value=""
            onValueChange={() => {}}
          />
        </SettingCard>

        <SettingCard
          title="App and Device Info"
          description="Copy app and device debug info and capabilities, such as GPU information, GPU capabilities, version information and settings to clipboard."
        >
          <Button className="font-bold" onPress={() => {}}>
            Copy To Clipboard
          </Button>
        </SettingCard>
      </ScrollView>
    </View>
  )
}
