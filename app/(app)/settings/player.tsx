import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SettingCard } from '@/components'
import { Toggle, Select, Input } from '@/components/ui'
import { useSettingsStore } from '@/stores/settings'
import { languageCodes, subtitleResolutions } from '@/modules/settings'

export default function PlayerSettingsPage () {
  const { settings, setSettings } = useSettingsStore()

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, padding: 16 }}>
        <Text className="text-xl font-bold text-foreground">Subtitle Settings</Text>
        <SettingCard
          title="Subtitle Render Resolution Limit"
          description="Max resolution to render subtitles at. If your resolution is higher than this setting the subtitles will be upscaled lineary. This will GREATLY improve rendering speeds for complex typesetting for slower devices. It's best to lower this on mobile devices which often have high pixel density where their effective resolution might be ~1440p while having small screens and slow processors."
        >
          <Select
            options={Object.entries(subtitleResolutions).map(([value, label]) => ({ value, label }))}
            value={settings.subtitleRenderHeight}
            onValueChange={(v) => setSettings({ subtitleRenderHeight: v as typeof settings.subtitleRenderHeight })}
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">Language Settings</Text>
        <SettingCard
          title="Preferred Subtitle Language"
          description="What subtitle language to automatically select when a video is loaded if it exists. This won't find torrents with this language automatically. If not found defaults to English."
        >
          <Select
            options={Object.entries(languageCodes).map(([value, label]) => ({ value, label }))}
            value={settings.subtitleLanguage}
            onValueChange={(v) => setSettings({ subtitleLanguage: v as typeof settings.subtitleLanguage })}
          />
        </SettingCard>
        <SettingCard
          title="Preferred Audio Language"
          description="What audio language to automatically select when a video is loaded if it exists. This won't find torrents with this language automatically. If not found defaults to Japanese."
        >
          <Select
            options={Object.entries(languageCodes).map(([value, label]) => ({ value, label }))}
            value={settings.audioLanguage}
            onValueChange={(v) => setSettings({ audioLanguage: v as typeof settings.audioLanguage })}
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">Playback Settings</Text>
        <SettingCard
          title="Auto-Play Next Episode"
          description="Automatically starts playing next episode when a video ends."
        >
          <Toggle
            value={settings.playerAutoplay}
            onValueChange={(v) => setSettings({ playerAutoplay: v })}
          />
        </SettingCard>
        <SettingCard
          title="Pause On Lost Visibility"
          description="Pauses/Resumes video playback when the app loses visibility."
        >
          <Toggle
            value={settings.playerPause}
            onValueChange={(v) => setSettings({ playerPause: v })}
          />
        </SettingCard>
        <SettingCard
          title="PiP On Lost Visibility"
          description="Automatically enters Picture in Picture mode when the app loses visibility."
        >
          <Toggle
            value={settings.playerAutoPiP}
            onValueChange={(v) => setSettings({ playerAutoPiP: v })}
          />
        </SettingCard>
        <SettingCard
          title="Auto-Complete Episodes"
          description="Automatically marks episodes as complete when you finish watching them. Requires Account login."
        >
          <Toggle
            value={settings.playerAutocomplete}
            onValueChange={(v) => setSettings({ playerAutocomplete: v })}
          />
        </SettingCard>
        <SettingCard
          title="Deband Video"
          description="Reduces banding [compression artifacts] on dark and compressed videos. High performance impact. Recommended for seasonal web releases, not recommended for high quality blu-ray videos."
        >
          <Toggle
            value={settings.playerDeband}
            onValueChange={(v) => setSettings({ playerDeband: v })}
          />
        </SettingCard>
        <SettingCard
          title="Seek Duration"
          description="Seconds to skip forward or backward when using the seek buttons or keyboard shortcuts. Higher values might negatively impact buffering speeds."
        >
          <View className="flex-row items-center border border-input rounded-md">
            <Input
              keyboardType="numeric"
              value={String(settings.playerSeek)}
              onChangeText={(v) => setSettings({ playerSeek: parseInt(v) || 5 })}
              className="w-32 bg-background border-0"
            />
            <Text className="text-foreground text-sm pr-3">sec</Text>
          </View>
        </SettingCard>
        <SettingCard
          title="Auto-Skip Intro/Outro"
          description="Attempt to automatically skip intro and outro. This WILL sometimes skip incorrect chapters, as some of the chapter data is community sourced."
        >
          <Toggle
            value={settings.playerSkip}
            onValueChange={(v) => setSettings({ playerSkip: v })}
          />
        </SettingCard>
        <SettingCard
          title="Auto-Skip Filler"
          description="Automatically skip filler episodes. This WILL skip ENTIRE episodes."
        >
          <Toggle
            value={settings.playerSkipFiller}
            onValueChange={(v) => setSettings({ playerSkipFiller: v })}
          />
        </SettingCard>

        <Text className="text-xl font-bold text-foreground mt-4">Interface Settings</Text>
        <SettingCard
          title="Minimal UI"
          description="Forces minimalistic player UI, hides controls."
        >
          <Toggle
            value={settings.minimalPlayerUI}
            onValueChange={(v) => setSettings({ minimalPlayerUI: v })}
          />
        </SettingCard>
      </ScrollView>
    </View>
  )
}
