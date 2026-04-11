import AsyncStorage from '@react-native-async-storage/async-storage'

import type { Media } from '../anilist/util'

type StoredMedia = Pick<Media, 'isFavourite' | 'mediaListEntry' | 'id'>

const STORAGE_KEY = 'local-watchlist'

export default new class LocalSync {
  entries: Record<number, StoredMedia> = {}

  constructor () {
    this._loadEntries()
  }

  private async _loadEntries () {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (raw) this.entries = JSON.parse(raw)
    } catch {
      // ignore
    }
  }

  private async _saveEntries () {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries))
  }

  get (id: number) {
    return this.entries[id]
  }

  _getEntry (id: number): StoredMedia {
    return this.entries[id] ?? {
      id,
      isFavourite: false,
      mediaListEntry: {
        id,
        customLists: null,
        progress: null,
        repeat: null,
        score: null,
        status: null
      }
    }
  }

  async toggleFav (id: number) {
    const entry = this._getEntry(id)
    entry.isFavourite = !entry.isFavourite
    this.entries[id] = entry
    await this._saveEntries()
  }

  async deleteEntry (media: Media) {
    const id = media.id
    const entry = this._getEntry(id)
    entry.mediaListEntry = null
    this.entries[media.id] = entry
    await this._saveEntries()
  }

  getContinueIDs (): number[] {
    return Object.entries(this.entries)
      .filter(([, entry]) => entry.mediaListEntry?.status === 'REPEATING' || entry.mediaListEntry?.status === 'CURRENT')
      .map(([id]) => Number(id))
  }

  getPlanningIDs (): number[] {
    return Object.entries(this.entries)
      .filter(([, entry]) => entry.mediaListEntry?.status === 'PLANNING')
      .map(([id]) => Number(id))
  }

  async entry (variables: { id: number; status?: string; score?: number; repeat?: number; progress?: number }) {
    const entry = this._getEntry(variables.id)
    entry.mediaListEntry ??= {
      id: variables.id,
      customLists: null,
      progress: null,
      repeat: null,
      score: null,
      status: null
    }

    const keys = ['status', 'score', 'repeat', 'progress'] as const
    for (const key of keys) {
      let value = variables[key]
      // @ts-expect-error idk how to fix this tbf
      if (key === 'score' && value != null) value /= 10
      // @ts-expect-error idk how to fix this tbf
      entry.mediaListEntry[key] = value ?? entry.mediaListEntry[key] ?? null
    }
    this.entries[variables.id] = entry
    await this._saveEntries()
  }
}()
