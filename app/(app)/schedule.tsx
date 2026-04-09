import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { format } from 'date-fns'
import { getSchedule } from '@/modules/anilist/client'
import { Skeleton } from '@/components/ui'

interface AiringSchedule {
  id: number
  episode: number
  airingAt: number
  timeUntilAiring: number
  media: {
    id: number
    title: { userPreferred: string }
    coverImage: { medium: string }
    format: string
    episodes: number | null
    mediaListEntry?: { status: string; progress: number } | null
  }
}

export default function SchedulePage () {
  const router = useRouter()
  const [schedules, setSchedules] = useState<AiringSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  useEffect(() => {
    loadSchedule()
  }, [selectedDay])

  async function loadSchedule () {
    setLoading(true)
    try {
      const day = days[selectedDay]
      const start = new Date(day)
      start.setHours(0, 0, 0, 0)
      const end = new Date(day)
      end.setHours(23, 59, 59, 999)

      const result = await getSchedule(start.getTime(), end.getTime()) as {
        Page: { airingSchedules: AiringSchedule[] }
      }
      setSchedules(result.Page?.airingSchedules ?? [])
    } catch {
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-border" contentContainerStyle={{ paddingHorizontal: 16 }}>
        {days.map((day, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedDay(index)}
            className={`px-4 py-3 mr-1 ${selectedDay === index ? 'border-b-2 border-foreground' : ''}`}
          >
            <Text className={`text-xs ${selectedDay === index ? 'text-foreground' : 'text-muted-foreground'}`}>
              {format(day, 'EEE')}
            </Text>
            <Text className={`text-sm font-medium ${selectedDay === index ? 'text-foreground' : 'text-muted-foreground'}`}>
              {format(day, 'd')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingVertical: 16 }}>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <View key={i} className="flex-row items-center mb-4 gap-3">
              <Skeleton style={{ width: 45, height: 64, borderRadius: 4 }} />
              <View className="flex-1">
                <Skeleton style={{ width: '80%', height: 14, borderRadius: 4 }} />
                <Skeleton className="mt-1" style={{ width: '40%', height: 12, borderRadius: 4 }} />
              </View>
            </View>
          ))
        ) : schedules.length === 0 ? (
          <Text className="text-muted-foreground text-center mt-8">No episodes airing this day</Text>
        ) : (
          schedules.map((schedule) => (
            <Pressable
              key={schedule.id}
              onPress={() => router.push(`/(app)/anime/${schedule.media.id}` as never)}
              className="flex-row items-center mb-4 gap-3"
            >
              <Image
                source={{ uri: schedule.media.coverImage.medium }}
                style={{ width: 45, height: 64, borderRadius: 4 }}
                contentFit="cover"
              />
              <View className="flex-1">
                <Text className="text-foreground text-sm" numberOfLines={1}>
                  {schedule.media.title.userPreferred}
                </Text>
                <Text className="text-muted-foreground text-xs mt-0.5">
                  Episode {schedule.episode} • {format(new Date(schedule.airingAt * 1000), 'h:mm a')}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  )
}
