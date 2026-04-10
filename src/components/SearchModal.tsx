import React, { useState, useCallback } from 'react'
import { View, Text, Pressable, FlatList, Modal } from 'react-native'
import { Image } from 'expo-image'
import { Search, X } from 'lucide-react-native'
import { cn } from '@/utils'
import { Input } from './ui/Input'

export interface SearchResult {
  id: number
  title?: { english?: string | null; romaji?: string | null } | null
  coverImage?: { medium?: string | null } | null
  format?: string | null
  status?: string | null
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
  onSearch?: (query: string) => Promise<SearchResult[]> | SearchResult[]
  onSelect?: (result: SearchResult) => void
  className?: string
}

export function SearchModal ({ open, onClose, onSearch, onSelect, className }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text)
    if (!text.trim() || !onSearch) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const data = await onSearch(text)
      setResults(data)
    } finally {
      setLoading(false)
    }
  }, [onSearch])

  const handleSelect = useCallback((result: SearchResult) => {
    onSelect?.(result)
    onClose()
    setQuery('')
    setResults([])
  }, [onSelect, onClose])

  const handleClose = useCallback(() => {
    onClose()
    setQuery('')
    setResults([])
  }, [onClose])

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-start pt-20">
        <Pressable className="absolute inset-0 bg-black/80" onPress={handleClose} />

        <View className={cn('bg-background border border-border rounded-lg mx-4 max-h-[70%] z-10', className)}>
          <View className="flex-row items-center px-4 py-3 border-b border-border">
            <Search size={18} color="#a1a1aa" />
            <Input
              className="flex-1 border-0 ml-2"
              placeholder="Search anime..."
              placeholderTextColor="#a1a1aa"
              value={query}
              onChangeText={handleSearch}
              autoFocus
            />
            <Pressable onPress={handleClose} className="ml-2">
              <X size={18} color="#a1a1aa" />
            </Pressable>
          </View>

          {loading && (
            <View className="py-8 items-center">
              <Text className="text-muted-foreground text-sm">Searching...</Text>
            </View>
          )}

          {!loading && query.trim() !== '' && results.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-muted-foreground text-sm">No results found</Text>
            </View>
          )}

          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  className="flex-row items-center px-4 py-3 border-b border-border"
                >
                  {item.coverImage?.medium && (
                    <Image
                      source={{ uri: item.coverImage.medium }}
                      style={{ width: 40, height: 56, borderRadius: 4 }}
                      contentFit="cover"
                    />
                  )}
                  <View className="flex-1 ml-3">
                    <Text className="text-foreground text-sm font-medium" numberOfLines={1}>
                      {item.title?.english ?? item.title?.romaji ?? 'Unknown'}
                    </Text>
                    {item.format && (
                      <Text className="text-muted-foreground text-xs mt-0.5">
                        {item.format}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}
