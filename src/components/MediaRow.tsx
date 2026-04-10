import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { MediaCard } from './MediaCard'
import { Skeleton } from './ui/Skeleton'
import type { Media } from '@/modules/anilist/util'

interface MediaRowProps {
  title: string
  media: Media[] | null | undefined
  loading?: boolean
  searchVariables?: Record<string, unknown> | import('@/modules/anilist/client').SearchVariables
}

export function MediaRow ({ title, media, loading, searchVariables }: MediaRowProps) {
  const router = useRouter()

  return (
    <View className="mt-5">
      <Pressable
        className="flex-row items-end justify-between px-4 mb-2"
        onPress={() => {
          if (searchVariables) {
            router.push({ pathname: '/(app)/search', params: { q: JSON.stringify(searchVariables) } } as never)
          }
        }}
      >
        <Text className="text-foreground font-semibold text-lg leading-none">{title}</Text>
        <Text className="text-muted-foreground text-xs">View More</Text>
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <View key={i} className="mr-2" style={{ width: 110 }}>
              <Skeleton style={{ width: 110, height: 165, borderRadius: 6 }} />
              <Skeleton className="mt-1.5" style={{ width: 90, height: 12, borderRadius: 4 }} />
            </View>
          ))
        ) : (
          media?.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))
        )}
      </ScrollView>
    </View>
  )
}
