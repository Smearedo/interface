import React from 'react'
import { View, Text, ScrollView, Platform } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle, Slider } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'

export default function InterfaceSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, padding: 16 }}>
        {Platform.OS !== 'android' && (
          <>
            <Text className="text-xl font-bold text-foreground">Rich Presence Settings</Text>
            <SettingCard
              title="Show Details in Discord Rich Presence"
              description="Shows currently played anime and episode in Discord rich presence."
            >
              <Toggle
                value={settings.showDetailsInRPC}
                onValueChange={(v) => setSettings({ showDetailsInRPC: v })}
              />
            </SettingCard>
          </>
        )}

        <Text className="text-xl font-bold text-foreground">Visibility Settings</Text>
        <SettingCard
          title="Show Hentai"
          description={"Shows hentai content throughout the app. If disabled all hentai content will be hidden and not shown in search results, but shown if present in your list.\n\nThis is also an AniList account setting, so make sure it is enabled in account settings as well to avoid inconsistencies."}
        >
          <Toggle
            value={settings.showHentai}
            onValueChange={(v) => setSettings({ showHentai: v })}
          />
        </SettingCard>
        <SettingCard
          title="Hide Spoilers"
          description="Hides potential spoilers such as titles, descriptions, episode images and ratings throughout the app."
        >
          <Toggle
            value={settings.hideSpoilers}
            onValueChange={(v) => setSettings({ hideSpoilers: v })}
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">UI Settings</Text>
        <SettingCard
          title="UI Scale"
          description="Change the zoom level of the interface."
        >
          <Slider
            value={settings.uiScale}
            min={0.3}
            max={2.5}
            step={0.1}
            onValueChange={(v) => setSettings({ uiScale: v })}
          />
        </SettingCard>
        <SettingCard
          title="Navigation Buttons"
          description="Show backwards/forwards navigation buttons for when mouse buttons aren't available."
        >
          <Toggle
            value={settings.showNavigation}
            onValueChange={(v) => setSettings({ showNavigation: v })}
          />
        </SettingCard>
        {Platform.OS !== 'android' && (
          <SettingCard
            title="ANGLE Backend"
            description="What ANGLE backend to use for rendering. DON'T CHANGE WITHOUT REASON! On some Windows machines D3D9 might help with flicker. Changing this setting to something your device doesn't support might prevent Hayase from opening which will require a full reinstall. While Vulkan is an available option it might not be fully supported on Linux."
          >
            <Text className="text-muted-foreground text-sm">{settings.angle || 'default'}</Text>
          </SettingCard>
        )}
      </ScrollView>
    </View>
  )
}
