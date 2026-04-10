import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { Separator } from '@/components/ui'
import { COMMITS_URL } from '@/modules/constants'

interface Commit {
  sha: string
  commit: {
    message: string
    author: { date: string }
  }
}

export default function ChangelogPage () {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(COMMITS_URL)
      .then(r => r.json())
      .then((data: Commit[]) => {
        setCommits(Array.isArray(data) ? data.map(({ sha, commit }) => ({ sha, commit })) : [])
      })
      .catch((e) => setError(e.stack || e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      <View className="h-60 justify-center">
        <Text className="text-foreground text-4xl font-bold mb-3">Changelog</Text>
        <Text className="text-muted-foreground text-sm">New updates and improvements to Hayase.</Text>
      </View>

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <View key={i}>
            <Separator className="my-6" />
            <View className="py-4">
              <View className="bg-primary/5 rounded h-2 w-28 mb-3" />
              <View className="bg-primary/5 rounded h-4 w-48" />
              <View className="mt-3 bg-primary/5 rounded h-2 w-32" />
              <View className="mt-2 bg-primary/5 rounded h-2 w-28" />
            </View>
          </View>
        ))
      ) : error ? (
        <View className="py-8">
          <Text className="text-foreground text-2xl font-bold mb-3">Failed to load changelog</Text>
          <Text className="text-muted-foreground text-xs">{error}</Text>
        </View>
      ) : (
        commits.map(({ sha, commit }) => (
          <View key={sha}>
            <Separator className="my-6" />
            <View className="py-4">
              <Text className="text-muted-foreground text-xs mb-3">
                {new Date(commit.author.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
              <Text className="text-foreground text-lg font-bold mb-3 text-white">{sha.slice(0, 6)}</Text>
              <Text className="text-muted-foreground text-md">
                {commit.message.replaceAll('- ', '').trim()}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}
