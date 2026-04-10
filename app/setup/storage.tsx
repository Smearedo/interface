import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Input, Toggle } from '@/components/ui'
import { SettingCard } from '@/components'
import { SetupProgress } from '@/components/SetupProgress'
import { SetupFooterCheck, type FooterCheck } from '@/components/SetupFooter'
import { useSettingsStore } from '@/stores/settings'

export default function StorageSetupPage () {
  const router = useRouter()
  const { settings, setSettings } = useSettingsStore()
  const [spaceCheck, setSpaceCheck] = useState<FooterCheck>({
    label: 'Storage Space',
    description: 'Checking available storage space...',
    status: 'checking'
  })

  useEffect(() => {
    // Simulate space check for mobile
    const timer = setTimeout(() => {
      setSpaceCheck(prev => ({ ...prev, status: 'success', text: 'Storage space available.' }))
    }, 1000)
    return () => clearTimeout(timer)
  }, [settings.torrentPath])

  const allSettled = spaceCheck.status !== 'checking'

  return (
    <View className="flex-1 bg-background">
      <SetupProgress step={0} />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ gap: 12 }}>
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
      </ScrollView>

      {/* Footer with checks */}
      <View className="px-6 w-full">
        <View className="border border-border rounded-t-lg bg-neutral-950 p-4">
          <SetupFooterCheck check={spaceCheck} />
        </View>
        <View className="flex-row items-center justify-between bg-neutral-950 border border-t-0 border-border rounded-b-lg py-4 px-8">
          <Button variant="secondary" className="w-24" onPress={() => router.back()}>
            Prev
          </Button>
          <Button
            className="font-semibold w-24"
            disabled={!allSettled}
            onPress={() => router.push('/setup/network' as never)}
          >
            Next
          </Button>
        </View>
      </View>
    </View>
  )
}
