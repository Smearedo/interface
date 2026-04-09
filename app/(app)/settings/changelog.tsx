import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { COMMITS_URL, APP_VERSION } from '@/modules/constants'

interface Commit {
  sha: string
  commit: {
    message: string
    author: { name: string; date: string }
  }
}

export default function ChangelogPage () {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(COMMITS_URL + '?per_page=30')
      .then(r => r.json())
      .then(data => setCommits(Array.isArray(data) ? data : []))
      .catch(() => setCommits([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground font-semibold text-lg">Changelog</Text>
        <Text className="text-muted-foreground text-xs">v{APP_VERSION}</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#fafafa" className="mt-8" />
        ) : (
          commits.map((commit) => (
            <View key={commit.sha} className="mb-4 pb-4 border-b border-border">
              <Text className="text-foreground text-sm" numberOfLines={2}>
                {commit.commit.message.split('\n')[0]}
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                {commit.commit.author.name} • {new Date(commit.commit.author.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
