import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { usePathname, useRouter } from 'expo-router'
import { cn } from '@/utils'

interface NavItem {
  href: string
  title: string
}

interface SettingsNavProps {
  items: NavItem[]
  className?: string
}

export function SettingsNav ({ items, className }: SettingsNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <View className={cn('flex-col gap-y-1 pb-2', className)}>
      {items.map((item, i) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Pressable
            key={i}
            onPress={() => router.push(item.href as never)}
            className={cn(
              'relative px-4 py-2 rounded-md justify-start',
              isActive ? 'bg-foreground' : 'bg-transparent'
            )}
          >
            <Text className={cn('font-semibold text-sm', isActive ? 'text-background' : 'text-foreground')}>
              {item.title}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
