import { authAggregator } from '.'

import type { Media } from '../anilist/util'

export function progress (media: { id: Media['id'], mediaListEntry: Pick<Media['mediaListEntry'] & {}, 'progress' | 'id'> | null }): number | undefined {
  // HACK: this is unsafe, but it shouldnt be a problem
  return authAggregator.mediaListEntry(media as Media)?.progress ?? undefined
}

export function fav (media: Pick<Media, 'isFavourite' | 'id'>): boolean {
  return !!authAggregator.isFavourite(media)
}

export function list (media: { id: Media['id'], mediaListEntry: Pick<Media['mediaListEntry'] & {}, 'status' | 'id'> | null }): 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING' | null | undefined {
  // HACK: this is unsafe, but it shouldnt be a problem
  return authAggregator.mediaListEntry(media as Media)?.status as 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING' | null | undefined
}

export function lists (media: Pick<Media, 'mediaListEntry' | 'id'>): Array<{ enabled: boolean, name: string }> | undefined {
  return authAggregator.mediaListEntry(media)?.customLists as Array<{ enabled: boolean, name: string }> | undefined
}

export function repeat (media: Pick<Media, 'mediaListEntry' | 'id'>): number | null | undefined {
  return authAggregator.mediaListEntry(media)?.repeat
}

export function score (media: Pick<Media, 'mediaListEntry' | 'id'>): number | null | undefined {
  return authAggregator.mediaListEntry(media)?.score
}

export function entry (media: Pick<Media, 'mediaListEntry' | 'id'>): Media['mediaListEntry'] {
  return authAggregator.mediaListEntry(media) ?? null
}

export function of (media: Pick<Media, 'episodes' | 'mediaListEntry' | 'id'>): string | undefined {
  const count = media.episodes
  if (count === 1 || !count) return

  const prog = progress(media)
  if (!prog || prog === count) return `${count} Episodes`

  return `${prog} / ${count} Episodes`
}
