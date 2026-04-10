import React, { useState, useRef, useCallback } from 'react'
import { Modal, Pressable, View, type LayoutRectangle } from 'react-native'
import { cn } from '@/utils'

interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Popover ({ trigger, children, open: controlledOpen, onOpenChange, className }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const triggerRef = useRef<View>(null)

  const isOpen = controlledOpen ?? internalOpen

  const handleOpenChange = useCallback((value: boolean) => {
    setInternalOpen(value)
    onOpenChange?.(value)
  }, [onOpenChange])

  const handleTriggerPress = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height })
    })
    handleOpenChange(!isOpen)
  }, [isOpen, handleOpenChange])

  return (
    <>
      <Pressable onPress={handleTriggerPress} ref={triggerRef}>
        {trigger}
      </Pressable>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => handleOpenChange(false)}
      >
        <Pressable className="absolute inset-0" onPress={() => handleOpenChange(false)} />
        <View
          className={cn(
            'bg-popover border border-border rounded-md p-4 shadow-md z-50 w-72',
            className
          )}
          style={layout ? {
            position: 'absolute',
            top: (layout.y ?? 0) + (layout.height ?? 0) + 4,
            left: Math.max(8, (layout.x ?? 0) + ((layout.width ?? 0) / 2) - 144)
          } : {
            position: 'absolute',
            top: '50%',
            alignSelf: 'center'
          }}
        >
          {children}
        </View>
      </Modal>
    </>
  )
}
