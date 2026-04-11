import React from 'react'
import { View, Text, ScrollView } from 'react-native'

const columns = [
  'IP Address',
  'Client',
  'Progress',
  'Download',
  'Upload',
  'Downloaded',
  'Uploaded',
  'Country',
  'Flags'
] as const

export default function PeersPage () {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-foreground text-2xl font-bold">Peer List</Text>
        <Text className="text-muted-foreground">
          Peers connected to the currently active torrent, their statistics, region etc.
        </Text>
      </View>
      <View className="flex-1 m-4 rounded-md border border-border overflow-hidden">
        <ScrollView horizontal>
          <View className="min-w-full">
            <View className="flex-row bg-black border-b border-border px-2">
              {columns.map((col) => (
                <View key={col} className="w-28 py-3 px-2">
                  <Text className="text-muted-foreground text-xs font-medium">{col}</Text>
                </View>
              ))}
            </View>
            <ScrollView className="flex-1">
              <View className="items-center justify-center py-20">
                <Text className="text-muted-foreground text-sm">No connected peers</Text>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
