import React from 'react'
import { Modal, Pressable, View, Text, useWindowDimensions } from 'react-native'
import { X } from 'lucide-react-native'
import { cn } from '@/utils'

type Side = 'bottom' | 'right'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: Side
  className?: string
}

export function Sheet ({ open, onOpenChange, children, side = 'bottom', className }: SheetProps) {
  const { width, height } = useWindowDimensions()

  const sideStyles: Record<Side, string> = {
    bottom: 'absolute bottom-0 left-0 right-0 rounded-t-lg',
    right: 'absolute top-0 right-0 bottom-0'
  }

  const sizeStyles: Record<Side, object> = {
    bottom: { maxHeight: height * 0.85 },
    right: { width: Math.min(width * 0.8, 400) }
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => onOpenChange(false)}
    >
      <View className="flex-1">
        <Pressable className="absolute inset-0 bg-black/80" onPress={() => onOpenChange(false)} />
        <View
          className={cn(
            'bg-background border border-border',
            sideStyles[side],
            className
          )}
          style={sizeStyles[side]}
        >
          <Pressable
            onPress={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-10 rounded-sm opacity-70"
          >
            <X size={16} color="#fafafa" />
          </Pressable>
          {children}
        </View>
      </View>
    </Modal>
  )
}

export function SheetContent ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('p-6', className)}>
      {children}
    </View>
  )
}

export function SheetHeader ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('flex flex-col space-y-2 px-6 pt-6', className)}>
      {children}
    </View>
  )
}

export function SheetTitle ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)}>
      {children}
    </Text>
  )
}

export function SheetDescription ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  )
}
