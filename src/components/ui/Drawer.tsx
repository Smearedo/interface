import React from 'react'
import { Modal, Pressable, View, Text, useWindowDimensions } from 'react-native'
import { cn } from '@/utils'

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Drawer ({ open, onOpenChange, children }: DrawerProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => onOpenChange(false)}
    >
      <View className="flex-1">
        <Pressable className="absolute inset-0 bg-black/80" onPress={() => onOpenChange(false)} />
        {children}
      </View>
    </Modal>
  )
}

export function DrawerContent ({ className, children }: { className?: string; children: React.ReactNode }) {
  const { height } = useWindowDimensions()

  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-background border-t-4 border-t-neutral-700/60 rounded-t-lg',
        className
      )}
      style={{ maxHeight: height * 0.85 }}
    >
      <View className="mx-auto mt-3 mb-2 h-1.5 w-12 rounded-full bg-muted" />
      {children}
    </View>
  )
}

export function DrawerHeader ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('flex flex-col space-y-1.5 px-4 py-2', className)}>
      {children}
    </View>
  )
}

export function DrawerTitle ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)}>
      {children}
    </Text>
  )
}

export function DrawerDescription ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  )
}

export function DrawerFooter ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('flex flex-row justify-end space-x-2 px-4 py-3', className)}>
      {children}
    </View>
  )
}
