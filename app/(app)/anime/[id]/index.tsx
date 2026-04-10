import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Heart, Play, ChevronLeft, Star, Clock, Tv, MessageSquare } from 'lucide-react-native'
import { BannerImage } from '@/components/BannerImage'
import { Badge, Button, Separator } from '@/components/ui'
import { MediaCard, StatusDot } from '@/components'
import { getMedia, toggleFavourite } from '@/modules/anilist/client'
import {
  type Media, title as getTitle, desc, banner, cover, format, status, season, duration,
  episodes as getEpisodes, getBGColorForRating, relation
} from '@/modules/anilist/util'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

function formatDate (date?: { year?: number | null; month?: number | null; day?: number | null } | null): string | null {
  if (!date?.year) return null
  const parts = [date.year]
  if (date.month) parts.unshift(date.month)
  if (date.day) parts.unshift(date.day)
  if (parts.length === 3) {
    const d = new Date(date.year, (date.month ?? 1) - 1, date.day ?? 1)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }
  if (parts.length === 2) {
    const d = new Date(date.year, (date.month ?? 1) - 1)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }
  return `${date.year}`
}

function InfoRow ({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <View className="flex-row py-2 border-b border-border">
      <Text className="text-muted-foreground text-sm w-28 font-medium">{label}</Text>
      <Text className="text-foreground text-sm flex-1">{value}</Text>
    </View>
  )
}

const statusDotMap: Record<string, 'online' | 'idle' | 'offline' | 'error'> = {
  RELEASING: 'online',
  FINISHED: 'offline',
  NOT_YET_RELEASED: 'idle',
  CANCELLED: 'error',
  HIATUS: 'idle'
}

export default function AnimeDetailPage () {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [media, setMedia] = useState<Media | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getMedia(Number(id))
      .then((data) => setMedia(data.Media))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#fafafa" />
      </View>
    )
  }

  if (!media) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Media not found</Text>
      </View>
    )
  }

  const mediaTitle = getTitle(media)
  const bannerUri = banner(media)
  const coverUri = cover(media)
  const description = desc(media)
  const totalEps = getEpisodes(media)
  const allRelations = media.relations?.edges ?? []
  const sourceLabel = media.source
    ? media.source.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : null

  return (
    <View className="flex-1 bg-background">
      <BannerImage uri={bannerUri} height={220} />

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10 bg-black/50 rounded-full p-2"
      >
        <ChevronLeft size={24} color="#ffffff" />
      </Pressable>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ height: 160 }} />

        <View className="px-4">
          {/* Cover + title row */}
          <View className="flex-row">
            {coverUri && (
              <View className="rounded-md overflow-hidden" style={{ width: 120, height: 180 }}>
                <Image
                  source={{ uri: coverUri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </View>
            )}
            <View className="flex-1 ml-4 justify-end">
              <Text className="text-foreground text-xl font-bold" numberOfLines={3}>{mediaTitle}</Text>

              {/* Status dot + airing status */}
              <View className="flex-row items-center gap-1.5 mt-1.5">
                {media.status && (
                  <StatusDot status={statusDotMap[media.status] ?? 'offline'} />
                )}
                {media.status && (
                  <Text className="text-muted-foreground text-xs">{status(media)}</Text>
                )}
              </View>

              <View className="flex-row flex-wrap gap-1 mt-2">
                {media.format && <Badge variant="secondary">{format(media)}</Badge>}
                {media.status && <Badge variant="secondary">{status(media)}</Badge>}
              </View>
              <View className="flex-row items-center gap-3 mt-2">
                {media.averageScore != null && (
                  <View className="flex-row items-center gap-1">
                    <Star size={14} color="#fafafa" />
                    <Text className="text-foreground text-sm">{media.averageScore}%</Text>
                  </View>
                )}
                {totalEps > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Tv size={14} color="#a1a1aa" />
                    <Text className="text-muted-foreground text-sm">{totalEps} ep</Text>
                  </View>
                )}
                {media.duration && (
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color="#a1a1aa" />
                    <Text className="text-muted-foreground text-sm">{duration(media)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-2 mt-4">
            <Button className="flex-1" onPress={() => {}}>
              <View className="flex-row items-center gap-2">
                <Play size={16} color="#18181b" />
                <Text className="text-primary-foreground font-medium">Watch</Text>
              </View>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onPress={() => toggleFavourite(media.id).catch(() => {})}
            >
              <Heart size={18} color={media.isFavourite ? '#ef4444' : '#fafafa'} fill={media.isFavourite ? '#ef4444' : 'transparent'} />
            </Button>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap gap-1 mt-4">
            {media.genres?.map((genre) => (
              <Badge key={genre} variant="outline">{genre}</Badge>
            ))}
          </View>

          {season(media) ? (
            <Text className="text-muted-foreground text-xs mt-2 capitalize">{season(media)}</Text>
          ) : null}

          <Separator className="my-4" />

          {/* Description / Synopsis */}
          <Text className="text-foreground font-semibold text-base mb-2">Synopsis</Text>
          <Text className="text-muted-foreground text-sm leading-relaxed">{description}</Text>

          <Separator className="my-4" />

          {/* Info section */}
          <Text className="text-foreground font-semibold text-base mb-2">Information</Text>
          <View>
            <InfoRow label="Format" value={format(media)} />
            <InfoRow label="Episodes" value={totalEps > 0 ? `${totalEps}` : null} />
            <InfoRow label="Duration" value={duration(media)} />
            <InfoRow label="Status" value={status(media)} />
            <InfoRow label="Start Date" value={formatDate(media.startDate)} />
            <InfoRow label="End Date" value={formatDate(media.endDate)} />
            <InfoRow label="Source" value={sourceLabel} />
            <InfoRow label="Genres" value={media.genres?.join(', ')} />
          </View>

          {/* Relations */}
          {allRelations.length > 0 && (
            <>
              <Separator className="my-4" />
              <Text className="text-foreground font-semibold text-base mb-3">Relations</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {allRelations.map((edge, index) => {
                  if (!edge.node) return null
                  const relLabel = relation(edge.relationType ?? null)
                  return (
                    <View key={index} className="mr-3">
                      <MediaCard media={edge.node} />
                      <Text className="text-muted-foreground text-xs mt-0.5 w-[100px]" numberOfLines={1}>
                        {relLabel}
                      </Text>
                    </View>
                  )
                })}
              </ScrollView>
            </>
          )}

          {/* Episodes placeholder */}
          <Separator className="my-4" />
          <Text className="text-foreground font-semibold text-base mb-3">Episodes</Text>
          {totalEps > 0 ? (
            <View className="bg-neutral-950 rounded-md p-4">
              <Text className="text-muted-foreground text-sm">
                {totalEps} episode{totalEps !== 1 ? 's' : ''}
              </Text>
              <Text className="text-neutral-500 text-xs mt-1">
                Select a source to view episodes
              </Text>
            </View>
          ) : (
            <Text className="text-muted-foreground text-sm">No episode data available</Text>
          )}

          {/* Threads / Forums placeholder */}
          <Separator className="my-4" />
          <Text className="text-foreground font-semibold text-base mb-3">Threads</Text>
          <View className="bg-neutral-950 rounded-md p-4 flex-row items-center gap-3">
            <MessageSquare size={18} color="#a1a1aa" />
            <Text className="text-muted-foreground text-sm">Forum threads coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
