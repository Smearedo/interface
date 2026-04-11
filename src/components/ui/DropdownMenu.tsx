import React, { createContext, useContext, useState, useRef, useCallback } from 'react'
import { Dimensions, Modal, Pressable, View, Text, type LayoutRectangle } from 'react-native'
import { cn } from '@/utils'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  layout: LayoutRectangle | null
  setLayout: (layout: LayoutRectangle | null) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  layout: null,
  setLayout: () => {}
})

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu ({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, layout, setLayout }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenuTrigger ({ children, className }: DropdownMenuTriggerProps) {
  const { open, setOpen, setLayout } = useContext(DropdownMenuContext)
  const triggerRef = useRef<View>(null)

  const handlePress = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height })
    })
    setOpen(!open)
  }, [open, setOpen, setLayout])

  return (
    <Pressable onPress={handlePress} ref={triggerRef} className={className}>
      {children}
    </Pressable>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
}

export function DropdownMenuContent ({ children, className, align = 'start' }: DropdownMenuContentProps) {
  const { open, setOpen, layout } = useContext(DropdownMenuContext)

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
        style={layout ? {
          position: 'absolute',
          top: (layout.y ?? 0) + (layout.height ?? 0) + 4,
          ...(align === 'end'
            ? { right: Dimensions.get('window').width - (layout.x ?? 0) - (layout.width ?? 0) }
            : align === 'center'
              ? { left: (layout.x ?? 0) + ((layout.width ?? 0) / 2) - 64 }
              : { left: layout.x ?? 0 }
          )
        } : { position: 'absolute', top: 100, alignSelf: 'center' }}
      >
        {children}
      </View>
    </Modal>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  destructive?: boolean
  className?: string
}

export function DropdownMenuItem ({ children, onPress, disabled = false, destructive = false, className }: DropdownMenuItemProps) {
  const { setOpen } = useContext(DropdownMenuContext)

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

export function DropdownMenuSeparator ({ className }: { className?: string }) {
  return <View className={cn('h-px bg-border my-1', className)} />
}
