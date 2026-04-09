import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import {
  Home, Search, Calendar, Users, Download, Heart, User
} from 'lucide-react-native'
import { cn } from '@/utils'

export function Sidebar () {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname.includes(path.replace('/(app)', ''))

  return (
    <View className="w-14 bg-background border-r border-border items-center pt-2 pb-4">
      {/* Logo would go here on desktop */}
      <Pressable
        onPress={() => router.push('/(app)/home' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/home') && 'bg-accent')}
      >
        <Home size={18} color={isActive('/home') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/search' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/search') && 'bg-accent')}
      >
        <Search size={18} color={isActive('/search') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/schedule' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/schedule') && 'bg-accent')}
      >
        <Calendar size={18} color={isActive('/schedule') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/w2g' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/w2g') && 'bg-accent')}
      >
        <Users size={18} color={isActive('/w2g') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>
      {/* Chat is commented out in original Hayase
      <Pressable
        onPress={() => router.push('/(app)/chat' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/chat') && 'bg-accent')}
      >
        <MessageCircle size={18} color={isActive('/chat') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>
      */}
      <Pressable
        onPress={() => router.push('/(app)/client' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/client') && 'bg-accent')}
      >
        <Download size={18} color={isActive('/client') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>

      {/* Donate heart - matches original sidebar */}
      <Pressable
        className="w-10 h-10 items-center justify-center rounded-md mt-auto"
        onPress={() => {/* native.openURL('https://github.com/sponsors/ThaUnknown/') */}}
      >
        <Heart size={18} color="#fa68b6" fill="#fa68b6" />
      </Pressable>

      {/* Settings - Bolt icon in original */}
      <Pressable
        onPress={() => router.push('/(app)/settings' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/settings') && 'bg-accent')}
      >
        <Text className={isActive('/settings') ? 'text-foreground' : 'text-muted-foreground'}>⚡</Text>
      </Pressable>

      {/* Profile */}
      <Pressable
        onPress={() => router.push('/(app)/profile' as never)}
        className={cn('w-10 h-10 items-center justify-center rounded-md my-0.5', isActive('/profile') && 'bg-accent')}
      >
        <User size={18} color={isActive('/profile') ? '#fafafa' : '#a1a1aa'} />
      </Pressable>
    </View>
  )
}
