import React, { useState, useCallback } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { cn } from '@/utils'
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

const STATUS_OPTIONS = [
  { label: 'Watching', value: 'CURRENT' },
  { label: 'Plan to Watch', value: 'PLANNING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Dropped', value: 'DROPPED' },
  { label: 'Re-Watching', value: 'REPEATING' }
]

const SCORE_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  label: String(i),
  value: String(i)
}))

export interface EntryMedia {
  id: number
  title?: { english?: string | null; romaji?: string | null; native?: string | null } | null
  coverImage?: { large?: string | null; color?: string | null } | null
  bannerImage?: string | null
  episodes?: number | null
}

export interface EntryData {
  status?: string | null
  progress?: number | null
  score?: number | null
  repeat?: number | null
}

interface EntryEditorProps {
  media: EntryMedia
  entry?: EntryData | null
  onSave?: (data: { status: string; progress: number; score: number; repeat: number }) => void
  onDelete?: () => void
  visible: boolean
  onClose: () => void
}

export function EntryEditor ({ media, entry, onSave, onDelete, visible, onClose }: EntryEditorProps) {
  const [status, setStatus] = useState(entry?.status ?? 'CURRENT')
  const [score, setScore] = useState(String(entry?.score ?? 0))
  const [progress, setProgress] = useState(String(entry?.progress ?? 0))
  const [repeat, setRepeat] = useState(String(entry?.repeat ?? 0))

  const mediaTitle = media.title?.english ?? media.title?.romaji ?? media.title?.native ?? 'Unknown'
  const coverUrl = media.coverImage?.large

  const handleSave = useCallback(() => {
    onSave?.({
      status,
      progress: Number(progress),
      score: Number(score),
      repeat: Number(repeat)
    })
    onClose()
  }, [status, progress, score, repeat, onSave, onClose])

  return (
    <Dialog visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {coverUrl && (
          <View className="w-full h-32 rounded-t-md overflow-hidden mb-4">
            <Image
              source={{ uri: coverUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
        )}

        <DialogHeader>
          <DialogTitle>{mediaTitle}</DialogTitle>
        </DialogHeader>

        <View className="gap-4 mt-2">
          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-2">Status</Text>
            <Select options={STATUS_OPTIONS} value={status} onValueChange={setStatus} />
          </View>

          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-2">Score</Text>
            <Select options={SCORE_OPTIONS} value={score} onValueChange={setScore} />
          </View>

          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-2">Progress</Text>
            <Input
              value={progress}
              onChangeText={setProgress}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-2">Rewatched Times</Text>
            <Input
              value={repeat}
              onChangeText={setRepeat}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        <DialogFooter>
          {onDelete && (
            <Button variant="destructive" onPress={onDelete}>
              <Text className="text-destructive-foreground text-sm">Delete</Text>
            </Button>
          )}
          <Button variant="secondary" onPress={onClose}>
            <Text className="text-foreground text-sm">Cancel</Text>
          </Button>
          <Button onPress={handleSave}>
            <Text className="text-primary-foreground text-sm">Save</Text>
          </Button>
        </DialogFooter>
      </ScrollView>
    </Dialog>
  )
}
