import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
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

interface DayData {
  date: Date
  number: number
  episodes: AiringSchedule[]
}

export default function SchedulePage () {
  const router = useRouter()
  const [schedules, setSchedules] = useState<AiringSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [onList, setOnList] = useState(true)

  const monthName = format(now, 'MMMM')
  const year = format(now, 'yyyy')

  const firstDay = startOfWeek(startOfMonth(now), { weekStartsOn: 1 })
  const lastDay = endOfWeek(endOfMonth(now), { weekStartsOn: 1 })

  const dayList = useMemo(() => {
    const days: { date: Date; number: number }[] = []
    const current = new Date(firstDay)
    while (current <= lastDay) {
      days.push({ date: new Date(current), number: current.getDate() })
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [firstDay.getTime(), lastDay.getTime()])

  useEffect(() => {
    loadSchedule()
  }, [now])

  async function loadSchedule () {
    setLoading(true)
    try {
      const start = firstDay
      const end = lastDay
      const result = await getSchedule(
        Math.floor(start.getTime() / 1000),
        Math.floor(end.getTime() / 1000)
      ) as { Page: { airingSchedules: AiringSchedule[] } }
      setSchedules(result.Page?.airingSchedules ?? [])
    } catch {
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const daysWithEpisodes: DayData[] = useMemo(() => {
    return dayList.map(day => {
      const dayStart = new Date(day.date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(day.date)
      dayEnd.setHours(23, 59, 59, 999)
      const dayStartSec = Math.floor(dayStart.getTime() / 1000)
      const dayEndSec = Math.floor(dayEnd.getTime() / 1000)

      const episodes = schedules.filter(s =>
        s.airingAt >= dayStartSec && s.airingAt <= dayEndSec
      )
      return { ...day, episodes }
    })
  }, [dayList, schedules])

  const selectedDayData = selectedDay
    ? daysWithEpisodes.find(d => d.date.toDateString() === selectedDay.toDateString())
    : null

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-foreground text-2xl font-bold">{monthName} {year}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => setOnList(!onList)} className={`px-3 py-1.5 rounded-md ${onList ? 'bg-accent' : 'bg-transparent'}`}>
            <Text className={`text-xs ${onList ? 'text-foreground' : 'text-muted-foreground'}`}>My List</Text>
          </Pressable>
          <Pressable onPress={() => setNow(subMonths(now, 1))} className="p-2">
            <ChevronLeft size={18} color="#fafafa" />
          </Pressable>
          <Pressable onPress={() => setNow(addMonths(now, 1))} className="p-2">
            <ChevronRight size={18} color="#fafafa" />
          </Pressable>
        </View>
      </View>

      {/* Day of week headers */}
      <View className="flex-row px-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <View key={d} className="flex-1 items-center py-1">
            <Text className="text-muted-foreground text-xs">{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap px-1">
          {daysWithEpisodes.map((day, index) => {
            const sameMonth = isSameMonth(day.date, now)
            const today = isToday(day.date)
            const isSelected = selectedDay?.toDateString() === day.date.toDateString()

            return (
              <Pressable
                key={index}
                onPress={() => setSelectedDay(day.date)}
                className="items-center py-1.5"
                style={{ width: '14.28%' }}
              >
                <View className={`w-7 h-7 items-center justify-center rounded-full ${today ? 'bg-blue-500' : ''} ${isSelected ? 'bg-accent' : ''}`}>
                  <Text className={`text-xs ${!sameMonth ? 'opacity-30' : ''} ${today ? 'text-white font-bold' : 'text-foreground'}`}>
                    {day.number}
                  </Text>
                </View>
                {day.episodes.length > 0 && (
                  <Text className="text-muted-foreground text-[9px] mt-0.5">{day.episodes.length}</Text>
                )}
              </Pressable>
            )
          })}
        </View>

        {/* Selected day episodes */}
        {selectedDayData && (
          <View className="px-4 mt-3 border-t border-border pt-3">
            <Text className="text-foreground text-lg font-semibold mb-2">
              {format(selectedDayData.date, 'EEEE, MMMM d')}
            </Text>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <View key={i} className="flex-row items-center mb-4 gap-3">
                  <Skeleton style={{ width: 45, height: 64, borderRadius: 4 }} />
                  <View className="flex-1">
                    <Skeleton style={{ width: '80%', height: 14, borderRadius: 4 }} />
                    <Skeleton className="mt-1" style={{ width: '40%', height: 12, borderRadius: 4 }} />
                  </View>
                </View>
              ))
            ) : selectedDayData.episodes.length === 0 ? (
              <Text className="text-muted-foreground text-center mt-4">No episodes airing this day</Text>
            ) : (
              selectedDayData.episodes.map((schedule) => (
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
                      #{schedule.episode} • {format(new Date(schedule.airingAt * 1000), 'HH:mm')}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}
