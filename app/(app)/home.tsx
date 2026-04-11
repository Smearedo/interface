import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { MediaRow } from '@/components'
import { Banner } from '@/components/BannerImage'
import { searchAnime, type SearchVariables } from '@/modules/anilist/client'
import { currentSeason, currentYear, type Media } from '@/modules/anilist/util'
import { useAuthStore } from '@/stores/auth'

interface Section {
  title: string
  variables: SearchVariables
  data: Media[] | null
  loading: boolean
  error: string | null
}

const baseSections: Section[] = [
  { title: 'Popular This Season', variables: { sort: ['POPULARITY_DESC'], season: currentSeason, seasonYear: currentYear }, data: null, loading: true, error: null },
  { title: 'Trending Now', variables: { sort: ['TRENDING_DESC'] }, data: null, loading: true, error: null },
  { title: 'All Time Popular', variables: { sort: ['POPULARITY_DESC'] }, data: null, loading: true, error: null },
  { title: 'Romance', variables: { sort: ['TRENDING_DESC'], genre: ['Romance'] }, data: null, loading: true, error: null },
  { title: 'Action', variables: { sort: ['TRENDING_DESC'], genre: ['Action'] }, data: null, loading: true, error: null },
  { title: 'Adventure', variables: { sort: ['TRENDING_DESC'], genre: ['Adventure'] }, data: null, loading: true, error: null },
  { title: 'Fantasy', variables: { sort: ['TRENDING_DESC'], genre: ['Fantasy'] }, data: null, loading: true, error: null }
]

export default function HomePage () {
  const [sections, setSections] = useState<Section[]>(baseSections)
  const [refreshing, setRefreshing] = useState(false)
  const [bannerKey, setBannerKey] = useState(0)
  const hasAuth = useAuthStore((s) => s.hasAuth())
  const anilistToken = useAuthStore((s) => s.anilistToken)

  const buildSections = useCallback((): Section[] => {
    const allSections = baseSections.map(s => ({ ...s, data: null, loading: true, error: null }))

    if (hasAuth && anilistToken) {
      // Continue Watching: uses onList + CURRENT status, sorted by updated
      allSections.unshift(
        { title: 'Sequels You Missed', variables: { sort: ['POPULARITY_DESC'], status: ['FINISHED', 'RELEASING'], onList: false }, data: null, loading: true, error: null },
        { title: 'Your List', variables: { sort: ['START_DATE_DESC'], status: ['FINISHED', 'RELEASING'], onList: true }, data: null, loading: true, error: null },
        { title: 'Continue Watching', variables: { sort: ['UPDATED_AT_DESC'], status: ['CURRENT'], onList: true }, data: null, loading: true, error: null }
      )
    }

    return allSections
  }, [hasAuth, anilistToken])

  const fetchSections = useCallback(async () => {
    const allSections = buildSections()
    setSections(allSections)

    const promises = allSections.map(async (section) => {
      try {
        const result = await searchAnime(section.variables)
        const media = result.Page?.media ?? []
        return { ...section, data: media, loading: false, error: null }
      } catch (err) {
        return { ...section, data: [], loading: false, error: err instanceof Error ? err.message : 'Unknown error' }
      }
    })

    const results = await Promise.all(promises)
    setSections(results)
  }, [buildSections])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setBannerKey(k => k + 1)
    await fetchSections()
    setRefreshing(false)
  }, [fetchSections])

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fafafa" />
        }
      >
        <Banner key={bannerKey} />
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
