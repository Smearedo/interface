import React from 'react'
import { View, Text, Pressable, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { cn } from '@/utils'
import type { Media } from '@/modules/anilist/util'
import { title as getTitle, cover, getBGColorForRating } from '@/modules/anilist/util'

interface MediaCardProps {
  media: Media
  className?: string
}

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 3

export function MediaCard ({ media, className }: MediaCardProps) {
  const router = useRouter()
  const coverUrl = cover(media)
  const mediaTitle = getTitle(media)

  return (
    <Pressable
      className={cn('mr-2', className)}
      style={{ width: CARD_WIDTH }}
      onPress={() => router.push(`/(app)/anime/${media.id}` as never)}
    >
      <View className="rounded-md overflow-hidden bg-muted" style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.5 }}>
        {coverUrl && (
          <Image
            source={{ uri: coverUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        )}
        {media.averageScore != null && (
          <View className={cn('absolute top-1 right-1 rounded px-1.5 py-0.5', getBGColorForRating(media.averageScore))}>
            <Text className="text-white text-xs font-bold">{media.averageScore}%</Text>
          </View>
        )}
        {media.mediaListEntry?.status && (
          <View className="absolute top-1 left-1 bg-black/70 rounded px-1.5 py-0.5">
            <Text className="text-white text-xs">{media.mediaListEntry.status}</Text>
          </View>
        )}
      </View>
      <Text className="text-foreground text-xs mt-1.5 leading-tight" numberOfLines={2}>
        {mediaTitle}
      </Text>
    </Pressable>
  )
}
