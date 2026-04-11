import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { MediaRow } from '@/components'
import { BannerImage } from '@/components/BannerImage'
import { searchAnime, type SearchVariables } from '@/modules/anilist/client'
import { currentSeason, currentYear, type Media, banner } from '@/modules/anilist/util'
import { useAuthStore } from '@/stores/auth'

interface Section {
  title: string
  variables: SearchVariables
  data: Media[] | null
  loading: boolean
  error: string | null
}

const initialSections: Section[] = [
  { title: 'Popular This Season', variables: { sort: ['POPULARITY_DESC'], season: currentSeason, seasonYear: currentYear }, data: null, loading: true, error: null },
  { title: 'Trending Now', variables: { sort: ['TRENDING_DESC'] }, data: null, loading: true, error: null },
  { title: 'All Time Popular', variables: { sort: ['POPULARITY_DESC'] }, data: null, loading: true, error: null },
  { title: 'Romance', variables: { sort: ['TRENDING_DESC'], genre: ['Romance'] }, data: null, loading: true, error: null },
  { title: 'Action', variables: { sort: ['TRENDING_DESC'], genre: ['Action'] }, data: null, loading: true, error: null },
  { title: 'Adventure', variables: { sort: ['TRENDING_DESC'], genre: ['Adventure'] }, data: null, loading: true, error: null },
  { title: 'Fantasy', variables: { sort: ['TRENDING_DESC'], genre: ['Fantasy'] }, data: null, loading: true, error: null }
]

export default function HomePage () {
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [refreshing, setRefreshing] = useState(false)
  const [bannerUri, setBannerUri] = useState<string | undefined>(undefined)
  const hasAuth = useAuthStore((s) => s.hasAuth())
  const anilistViewer = useAuthStore((s) => s.anilistViewer)

  const fetchSections = useCallback(async () => {
    const allSections = [...initialSections]

    // Add logged-in user sections at the beginning if authenticated
    if (hasAuth && anilistViewer) {
      allSections.unshift(
        { title: 'Continue Watching', variables: { sort: ['UPDATED_AT_DESC'], status: 'CURRENT' as unknown as string }, data: null, loading: true, error: null },
        { title: 'Your List', variables: { sort: ['START_DATE_DESC'], status_in: ['FINISHED', 'RELEASING'] as unknown as string } as SearchVariables, data: null, loading: true, error: null },
        { title: 'Sequels You Missed', variables: { sort: ['POPULARITY_DESC'], status_in: ['FINISHED', 'RELEASING'] as unknown as string } as SearchVariables, data: null, loading: true, error: null }
      )
    }

    const promises = allSections.map(async (section, index) => {
      try {
        const result = await searchAnime(section.variables)
        const media = result.Page?.media ?? []
        if (index === 0 && media.length > 0) {
          setBannerUri(banner(media[0]) ?? undefined)
        }
        return { ...section, data: media, loading: false, error: null }
      } catch (err) {
        return { ...section, data: [], loading: false, error: err instanceof Error ? err.message : 'Unknown error' }
      }
    })

    const results = await Promise.all(promises)
    setSections(results)
  }, [hasAuth, anilistViewer])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setSections(prev => prev.map(s => ({ ...s, loading: true, error: null })))
    await fetchSections()
    setRefreshing(false)
  }, [fetchSections])

  return (
    <View className="flex-1">
      <BannerImage uri={bannerUri} />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fafafa" />
        }
      >
        <View style={{ height: 160 }} />
        {sections.map((section, index) => (
          <MediaRow
            key={index}
            title={section.title}
            media={section.data}
            loading={section.loading}
            error={section.error}
            searchVariables={section.variables}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}
