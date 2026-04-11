import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle, Input } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'

export default function ClientSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, padding: 16 }}>
        <Text className="text-xl font-bold text-foreground">Security Settings</Text>
        <SettingCard
          title="Use DNS Over HTTPS"
          description="Enables DNS Over HTTPS, useful if your ISP blocks certain domains."
        >
          <Toggle
            value={settings.enableDoH}
            onValueChange={(v) => setSettings({ enableDoH: v })}
          />
        </SettingCard>
        <SettingCard
          title="DNS Over HTTPS URL"
          description="What URL to use for querying DNS Over HTTPS."
        >
          <Input
            value={settings.doHURL}
            onChangeText={(v) => setSettings({ doHURL: v })}
            className="w-80 bg-background"
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">Client Settings</Text>
        <SettingCard
          title="Torrent Download Location"
          description={`Path to the folder used to store torrents. By default this is the OS's TEMP/TMP cache folder, which might lose data when your OS tries to reclaim storage.`}
        >
          <Input
            value={settings.torrentPath}
            editable={false}
            placeholder="/tmp/webtorrent"
            className="bg-background"
          />
        </SettingCard>
        <SettingCard
          title="Persist Files"
          description="Keeps torrents files instead of deleting them after a new torrent is played. This doesn't seed the files, only keeps them on your drive. This will quickly fill up your storage."
        >
          <Toggle
            value={settings.torrentPersist}
            onValueChange={(v) => setSettings({ torrentPersist: v })}
          />
        </SettingCard>
        <SettingCard
          title="Streamed Download"
          description="Only downloads the data that's directly needed for playback, down to the minute, instead of downloading an entire batch of episodes. Will not buffer ahead more than a few seconds, and will stop downloading once the few second buffer is filled. Saves bandwidth and reduces strain on the peer swarm."
        >
          <Toggle
            value={settings.torrentStreamedDownload}
            onValueChange={(v) => setSettings({ torrentStreamedDownload: v })}
          />
        </SettingCard>
        <SettingCard
          title="Transfer Speed Limit"
          description="Download/Upload speed limit for torrents, higher values increase CPU usage, and values higher than your storage write speeds will quickly fill up RAM."
        >
          <View className="flex-row items-center border border-input rounded-md">
            <Input
              keyboardType="decimal-pad"
              value={String(settings.torrentSpeed)}
              onChangeText={(v) => setSettings({ torrentSpeed: parseFloat(v) || 0 })}
              className="w-32 bg-background border-0"
            />
            <Text className="text-foreground text-sm pr-3">Mb/s</Text>
          </View>
        </SettingCard>
      </ScrollView>
    </View>
  )
}
