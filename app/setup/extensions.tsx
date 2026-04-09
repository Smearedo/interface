import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Select } from '@/components/ui'
import { SettingCard } from '@/components'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { lookupPreferences } from '@/modules/settings'
import { SETUP_VERSION } from '@/modules/constants'

interface CheckResult {
  status: 'warning' | 'success' | 'error'
  text: string
}

export default function ExtensionsSetupPage () {
  const router = useRouter()
  const { settings, setSettings } = useSettingsStore()
  const setSetupFinished = useAuthStore((s) => s.setSetupFinished)
  const [extensionCheck] = useState<CheckResult | null>(null)

  function handleFinish () {
    setSetupFinished(SETUP_VERSION)
    router.replace('/(app)/home' as never)
  }

  return (
    <View className="flex-1 bg-background">
      {/* Progress indicator */}
      <View className="px-6 mt-14 w-full items-center pb-5">
        <View className="w-full max-w-4xl relative flex-row justify-around">
          <View className="absolute top-5 left-0 right-0 h-2.5 rounded-full bg-secondary overflow-hidden">
            <View className="h-full bg-white" style={{ width: '85%' }} />
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
            <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
              <Text className="text-background font-bold">🧩</Text>
            </View>
            <Text className="mt-3 font-bold text-foreground">Extensions</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-8" contentContainerStyle={{ gap: 12 }}>
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

        <View className="px-6 mt-4">
          <Text className="text-foreground text-lg font-bold mb-2">Extensions</Text>
          <Text className="text-muted-foreground text-sm">
            You can add extensions later in Settings → Extensions
          </Text>
        </View>
      </ScrollView>

      {/* Footer with checks */}
      <View className="px-6 w-full">
        <View className="border border-border rounded-t-lg bg-neutral-950 p-4">
          <View className="flex-row items-center">
            {extensionCheck === null ? (
              <>
                <Text className="text-muted-foreground text-xs mr-2.5">⏳</Text>
                <Text className="text-foreground text-sm">Extensions Required - </Text>
                <Text className="text-muted-foreground text-xs">At least one extension needs to be installed.</Text>
              </>
            ) : (
              <>
                <Text className={`mr-2.5 ${extensionCheck.status === 'success' ? 'text-green-500' : extensionCheck.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {extensionCheck.status === 'success' ? '✓' : extensionCheck.status === 'warning' ? '!' : '✗'}
                </Text>
                <Text className="text-foreground text-sm">Extensions Required - </Text>
                <Text className="text-muted-foreground text-xs flex-1">{extensionCheck.text}</Text>
              </>
            )}
          </View>
        </View>
        <View className="flex-row items-center justify-between bg-neutral-950 border border-t-0 border-border rounded-b-lg py-4 px-8">
          <Button variant="secondary" className="w-24" onPress={() => router.push('/setup/network' as never)}>
            Prev
          </Button>
          <Button className="font-semibold w-24" onPress={handleFinish}>
            Next
          </Button>
        </View>
      </View>
    </View>
  )
}
