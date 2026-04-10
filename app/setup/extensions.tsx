import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, Select } from '@/components/ui'
import { SettingCard } from '@/components'
import { SetupProgress } from '@/components/SetupProgress'
import { SetupFooterCheck, type FooterCheck } from '@/components/SetupFooter'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { lookupPreferences } from '@/modules/settings'
import { SETUP_VERSION } from '@/modules/constants'

export default function ExtensionsSetupPage () {
  const router = useRouter()
  const { settings, setSettings } = useSettingsStore()
  const setSetupFinished = useAuthStore((s) => s.setSetupFinished)
  const [extensionCheck] = useState<FooterCheck>({
    label: 'Extensions Required',
    description: 'At least one extension needs to be installed.',
    status: 'checking'
  })

  function handleFinish () {
    setSetupFinished(SETUP_VERSION)
    router.replace('/(app)/home' as never)
  }

  return (
    <View className="flex-1 bg-background">
      <SetupProgress step={2} />

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
          <SetupFooterCheck check={extensionCheck} />
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
