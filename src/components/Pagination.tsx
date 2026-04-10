import React, { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native'
import { cn } from '@/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

interface PageItem {
  page: number
  type: 'page' | 'ellipsis'
}

export function Pagination ({ currentPage, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) {
  const pages = useMemo<PageItem[]>(() => {
    const edgeSize = 4 * siblingCount
    const startPage = Math.max(1, totalPages - currentPage < edgeSize ? totalPages - edgeSize : currentPage - siblingCount)
    const endPage = Math.min(totalPages, currentPage < edgeSize ? 1 + edgeSize : currentPage + siblingCount)
    const items: PageItem[] = []

    if (startPage > 1) {
      items.push({ page: 1, type: 'page' })
      if (startPage > 2) {
        items.push({ page: startPage - 1, type: 'ellipsis' })
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push({ page: i, type: 'page' })
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push({ page: endPage + 1, type: 'ellipsis' })
      }
      items.push({ page: totalPages, type: 'page' })
    }

    return items
  }, [currentPage, totalPages, siblingCount])

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  if (totalPages <= 1) return null

  return (
    <View className={cn('flex-row items-center justify-center space-x-1', className)}>
      <Pressable
        onPress={() => hasPrev && onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={cn(
          'h-9 w-9 items-center justify-center rounded-md',
          !hasPrev && 'opacity-50'
        )}
      >
        <ChevronLeft size={16} color="#fafafa" />
      </Pressable>

      {pages.map((item, index) => (
        item.type === 'ellipsis' ? (
          <View key={`ellipsis-${index}`} className="h-9 w-9 items-center justify-center">
            <MoreHorizontal size={16} color="#a1a1aa" />
          </View>
        ) : (
          <Pressable
            key={`page-${item.page}`}
            onPress={() => onPageChange(item.page)}
            className={cn(
              'h-9 w-9 items-center justify-center rounded-md',
              item.page === currentPage
                ? 'bg-primary'
                : 'bg-secondary'
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                item.page === currentPage
                  ? 'text-primary-foreground'
                  : 'text-foreground'
              )}
            >
              {item.page}
            </Text>
          </Pressable>
        )
      ))}

      <Pressable
        onPress={() => hasNext && onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={cn(
          'h-9 w-9 items-center justify-center rounded-md',
          !hasNext && 'opacity-50'
        )}
      >
        <ChevronRight size={16} color="#fafafa" />
      </Pressable>
    </View>
  )
}
