import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Input, Toggle } from '@/components/ui'
import { SettingCard } from '@/components'
import { SetupProgress } from '@/components/SetupProgress'
import { SetupFooterCheck, type FooterCheck } from '@/components/SetupFooter'
import { useSettingsStore } from '@/stores/settings'

export default function NetworkSetupPage () {
  const router = useRouter()
  const { settings, setSettings } = useSettingsStore()
  const [hasForwarding, setHasForwarding] = useState(false)

  const [speedCheck, setSpeedCheck] = useState<FooterCheck>({
    label: 'Network Speed',
    description: 'Checking network speed...',
    status: 'checking'
  })
  const [portCheck, setPortCheck] = useState<FooterCheck>({
    label: 'Port Forwarding',
    description: 'Checking port forwarding availability...',
    status: 'checking'
  })

  useEffect(() => {
    // Simulate speed check
    const speedTimer = setTimeout(() => {
      setSpeedCheck(prev => ({ ...prev, status: 'success', text: 'Network connection available.' }))
    }, 2000)

    // Simulate port check
    const portTimer = setTimeout(() => {
      setPortCheck(prev => ({ ...prev, status: 'error', text: 'Not available. Peer discovery will suffer. Streaming old, poorly seeded anime might be impossible.' }))
      setHasForwarding(false)
    }, 3000)

    return () => {
      clearTimeout(speedTimer)
      clearTimeout(portTimer)
    }
  }, [])

  const allSettled = speedCheck.status !== 'checking' && portCheck.status !== 'checking'

  return (
    <View className="flex-1 bg-background">
      <SetupProgress step={1} />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ gap: 12 }}>
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
          title="Forwarded Torrent Port"
          description="Forwarded port used for incoming torrent connections. 0 automatically finds an open unused port. Change this to a specific port if you forwarded manually, or if you use a VPN."
        >
          <View className="flex-row items-center border border-input rounded-md">
            <Input
              keyboardType="numeric"
              value={String(settings.torrentPort)}
              onChangeText={(v) => setSettings({ torrentPort: parseInt(v) || 0 })}
              className="w-32 bg-background border-0"
            />
          </View>
        </SettingCard>
        <View className="flex-row items-center gap-3 px-4">
          <Text className="text-muted-foreground text-xs">
            Port forwarding is <Text className="font-bold text-primary">{hasForwarding ? 'AVAILABLE' : 'NOT AVAILABLE'}</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Footer with checks */}
      <View className="px-6 w-full">
        <View className="border border-border rounded-t-lg bg-neutral-950 p-4 gap-3">
          <SetupFooterCheck check={speedCheck} />
          <SetupFooterCheck check={portCheck} />
        </View>
        <View className="flex-row items-center justify-between bg-neutral-950 border border-t-0 border-border rounded-b-lg py-4 px-8">
          <Button variant="secondary" className="w-24" onPress={() => router.push('/setup/storage' as never)}>
            Prev
          </Button>
          {allSettled ? (
            <Button className="font-semibold w-24" onPress={() => router.push('/setup/extensions' as never)}>
              Next
            </Button>
          ) : (
            <Button className="font-semibold" disabled>
              Waiting for checks...
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}
