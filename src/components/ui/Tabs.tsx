import React, { useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { cn } from '@/utils'

interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: (activeValue: string) => React.ReactNode
  className?: string
}

export function Tabs ({ items, defaultValue, onValueChange, children, className }: TabsProps) {
  const [activeValue, setActiveValue] = useState(defaultValue ?? items[0]?.value ?? '')

  const handleChange = (value: string) => {
    setActiveValue(value)
    onValueChange?.(value)
  }

  return (
    <View className={cn('flex-1', className)}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-border">
        <View className="flex-row">
          {items.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => handleChange(item.value)}
              className={cn(
                'px-4 py-2',
                activeValue === item.value && 'border-b-2 border-foreground'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  activeValue === item.value ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {children(activeValue)}
    </View>
  )
}
