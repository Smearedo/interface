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
        <Text className="text-foreground font-semibold text-lg">Torrent Client</Text>
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
                <Text className="text-foreground text-sm font-medium">Library</Text>
                <Text className="text-muted-foreground text-xs">Manage your torrent library</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(app)/client/files' as never)}>
          <Card className="mb-3">
            <CardContent className="flex-row items-center pt-4 gap-3">
              <HardDrive size={20} color="#a1a1aa" />
              <View>
                <Text className="text-foreground text-sm font-medium">Files</Text>
                <Text className="text-muted-foreground text-xs">View downloaded files</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(app)/client/peers' as never)}>
          <Card className="mb-3">
            <CardContent className="flex-row items-center pt-4 gap-3">
              <Users size={20} color="#a1a1aa" />
              <View>
                <Text className="text-foreground text-sm font-medium">Peers</Text>
                <Text className="text-muted-foreground text-xs">View connected peers</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>
      </ScrollView>
    </View>
  )
}
