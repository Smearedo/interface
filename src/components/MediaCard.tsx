import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Calendar, Tv } from 'lucide-react-native'
import { cn } from '@/utils'
import type { Media } from '@/modules/anilist/util'
import { title as getTitle, cover, format } from '@/modules/anilist/util'
import { StatusDot } from './StatusDot'

interface MediaCardProps {
  media: Media
  className?: string
}

// HEAD uses 9.5rem width (152px) with 152/290 aspect ratio
const CARD_WIDTH = 110

export function MediaCard ({ media, className }: MediaCardProps) {
  const router = useRouter()
  const coverUrl = cover(media)
  const mediaTitle = getTitle(media)
  const mediaFormat = format(media)
  const yearDisplay = media.seasonYear ?? media.startDate?.year ?? 'TBA'

  return (
    <Pressable
      className={cn('mr-2', className)}
      style={{ width: CARD_WIDTH }}
      onPress={() => router.push(`/(app)/anime/${media.id}` as never)}
    >
      <View className="rounded overflow-hidden bg-muted" style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.42 }}>
        {coverUrl && (
          <Image
            source={{ uri: coverUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        )}
      </View>
      <View className="pt-1.5">
        <Text className="text-foreground text-xs font-black leading-tight" numberOfLines={2}>
          {media.mediaListEntry?.status && (
            <Text>
              <StatusDot status={media.mediaListEntry.status as 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'PAUSED' | 'REPEATING' | 'DROPPED'} />
              {'  '}
            </Text>
          )}
              } />
              {'  '}
            </Text>
          )}
          {mediaTitle}
        </Text>
      </View>
      <View className="flex-row justify-between mt-auto pt-1.5">
        <View className="flex-row items-center">
          <Calendar size={12} color="#737373" />
          <Text className="text-neutral-500 text-xs font-medium ml-1">{yearDisplay}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-neutral-500 text-xs font-medium mr-1">{mediaFormat}</Text>
          <Tv size={12} color="#737373" />
        </View>
      </View>
    </Pressable>
  )
}
