import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, FlatList, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { X } from 'lucide-react-native'
import { Input } from '@/components/ui'
import { MediaCard } from '@/components'
import { searchAnime } from '@/modules/anilist/client'
import type { Media } from '@/modules/anilist/util'

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror',
  'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
]

const seasons = [
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'FALL', label: 'Fall' },
  { value: 'WINTER', label: 'Winter' }
]

const formats = [
  { value: 'TV', label: 'TV Show' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'TV_SHORT', label: 'TV Short' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' }
]

const statusOptions = [
  { value: 'RELEASING', label: 'Airing' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'NOT_YET_RELEASED', label: 'Not Yet Aired' },
  { value: 'CANCELLED', label: 'Cancelled' }
]

const sortOptions = [
  { value: 'TITLE_ROMAJI_DESC', label: 'Name' },
  { value: 'START_DATE_DESC', label: 'Release Date' },
  { value: 'SCORE_DESC', label: 'Score' },
  { value: 'POPULARITY_DESC', label: 'Popularity' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'UPDATED_AT_DESC', label: 'Updated Date' }
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1940 + 2 }, (_, i) => '' + (currentYear + 2 - i))

interface FilterChip {
  type: string
  value: string
  label: string
}

export default function SearchPage () {
  const params = useLocalSearchParams<{ q?: string }>()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState<string>('TRENDING_DESC')
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeFilters: FilterChip[] = [
    ...selectedGenres.map(g => ({ type: 'genre', value: g, label: g })),
    ...(selectedSeason ? [{ type: 'season', value: selectedSeason, label: seasons.find(s => s.value === selectedSeason)?.label ?? selectedSeason }] : []),
    ...(selectedFormat ? [{ type: 'format', value: selectedFormat, label: formats.find(f => f.value === selectedFormat)?.label ?? selectedFormat }] : []),
    ...(selectedStatus ? [{ type: 'status', value: selectedStatus, label: statusOptions.find(s => s.value === selectedStatus)?.label ?? selectedStatus }] : []),
    ...(selectedYear ? [{ type: 'year', value: selectedYear, label: selectedYear }] : [])
  ]

  const removeFilter = (chip: FilterChip) => {
    if (chip.type === 'genre') setSelectedGenres(prev => prev.filter(g => g !== chip.value))
    else if (chip.type === 'season') setSelectedSeason(null)
    else if (chip.type === 'format') setSelectedFormat(null)
    else if (chip.type === 'status') setSelectedStatus(null)
    else if (chip.type === 'year') setSelectedYear(null)
  }

  const doSearch = useCallback(async (text: string, genreList: string[], season: string | null, fmt: string | null, stat: string | null, srt: string, year: string | null) => {
    setLoading(true)
    try {
      const variables: Record<string, unknown> = {
        sort: [srt]
      }
      if (text.length >= 2) variables.search = text
      if (genreList.length > 0) variables.genre = genreList
      if (season) variables.season = season
      if (fmt) variables.format = fmt
      if (stat) variables.status = stat
      if (year) variables.seasonYear = parseInt(year)

      const result = await searchAnime(variables)
      setResults(result.Page?.media ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      doSearch(query, selectedGenres, selectedSeason, selectedFormat, selectedStatus, selectedSort, selectedYear)
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, selectedGenres, selectedSeason, selectedFormat, selectedStatus, selectedSort, selectedYear, doSearch])

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4">
        <Input
          placeholder="Any"
          value={query}
          onChangeText={setQuery}
          autoFocus
          className="mb-2"
        />
        {/* Active filter badges */}
        {activeFilters.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {activeFilters.map((chip, i) => (
              <Pressable
                key={`${chip.type}-${chip.value}-${i}`}
                onPress={() => removeFilter(chip)}
                className="flex-row items-center bg-accent rounded-full px-3 py-1 mr-2"
              >
                <Text className="text-foreground text-xs mr-1">{chip.label}</Text>
                <X size={12} color="#fafafa" />
              </Pressable>
            ))}
          </ScrollView>
        )}
        {/* Filter toggle */}
        <Pressable onPress={() => setShowFilters(!showFilters)} className="mb-2">
          <Text className="text-muted-foreground text-xs">{showFilters ? 'Hide Filters' : 'Show Filters'}</Text>
        </Pressable>
        {/* Filter dropdowns */}
        {showFilters && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {/* Genre filter */}
            <View className="mr-3">
              <Text className="text-muted-foreground text-xs mb-1">Genres</Text>
              <ScrollView style={{ maxHeight: 120 }}>
                {genres.map(g => (
                  <Pressable
                    key={g}
                    onPress={() => setSelectedGenres(prev =>
                      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
                    )}
                    className={`px-3 py-1.5 rounded mb-0.5 ${selectedGenres.includes(g) ? 'bg-accent' : ''}`}
                  >
                    <Text className={`text-xs ${selectedGenres.includes(g) ? 'text-foreground' : 'text-muted-foreground'}`}>{g}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            {/* Season filter */}
            <View className="mr-3">
              <Text className="text-muted-foreground text-xs mb-1">Season</Text>
              {seasons.map(s => (
                <Pressable
                  key={s.value}
                  onPress={() => setSelectedSeason(prev => prev === s.value ? null : s.value)}
                  className={`px-3 py-1.5 rounded mb-0.5 ${selectedSeason === s.value ? 'bg-accent' : ''}`}
                >
                  <Text className={`text-xs ${selectedSeason === s.value ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
            {/* Format filter */}
            <View className="mr-3">
              <Text className="text-muted-foreground text-xs mb-1">Format</Text>
              {formats.map(f => (
                <Pressable
                  key={f.value}
                  onPress={() => setSelectedFormat(prev => prev === f.value ? null : f.value)}
                  className={`px-3 py-1.5 rounded mb-0.5 ${selectedFormat === f.value ? 'bg-accent' : ''}`}
                >
                  <Text className={`text-xs ${selectedFormat === f.value ? 'text-foreground' : 'text-muted-foreground'}`}>{f.label}</Text>
                </Pressable>
              ))}
            </View>
            {/* Status filter */}
            <View className="mr-3">
              <Text className="text-muted-foreground text-xs mb-1">Status</Text>
              {statusOptions.map(s => (
                <Pressable
                  key={s.value}
                  onPress={() => setSelectedStatus(prev => prev === s.value ? null : s.value)}
                  className={`px-3 py-1.5 rounded mb-0.5 ${selectedStatus === s.value ? 'bg-accent' : ''}`}
                >
                  <Text className={`text-xs ${selectedStatus === s.value ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
            {/* Sort filter */}
            <View className="mr-3">
              <Text className="text-muted-foreground text-xs mb-1">Sort</Text>
              {sortOptions.map(s => (
                <Pressable
                  key={s.value}
                  onPress={() => setSelectedSort(s.value)}
                  className={`px-3 py-1.5 rounded mb-0.5 ${selectedSort === s.value ? 'bg-accent' : ''}`}
                >
                  <Text className={`text-xs ${selectedSort === s.value ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
            {/* Year filter */}
            <View>
              <Text className="text-muted-foreground text-xs mb-1">Year</Text>
              <ScrollView style={{ maxHeight: 120 }}>
                {years.slice(0, 30).map(y => (
                  <Pressable
                    key={y}
                    onPress={() => setSelectedYear(prev => prev === y ? null : y)}
                    className={`px-3 py-1.5 rounded mb-0.5 ${selectedYear === y ? 'bg-accent' : ''}`}
                  >
                    <Text className={`text-xs ${selectedYear === y ? 'text-foreground' : 'text-muted-foreground'}`}>{y}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fafafa" />
        </View>
      ) : results.length === 0 && (query.length > 0 || activeFilters.length > 0) ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">No results found</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 100, paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <MediaCard media={item} className="flex-1" />
          )}
        />
      )}
    </View>
  )
}
