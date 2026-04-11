import React, { createContext, useContext, useState, useCallback } from 'react'
import { Modal, Pressable, View, Text, type GestureResponderEvent } from 'react-native'
import { cn } from '@/utils'

interface ContextMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  position: { x: number; y: number }
  setPosition: (pos: { x: number; y: number }) => void
}

const ContextMenuCtx = createContext<ContextMenuContextValue>({
  open: false,
  setOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {}
})

interface ContextMenuProps {
  children: React.ReactNode
}

export function ContextMenu ({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <ContextMenuCtx.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </ContextMenuCtx.Provider>
  )
}

interface ContextMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

export function ContextMenuTrigger ({ children, className }: ContextMenuTriggerProps) {
  const { setOpen, setPosition } = useContext(ContextMenuCtx)

  const handleLongPress = useCallback((e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent
    setPosition({ x: pageX, y: pageY })
    setOpen(true)
  }, [setOpen, setPosition])

  return (
    <Pressable onLongPress={handleLongPress} className={className}>
      {children}
    </Pressable>
  )
}

interface ContextMenuContentProps {
  children: React.ReactNode
  className?: string
}

export function ContextMenuContent ({ children, className }: ContextMenuContentProps) {
  const { open, setOpen, position } = useContext(ContextMenuCtx)

  if (!open) return null

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable className="absolute inset-0" onPress={() => setOpen(false)} />
      <View
        className={cn(
          'bg-popover border border-border rounded-md py-1 shadow-md min-w-[8rem] z-50',
          className
        )}
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x
        }}
      >
        {children}
      </View>
    </Modal>
  )
}

interface ContextMenuItemProps {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  destructive?: boolean
  className?: string
}

export function ContextMenuItem ({ children, onPress, disabled = false, destructive = false, className }: ContextMenuItemProps) {
  const { setOpen } = useContext(ContextMenuCtx)

  const handlePress = useCallback(() => {
    if (disabled) return
    onPress?.()
    setOpen(false)
  }, [disabled, onPress, setOpen])

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(
        'flex-row items-center px-3 py-2',
        disabled && 'opacity-50',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text className={cn('text-sm', destructive ? 'text-destructive' : 'text-popover-foreground')}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
