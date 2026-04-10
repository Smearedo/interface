import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Input, Button } from '@/components/ui'

const columns = [
  'Series',
  'Episode',
  'Files',
  'Size',
  'Status',
  'Date',
  'Torrent Name'
] as const

export default function LibraryPage () {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-4 pb-2 gap-2">
        <Input
          placeholder="Search by Torrent Name..."
          className="flex-1 bg-black"
        />
        <Button variant="secondary" size="icon">
          <Text className="text-secondary-foreground text-xs">⟳</Text>
        </Button>
        <Button variant="destructive" size="icon">
          <Text className="text-destructive-foreground text-xs">🗑</Text>
        </Button>
      </View>
      <View className="flex-1 mx-4 rounded-md border border-border overflow-hidden">
        <ScrollView horizontal>
          <View className="min-w-full">
            <View className="flex-row bg-black border-b border-border px-2">
              {columns.map((col) => (
                <View
                  key={col}
                  className={col === 'Torrent Name' ? 'flex-1 min-w-[200px] py-3 px-2' : 'w-24 py-3 px-2'}
                >
                  <Text className="text-muted-foreground text-xs font-medium">{col}</Text>
                </View>
              ))}
            </View>
            <ScrollView className="flex-1">
              <View className="items-center justify-center py-20">
                <Text className="text-muted-foreground text-sm">Your torrent library is empty</Text>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
