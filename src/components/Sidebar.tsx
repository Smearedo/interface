import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import {
  Home, Search, Calendar, Users, Download, Settings, MessageCircle
} from 'lucide-react-native'
import { cn } from '@/utils'

interface SidebarItem {
  icon: React.ReactNode
  label: string
  path: string
}

export function Sidebar () {
  const router = useRouter()
  const pathname = usePathname()

  const items: SidebarItem[] = [
    { icon: <Home size={20} color={pathname.includes('/home') ? '#fafafa' : '#a1a1aa'} />, label: 'Home', path: '/(app)/home' },
    { icon: <Search size={20} color={pathname.includes('/search') ? '#fafafa' : '#a1a1aa'} />, label: 'Search', path: '/(app)/search' },
    { icon: <Calendar size={20} color={pathname.includes('/schedule') ? '#fafafa' : '#a1a1aa'} />, label: 'Schedule', path: '/(app)/schedule' },
    { icon: <Users size={20} color={pathname.includes('/chat') ? '#fafafa' : '#a1a1aa'} />, label: 'Chat', path: '/(app)/chat' },
    { icon: <Download size={20} color={pathname.includes('/client') ? '#fafafa' : '#a1a1aa'} />, label: 'Client', path: '/(app)/client' },
    { icon: <MessageCircle size={20} color={pathname.includes('/w2g') ? '#fafafa' : '#a1a1aa'} />, label: 'W2G', path: '/(app)/w2g' },
    { icon: <Settings size={20} color={pathname.includes('/settings') ? '#fafafa' : '#a1a1aa'} />, label: 'Settings', path: '/(app)/settings' }
  ]

  return (
    <View className="w-14 bg-background border-r border-border items-center pt-2 pb-4">
      {items.map((item) => (
        <Pressable
          key={item.path}
          onPress={() => router.push(item.path as never)}
          className={cn(
            'w-10 h-10 items-center justify-center rounded-md my-0.5',
            pathname.includes(item.path.replace('/(app)', '')) && 'bg-accent'
          )}
        >
          {item.icon}
        </Pressable>
      ))}
    </View>
  )
}
