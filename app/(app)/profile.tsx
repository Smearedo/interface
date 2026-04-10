import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Avatar, Separator } from '@/components/ui'
import { BannerImage } from '@/components/BannerImage'
import { useAuthStore } from '@/stores/auth'
import { anilistQuery } from '@/modules/anilist/client'
import { since } from '@/utils'

interface FavouriteNode {
  id: number
  title?: { userPreferred?: string | null } | null
  coverImage?: { extraLarge?: string | null } | null
  type?: string | null
}

interface Activity {
  id: number
  type: string
  createdAt: number
  status?: string | null
  progress?: string | null
  media?: {
    id: number
    title?: { userPreferred?: string | null } | null
    coverImage?: { medium?: string | null } | null
  } | null
}

interface ViewerData {
  id: number
  name: string
  avatar?: { large?: string | null } | null
  bannerImage?: string | null
  about?: string | null
  createdAt?: number | null
  donatorBadge?: string | null
  statistics?: {
    anime?: { count?: number; meanScore?: number; minutesWatched?: number; episodesWatched?: number } | null
    manga?: { count?: number; chaptersRead?: number } | null
  } | null
  favourites?: {
    anime?: { nodes?: FavouriteNode[] | null } | null
    manga?: { nodes?: FavouriteNode[] | null } | null
  } | null
  options?: { profileColor?: string | null } | null
}

const VIEWER_PROFILE_QUERY = `
query {
  Viewer {
    id, name, avatar { large }, bannerImage, about, createdAt, donatorBadge,
    statistics {
      anime { count, meanScore, minutesWatched, episodesWatched }
      manga { count, chaptersRead }
    },
    favourites {
      anime(perPage: 10) { nodes { id, title { userPreferred }, coverImage { extraLarge }, type } }
      manga(perPage: 10) { nodes { id, title { userPreferred }, coverImage { extraLarge }, type } }
    },
    options { profileColor }
  }
}
`

const ACTIVITY_QUERY = `
query ($userId: Int) {
  Page(perPage: 15) {
    activities(userId: $userId, sort: ID_DESC, type: MEDIA_LIST) {
      ... on ListActivity {
        id, type, createdAt, status, progress,
        media { id, title { userPreferred }, coverImage { medium } }
      }
    }
  }
}
`

export default function ProfilePage () {
  const anilistToken = useAuthStore((s) => s.anilistToken)
  const router = useRouter()
  const [viewer, setViewer] = useState<ViewerData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (anilistToken) {
      anilistQuery<{ Viewer: ViewerData }>(VIEWER_PROFILE_QUERY)
        .then((data) => {
          setViewer(data.Viewer)
          return anilistQuery<{ Page: { activities: Activity[] } }>(ACTIVITY_QUERY, { userId: data.Viewer.id })
        })
        .then((data) => setActivities(data.Page.activities))
        .catch(() => {})
    }
  }, [anilistToken])

  if (!viewer) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Not logged in</Text>
      </View>
    )
  }

  const avatarUri = viewer.avatar?.large ?? undefined
  const bannerImage = viewer.bannerImage ?? undefined
  const name = viewer.name
  const animeStats = viewer.statistics?.anime
  const mangaStats = viewer.statistics?.manga
  const daysWatched = Math.round((animeStats?.minutesWatched ?? 0) / 60 / 24 * 10) / 10
  const animeFavs = viewer.favourites?.anime?.nodes ?? []
  const mangaFavs = viewer.favourites?.manga?.nodes ?? []
  const allFavs = [...animeFavs, ...mangaFavs]

  return (
    <View className="flex-1 bg-background">
      <BannerImage uri={bannerImage} height={180} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ height: 120 }} />

        {/* Avatar + Name */}
        <View className="items-center px-4">
          <Avatar src={avatarUri} size={96} />
          <Text className="text-foreground text-2xl font-extrabold mt-3">{name}</Text>
          {viewer.donatorBadge && viewer.donatorBadge !== 'Donator' && (
            <Text className="text-muted-foreground text-xs mt-1">{viewer.donatorBadge}</Text>
          )}
          {viewer.createdAt != null && (
            <Text className="text-neutral-400 text-xs mt-1">
              Joined {since(new Date(viewer.createdAt * 1000))}
            </Text>
          )}
        </View>

        {/* About */}
        {viewer.about ? (
          <View className="px-4 mt-4">
            <Text className="text-muted-foreground text-sm leading-relaxed" numberOfLines={4}>
              {viewer.about.replace(/<[^>]+>/g, '')}
            </Text>
          </View>
        ) : null}

        <Separator className="my-5 mx-4" />

        {/* Statistics */}
        <View className="px-4">
          <Text className="text-foreground font-bold text-base mb-3">Statistics</Text>
          <View className="flex-row flex-wrap">
            <View className="items-center w-1/3 mb-3">
              <Text className="text-foreground text-lg font-bold">{animeStats?.count ?? 0}</Text>
              <Text className="text-muted-foreground text-xs">Anime</Text>
            </View>
            <View className="items-center w-1/3 mb-3">
              <Text className="text-foreground text-lg font-bold">{animeStats?.episodesWatched ?? 0}</Text>
              <Text className="text-muted-foreground text-xs">Episodes</Text>
            </View>
            <View className="items-center w-1/3 mb-3">
              <Text className="text-foreground text-lg font-bold">{daysWatched}</Text>
              <Text className="text-muted-foreground text-xs">Days Watched</Text>
            </View>
            <View className="items-center w-1/3 mb-3">
              <Text className="text-foreground text-lg font-bold">{mangaStats?.count ?? 0}</Text>
              <Text className="text-muted-foreground text-xs">Manga</Text>
            </View>
            <View className="items-center w-1/3 mb-3">
              <Text className="text-foreground text-lg font-bold">{mangaStats?.chaptersRead ?? 0}</Text>
              <Text className="text-muted-foreground text-xs">Chapters Read</Text>
            </View>
            <View className="items-center w-1/3 mb-3">
              <Text className="text-foreground text-lg font-bold">{animeStats?.meanScore ?? 0}</Text>
              <Text className="text-muted-foreground text-xs">Mean Score</Text>
            </View>
          </View>
        </View>

        {/* Favourites */}
        {allFavs.length > 0 && (
          <>
            <Separator className="my-5 mx-4" />
            <View className="px-4">
              <Text className="text-foreground font-bold text-base mb-3">Favourites</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {allFavs.map((fav) => (
                  <Pressable
                    key={fav.id}
                    className="mr-3"
                    onPress={() => {
                      if (fav.type === 'ANIME') {
                        router.push(`/(app)/anime/${fav.id}` as never)
                      }
                    }}
                  >
                    <View className="rounded-md overflow-hidden bg-muted" style={{ width: 100, height: 150 }}>
                      {fav.coverImage?.extraLarge && (
                        <Image
                          source={{ uri: fav.coverImage.extraLarge }}
                          style={{ width: 100, height: 150 }}
                          contentFit="cover"
                        />
                      )}
                    </View>
                    <Text className="text-foreground text-xs mt-1 w-[100px]" numberOfLines={2}>
                      {fav.title?.userPreferred ?? 'Unknown'}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {/* Activity Feed */}
        {activities.length > 0 && (
          <>
            <Separator className="my-5 mx-4" />
            <View className="px-4">
              <Text className="text-foreground font-bold text-base mb-3">Activity</Text>
              <View className="gap-3">
                {activities.map((activity) => (
                  <Pressable
                    key={activity.id}
                    className="flex-row bg-neutral-950 rounded-md overflow-hidden"
                    onPress={() => {
                      if (activity.media?.id) {
                        router.push(`/(app)/anime/${activity.media.id}` as never)
                      }
                    }}
                  >
                    {activity.media?.coverImage?.medium && (
                      <Image
                        source={{ uri: activity.media.coverImage.medium }}
                        style={{ width: 50, height: 70 }}
                        contentFit="cover"
                      />
                    )}
                    <View className="flex-1 p-3 justify-center">
                      <Text className="text-foreground text-sm" numberOfLines={1}>
                        <Text className="text-muted-foreground capitalize">{activity.status} </Text>
                        {activity.progress ? `${activity.progress} of ` : ''}
                        <Text className="font-semibold">{activity.media?.title?.userPreferred ?? ''}</Text>
                      </Text>
                      <Text className="text-neutral-500 text-xs mt-1">
                        {since(new Date(activity.createdAt * 1000))}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}
