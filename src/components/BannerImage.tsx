import React, { useEffect, useRef, useState, useCallback } from 'react'
import { View, Text, Pressable, Dimensions, Animated } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { searchAnime } from '@/modules/anilist/client'
import { currentSeason, currentYear, banner, title, format, status, season, desc, getTextColorForRating, type Media } from '@/modules/anilist/util'
import { Skeleton } from './ui/Skeleton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const BANNER_HEIGHT = 340

function shuffleAndFilter (media: Array<Media | null>): Media[] {
  const filtered = (media.filter(m => m != null && (m.bannerImage || m.trailer?.id)) as Media[]).slice(0, 5)
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]]
  }
  return filtered
}

export function Banner () {
  const router = useRouter()
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    searchAnime({
      sort: ['SCORE_DESC'],
      perPage: 10,
      season: currentSeason,
      seasonYear: currentYear,
      statusNot: ['NOT_YET_RELEASED']
    }).then(result => {
      const shuffled = shuffleAndFilter(result.Page?.media ?? [])
      setMediaList(shuffled)
      setLoading(false)
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    })
  }, [])

  const goTo = useCallback((idx: number) => {
    if (!mediaList.length) return
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setCurrentIdx(idx % mediaList.length)
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start()
    })
  }, [mediaList.length, fadeAnim])

  useEffect(() => {
    if (!mediaList.length) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      goTo(currentIdx + 1)
    }, 15000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentIdx, mediaList.length, goTo])

  if (loading) {
    return (
      <View style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT }}>
        <Skeleton style={{ width: '100%', height: '100%' }} />
        <LinearGradient
          colors={['transparent', '#09090b']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: BANNER_HEIGHT * 0.7 }}
        />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT }} className="items-center justify-center bg-zinc-900">
        <Text className="text-foreground font-bold text-4xl text-center mb-1">Ooops!</Text>
        <Text className="text-muted-foreground text-lg text-center">Looks like something went wrong!</Text>
        <Text className="text-muted-foreground text-lg text-center">{error}</Text>
      </View>
    )
  }

  if (!mediaList.length) return null

  const current = mediaList[currentIdx]
  const bannerUri = banner(current)

  return (
    <View style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT }}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {bannerUri && (
          <Image
            source={{ uri: bannerUri }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            contentFit="cover"
            transition={300}
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(9,9,11,0.85)', '#09090b']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: BANNER_HEIGHT * 0.75 }}
        />

        {/* Content overlay */}
        <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, paddingHorizontal: 16 }}>
          {/* Title */}
          <Pressable onPress={() => router.push(`/(app)/anime/${current.id}` as never)}>
            <Text className="text-white font-black text-2xl leading-tight mb-2" numberOfLines={2}>
              {title(current)}
            </Text>
          </Pressable>

          {/* Tags row */}
          <View className="flex-row flex-wrap gap-1 mb-2">
            {current.averageScore != null && (
              <View className="rounded px-2 py-0.5 bg-white/10">
                <Text className={`text-xs font-bold ${getTextColorForRating(current.averageScore)}`}>
                  {current.averageScore}%
                </Text>
              </View>
            )}
            <View className="rounded px-2 py-0.5 bg-white/10">
              <Text className="text-xs font-bold text-white/80">{format(current)}</Text>
            </View>
            <View className="rounded px-2 py-0.5 bg-white/10">
              <Text className="text-xs font-bold text-white/80">{status(current)}</Text>
            </View>
            {season(current) ? (
              <View className="rounded px-2 py-0.5 bg-white/10">
                <Text className="text-xs font-bold text-white/80 capitalize">{season(current)}</Text>
              </View>
            ) : null}
            {(current.genres ?? []).slice(0, 3).map(genre => (
              <View key={genre} className="rounded px-2 py-0.5 bg-white/10">
                <Text className="text-xs font-bold text-white/80">{genre}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text className="text-white/70 text-xs leading-relaxed" numberOfLines={2}>
            {desc(current)}
          </Text>
        </View>

        {/* Progress dots */}
        <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' }}>
          {mediaList.map((_, i) => (
            <Pressable key={i} onPress={() => { if (timerRef.current) clearTimeout(timerRef.current); goTo(i) }}>
              <View
                style={{
                  height: 4,
                  width: i === currentIdx ? 48 : 24,
                  backgroundColor: i === currentIdx ? (current.coverImage?.color ?? '#fff') : 'rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  marginHorizontal: 2,
                  overflow: 'hidden'
                }}
              />
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  )
}

// Legacy BannerImage component kept for backward compatibility
interface BannerImageProps {
  uri?: string | null
  height?: number
}

export function BannerImage ({ uri, height = 200 }: BannerImageProps) {
  if (!uri) return null

  return (
    <View style={{ width: SCREEN_WIDTH, height, position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', '#09090b']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.6 }}
      />
    </View>
  )
}
