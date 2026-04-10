import React, { useState, useMemo } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { Play } from 'lucide-react-native'
import { cn } from '@/utils'
import { Pagination } from './Pagination'

export interface Episode {
  episode: number
  title?: string
  image?: string | null
  summary?: string
  airdate?: string
  filler?: boolean
  runtime?: number
}

interface EpisodesListProps {
  episodes: Episode[]
  mediaId: number
  onEpisodePress?: (episode: Episode) => void
  progress?: number
  className?: string
}

const PER_PAGE = 16

export function EpisodesList ({ episodes, onEpisodePress, progress = 0, className }: EpisodesListProps) {
  const totalPages = Math.ceil(episodes.length / PER_PAGE)
  const [currentPage, setCurrentPage] = useState(
    Math.floor(progress / PER_PAGE) + 1
  )

  const pageEpisodes = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE
    return episodes.slice(start, start + PER_PAGE)
  }, [episodes, currentPage])

  if (episodes.length === 0) {
    return (
      <View className={cn('items-center justify-center py-8', className)}>
        <Text className="text-muted-foreground text-sm">No episodes available</Text>
      </View>
    )
  }

  return (
    <View className={cn('flex-1', className)}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-3 px-3 pt-3 pb-3">
          {pageEpisodes.map((ep) => {
            const watched = progress >= ep.episode
            const isNext = progress + 1 === ep.episode

            return (
              <Pressable
                key={ep.episode}
                onPress={() => onEpisodePress?.(ep)}
                className={cn(
                  'flex-row rounded-md bg-neutral-950 overflow-hidden',
                  isNext && 'border border-primary',
                  ep.filler && 'border border-yellow-400'
                )}
              >
                {ep.image && (
                  <View className="w-40 h-24 shrink-0">
                    <Image
                      source={{ uri: ep.image }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                    {watched && (
                      <View className="absolute inset-0 bg-black/60" />
                    )}
                  </View>
                )}
                <View className="flex-1 p-3 justify-center">
                  <View className="flex-row items-center gap-2">
                    <Text className={cn('text-xs font-bold', watched ? 'text-muted-foreground' : 'text-foreground')}>
                      Episode {ep.episode}
                    </Text>
                    {ep.filler && (
                      <Text className="text-yellow-400 text-xs">Filler</Text>
                    )}
                  </View>
                  {ep.title && (
                    <Text numberOfLines={1} className={cn('text-sm mt-0.5', watched ? 'text-muted-foreground' : 'text-secondary-foreground')}>
                      {ep.title}
                    </Text>
                  )}
                  {ep.airdate && (
                    <Text className="text-xs text-muted-foreground mt-1">
                      {ep.airdate}
                    </Text>
                  )}
                </View>
                <View className="items-center justify-center px-3">
                  <Play size={16} color={isNext ? '#fafafa' : '#a1a1aa'} />
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      {totalPages > 1 && (
        <View className="py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </View>
      )}
    </View>
  )
}
