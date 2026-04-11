import React, { useState } from 'react'
import { View, Text, Pressable, Modal, FlatList } from 'react-native'
import { cn } from '@/utils'
import { ChevronDown } from 'lucide-react-native'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Select ({ options, value, onValueChange, placeholder = 'Select...', className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find(o => o.value === value)

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(
          'flex-row items-center justify-between h-10 w-full rounded-md border border-border bg-background px-3 py-2',
          className
        )}
      >
        <Text className={cn('text-sm', selectedOption ? 'text-foreground' : 'text-muted-foreground')}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <ChevronDown size={16} color="#a1a1aa" />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-center items-center" onPress={() => setOpen(false)}>
          <View className="bg-popover border border-border rounded-lg mx-8 w-full max-w-sm max-h-80">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onValueChange?.(item.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'px-4 py-3',
                    item.value === value && 'bg-accent'
                  )}
                >
                  <Text className={cn('text-sm', item.value === value ? 'text-accent-foreground' : 'text-popover-foreground')}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
