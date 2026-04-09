import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Input } from '@/components/ui'
import { MediaCard } from '@/components'
import { searchAnime } from '@/modules/anilist/client'
import type { Media } from '@/modules/anilist/util'

export default function SearchPage () {
  const params = useLocalSearchParams<{ q?: string }>()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text)
    if (text.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const result = await searchAnime({ search: text })
      setResults(result.Page?.media ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Input
        placeholder="Search anime..."
        value={query}
        onChangeText={handleSearch}
        autoFocus
        className="mb-4"
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fafafa" />
        </View>
      ) : results.length === 0 && query.length > 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">No results found</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <MediaCard media={item} className="flex-1" />
          )}
        />
      )}
    </View>
  )
}
