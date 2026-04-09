import React, { useEffect, useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { MediaRow } from '@/components'
import { BannerImage } from '@/components/BannerImage'
import { searchAnime, type SearchVariables } from '@/modules/anilist/client'
import { currentSeason, currentYear, type Media, banner } from '@/modules/anilist/util'

interface Section {
  title: string
  variables: SearchVariables
  data: Media[] | null
  loading: boolean
}

const initialSections: Section[] = [
  { title: 'Popular This Season', variables: { sort: ['POPULARITY_DESC'], season: currentSeason, seasonYear: currentYear }, data: null, loading: true },
  { title: 'Trending Now', variables: { sort: ['TRENDING_DESC'] }, data: null, loading: true },
  { title: 'All Time Popular', variables: { sort: ['POPULARITY_DESC'] }, data: null, loading: true },
  { title: 'Romance', variables: { sort: ['TRENDING_DESC'], genre: ['Romance'] }, data: null, loading: true },
  { title: 'Action', variables: { sort: ['TRENDING_DESC'], genre: ['Action'] }, data: null, loading: true },
  { title: 'Adventure', variables: { sort: ['TRENDING_DESC'], genre: ['Adventure'] }, data: null, loading: true },
  { title: 'Fantasy', variables: { sort: ['TRENDING_DESC'], genre: ['Fantasy'] }, data: null, loading: true }
]

export default function HomePage () {
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [refreshing, setRefreshing] = useState(false)
  const [bannerUri, setBannerUri] = useState<string | undefined>(undefined)

  const fetchSections = useCallback(async () => {
    const promises = sections.map(async (section, index) => {
      try {
        const result = await searchAnime(section.variables)
        const media = result.Page?.media ?? []
        if (index === 0 && media.length > 0) {
          setBannerUri(banner(media[0]) ?? undefined)
        }
        return { ...section, data: media, loading: false }
      } catch {
        return { ...section, data: [], loading: false }
      }
    })

    const results = await Promise.all(promises)
    setSections(results)
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setSections(prev => prev.map(s => ({ ...s, loading: true })))
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
            searchVariables={section.variables}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}
