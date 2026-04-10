/**
 * Auth aggregation helpers.
 *
 * Thin wrappers around the Zustand auth store that expose an API shape
 * compatible with the head's AuthAggregator class.
 */
import { useAuthStore } from '@/stores/auth'
import type { Media } from '@/modules/anilist/util'

/** Check if any auth provider is authenticated */
export function hasAuth (): boolean {
  return useAuthStore.getState().hasAuth()
}

/** Check if AniList is authenticated */
export function anilist (): boolean {
  return !!useAuthStore.getState().anilistToken
}

/** Check if Kitsu is authenticated */
export function kitsu (): boolean {
  return !!useAuthStore.getState().kitsuToken
}

/** Check if MAL is authenticated */
export function mal (): boolean {
  return !!useAuthStore.getState().malToken
}

/** Get the authenticated user's id (AniList preferred) */
export function id (): number {
  const state = useAuthStore.getState()
  const viewer = state.anilistViewer as Record<string, unknown> | null
  if (viewer?.id) return viewer.id as number
  return -1
}

/** Get the authenticated user's profile */
export function profile (): Record<string, unknown> | undefined {
  const state = useAuthStore.getState()
  if (state.anilistViewer) return state.anilistViewer
  if (state.malViewer) return state.malViewer
  if (state.kitsuViewer) return state.kitsuViewer
  return undefined
}

/** Get media list entry for a given media */
export function mediaListEntry (media: Pick<Media, 'mediaListEntry' | 'id'>) {
  if (anilist()) return media.mediaListEntry
  return undefined
}

/** Check if media is a favourite */
export function isFavourite (media: Pick<Media, 'isFavourite' | 'id'>): boolean | undefined {
  if (anilist()) return media.isFavourite
  return undefined
}

/** Get sync settings */
export function syncSettings () {
  return useAuthStore.getState().syncSettings
}

/** Logout of all providers */
export function logout (): void {
  useAuthStore.getState().logout()
}

const authAggregator = {
  hasAuth,
  anilist,
  kitsu,
  mal,
  id,
  profile,
  mediaListEntry,
  isFavourite,
  syncSettings,
  logout
}

export default authAggregator
