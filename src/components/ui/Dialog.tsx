import React from 'react'
import { Modal, View, Text, Pressable } from 'react-native'
import { cn } from '@/utils'

interface DialogProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Dialog ({ visible, onClose, children }: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <Pressable className="absolute inset-0 bg-black/80" onPress={onClose} />
        <View className="bg-background border border-border rounded-lg p-6 mx-4 w-full max-w-lg z-10">
          {children}
        </View>
      </View>
    </Modal>
  )
}

export function DialogHeader ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('flex flex-col space-y-1.5 mb-4', className)}>
      {children}
    </View>
  )
}

export function DialogTitle ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}>
      {children}
    </Text>
  )
}

export function DialogDescription ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  )
}

export function DialogFooter ({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('flex flex-row justify-end space-x-2 mt-4', className)}>
      {children}
    </View>
  )
}
