import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Input, Toggle } from '@/components/ui'
import { SettingCard } from '@/components'
import { useSettingsStore } from '@/stores/settings'

interface CheckResult {
  status: 'warning' | 'success' | 'error'
  text: string
}

export default function NetworkSetupPage () {
  const router = useRouter()
  const { settings, setSettings } = useSettingsStore()
  const [speedCheck, setSpeedCheck] = useState<CheckResult | null>(null)
  const [portCheck, setPortCheck] = useState<CheckResult | null>(null)
  const [checkingSpeed, setCheckingSpeed] = useState(true)
  const [checkingPort, setCheckingPort] = useState(true)
  const [hasForwarding, setHasForwarding] = useState(false)

  useEffect(() => {
    // Simulate speed check
    const speedTimer = setTimeout(() => {
      setSpeedCheck({ status: 'success', text: 'Network connection available.' })
      setCheckingSpeed(false)
    }, 2000)

    // Simulate port check
    const portTimer = setTimeout(() => {
      setPortCheck({ status: 'error', text: 'Not available. Peer discovery will suffer. Streaming old, poorly seeded anime might be impossible.' })
      setHasForwarding(false)
      setCheckingPort(false)
    }, 3000)

    return () => {
      clearTimeout(speedTimer)
      clearTimeout(portTimer)
    }
  }, [])

  const allSettled = !checkingSpeed && !checkingPort

  return (
    <View className="flex-1 bg-background">
      {/* Progress indicator */}
      <View className="px-6 mt-14 w-full items-center pb-5">
        <View className="w-full max-w-4xl relative flex-row justify-around">
          <View className="absolute top-5 left-0 right-0 h-2.5 rounded-full bg-secondary overflow-hidden">
            <View className="h-full bg-white" style={{ width: '50%' }} />
          </View>
          <View className="w-20 items-center z-10">
            <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
              <Text className="text-background font-bold">💾</Text>
            </View>
            <Text className="mt-3 font-bold text-foreground">Storage</Text>
          </View>
          <View className="w-20 items-center z-10">
            <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
              <Text className="text-background font-bold">🌐</Text>
            </View>
            <Text className="mt-3 font-bold text-foreground">Network</Text>
          </View>
          <View className="w-20 items-center z-10">
            <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center">
              <Text className="text-muted-foreground">🧩</Text>
            </View>
            <Text className="mt-3 font-bold text-muted-foreground">Extensions</Text>
          </View>
        </View>
      </View>

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
            <Text className="text-foreground text-sm pr-3">Port</Text>
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
          {/* Speed check */}
          <View className="flex-row items-center">
            {checkingSpeed ? (
              <>
                <Text className="text-muted-foreground text-xs mr-2.5">⏳</Text>
                <Text className="text-foreground text-sm">Network Speed - </Text>
                <Text className="text-muted-foreground text-xs">Checking network speed...</Text>
              </>
            ) : speedCheck ? (
              <>
                <Text className={`mr-2.5 ${speedCheck.status === 'success' ? 'text-green-500' : speedCheck.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {speedCheck.status === 'success' ? '✓' : speedCheck.status === 'warning' ? '!' : '✗'}
                </Text>
                <Text className="text-foreground text-sm">Network Speed - </Text>
                <Text className="text-muted-foreground text-xs flex-1">{speedCheck.text}</Text>
              </>
            ) : null}
          </View>
          {/* Port check */}
          <View className="flex-row items-center">
            {checkingPort ? (
              <>
                <Text className="text-muted-foreground text-xs mr-2.5">⏳</Text>
                <Text className="text-foreground text-sm">Port Forwarding - </Text>
                <Text className="text-muted-foreground text-xs">Checking port forwarding availability...</Text>
              </>
            ) : portCheck ? (
              <>
                <Text className={`mr-2.5 ${portCheck.status === 'success' ? 'text-green-500' : portCheck.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {portCheck.status === 'success' ? '✓' : portCheck.status === 'warning' ? '!' : '✗'}
                </Text>
                <Text className="text-foreground text-sm">Port Forwarding - </Text>
                <Text className="text-muted-foreground text-xs flex-1">{portCheck.text}</Text>
              </>
            ) : null}
          </View>
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
