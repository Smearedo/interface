import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { FolderOpen, HardDrive, Users } from 'lucide-react-native'
import { Card, CardContent } from '@/components/ui'

export default function ClientPage () {
  const router = useRouter()

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3 border-b border-border">
        <Text className="text-foreground text-2xl font-bold">Torrent Client</Text>
        <Text className="text-muted-foreground">
          Monitor your torrents, and configure settings for your torrent client.
        </Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Status overview */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">0</Text>
                <Text className="text-muted-foreground text-xs">Active</Text>
              </View>
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">0 B/s</Text>
                <Text className="text-muted-foreground text-xs">Download</Text>
              </View>
              <View className="items-center">
                <Text className="text-foreground text-lg font-bold">0 B/s</Text>
                <Text className="text-muted-foreground text-xs">Upload</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Navigation cards */}
        <Pressable onPress={() => router.push('/(app)/client/library' as never)}>
          <Card className="mb-3">
            <CardContent className="flex-row items-center pt-4 gap-3">
              <FolderOpen size={20} color="#a1a1aa" />
              <View>
                <Text className="text-foreground text-sm font-medium">Torrent Library</Text>
                <Text className="text-muted-foreground text-xs">All of your downloaded torrents. If Persist Files is enabled then your previously downloaded torrents will show up here.</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(app)/client/files' as never)}>
          <Card className="mb-3">
            <CardContent className="flex-row items-center pt-4 gap-3">
              <HardDrive size={20} color="#a1a1aa" />
              <View>
                <Text className="text-foreground text-sm font-medium">File List</Text>
                <Text className="text-muted-foreground text-xs">Files in the currently active torrent, their download progress, and amount of active stream selections.</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(app)/client/peers' as never)}>
          <Card className="mb-3">
            <CardContent className="flex-row items-center pt-4 gap-3">
              <Users size={20} color="#a1a1aa" />
              <View>
                <Text className="text-foreground text-sm font-medium">Peer List</Text>
                <Text className="text-muted-foreground text-xs">Peers connected to the currently active torrent, their statistics, region etc.</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  )
}
