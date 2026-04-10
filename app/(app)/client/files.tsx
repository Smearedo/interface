import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Input } from '@/components/ui'

const columns = ['File Name', 'Size', 'Progress', 'Streams'] as const

export default function FilesPage () {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-2">
        <Input
          placeholder="Search by File Name..."
          className="bg-black"
        />
      </View>
      <View className="flex-1 mx-4 rounded-md border border-border overflow-hidden">
        <View className="flex-row bg-black border-b border-border px-2">
          {columns.map((col) => (
            <View
              key={col}
              className={col === 'File Name' ? 'flex-1 py-3 px-2' : 'w-24 py-3 px-2'}
            >
              <Text className="text-muted-foreground text-xs font-medium">{col}</Text>
            </View>
          ))}
        </View>
        <ScrollView className="flex-1">
          <View className="items-center justify-center py-20">
            <Text className="text-muted-foreground text-sm">No downloaded files</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
