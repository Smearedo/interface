import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Input, Toggle } from '@/components/ui'
import { SettingCard } from '@/components'
import { useSettingsStore } from '@/stores/settings'
import { fastPrettyBytes } from '@/utils'

interface CheckResult {
  status: 'warning' | 'success' | 'error'
  text: string
}

export default function StorageSetupPage () {
  const router = useRouter()
  const { settings, setSettings } = useSettingsStore()
  const [spaceCheck, setSpaceCheck] = useState<CheckResult | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Simulate space check for mobile
    const timer = setTimeout(() => {
      setSpaceCheck({ status: 'success', text: 'Storage space available.' })
      setChecking(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [settings.torrentPath])

  return (
    <View className="flex-1 bg-background">
      {/* Progress indicator */}
      <View className="px-6 mt-14 w-full items-center pb-5">
        <View className="w-full max-w-4xl relative flex-row justify-around">
          <View className="absolute top-5 left-0 right-0 h-2.5 rounded-full bg-secondary overflow-hidden">
            <View className="h-full bg-white" style={{ width: '15%' }} />
          </View>
          <View className="w-20 items-center z-10">
            <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
              <Text className="text-background font-bold">💾</Text>
            </View>
            <Text className="mt-3 font-bold text-foreground">Storage</Text>
          </View>
          <View className="w-20 items-center z-10">
            <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center">
              <Text className="text-muted-foreground">🌐</Text>
            </View>
            <Text className="mt-3 font-bold text-muted-foreground">Network</Text>
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
          <View className="flex-row items-center">
            {checking ? (
              <>
                <View className="w-4 h-4 mr-2.5">
                  <Text className="text-muted-foreground text-xs">⏳</Text>
                </View>
                <Text className="text-foreground text-sm">Storage Space - </Text>
                <Text className="text-muted-foreground text-xs">Checking available storage space...</Text>
              </>
            ) : spaceCheck ? (
              <>
                <View className="w-4 h-4 mr-2.5 items-center justify-center">
                  <Text className={spaceCheck.status === 'success' ? 'text-green-500' : spaceCheck.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}>
                    {spaceCheck.status === 'success' ? '✓' : spaceCheck.status === 'warning' ? '!' : '✗'}
                  </Text>
                </View>
                <Text className="text-foreground text-sm">Storage Space - </Text>
                <Text className="text-muted-foreground text-xs flex-1">{spaceCheck.text}</Text>
              </>
            ) : null}
          </View>
        </View>
        <View className="flex-row items-center justify-between bg-neutral-950 border border-t-0 border-border rounded-b-lg py-4 px-8">
          <Button variant="secondary" className="w-24" onPress={() => router.back()}>
            Prev
          </Button>
          <Button
            className="font-semibold w-24"
            disabled={checking}
            onPress={() => router.push('/setup/network' as never)}
          >
            Next
          </Button>
        </View>
      </View>
    </View>
  )
}
