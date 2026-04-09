import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Avatar, Separator } from '@/components/ui'
import { BannerImage } from '@/components/BannerImage'
import { useAuthStore } from '@/stores/auth'
import { getViewer } from '@/modules/anilist/client'

export default function ProfilePage () {
  const anilistToken = useAuthStore((s) => s.anilistToken)
  const [viewer, setViewer] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (anilistToken) {
      getViewer().then((data) => {
        setViewer((data as { Viewer: Record<string, unknown> }).Viewer)
      }).catch(() => {})
    }
  }, [anilistToken])

  if (!viewer) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Not logged in</Text>
      </View>
    )
  }

  const avatar = (viewer.avatar as Record<string, string>)?.large
  const bannerImage = viewer.bannerImage as string | undefined
  const name = viewer.name as string
  const stats = (viewer.statistics as Record<string, Record<string, number>>)?.anime

  return (
    <View className="flex-1 bg-background">
      <BannerImage uri={bannerImage} height={150} />
      <ScrollView contentContainerStyle={{ paddingTop: 100, paddingHorizontal: 16 }}>
        <View className="items-center">
          <Avatar src={avatar} size={80} />
          <Text className="text-foreground text-xl font-bold mt-3">{name}</Text>
        </View>
        {stats && (
          <>
            <Separator className="my-6" />
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">{stats.count ?? 0}</Text>
                <Text className="text-muted-foreground text-xs">Anime</Text>
              </View>
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">{stats.episodesWatched ?? 0}</Text>
                <Text className="text-muted-foreground text-xs">Episodes</Text>
              </View>
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">{stats.meanScore ?? 0}</Text>
                <Text className="text-muted-foreground text-xs">Mean Score</Text>
              </View>
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">
                  {Math.round((stats.minutesWatched ?? 0) / 60 / 24)}
                </Text>
                <Text className="text-muted-foreground text-xs">Days</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}
