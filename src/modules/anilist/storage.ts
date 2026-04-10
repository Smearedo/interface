/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import type {
  SerializedEntries,
  SerializedRequest,
  StorageAdapter
} from '@urql/exchange-graphcache'

export interface StorageOptions {
  /** Name of the AsyncStorage key prefix that will be used.
   * @defaultValue `'graphcache-v4'`
   */
  idbName?: string
  /** Maximum age of cache entries (in days) after which data is discarded.
   * @defaultValue `7` days
   */
  maxAge?: number
  /** Gets Called when the exchange has hydrated the data from storage. */
  onCacheHydrated?: () => void
}

/** Storage adapter persisting to AsyncStorage (React Native). */
export interface DefaultStorage extends StorageAdapter {
  /** Clears the entire storage. */
  clear: () => Promise<any>
}

/** Creates a default {@link StorageAdapter} which uses AsyncStorage for storage.
 *
 * @param opts - A {@link StorageOptions} configuration object.
 * @returns the created {@link StorageAdapter}.
 *
 * @remarks
 * The default storage uses AsyncStorage to persist the normalized cache for
 * offline use. It demonstrates that the cache can be chunked by timestamps.
 *
 * Note: We have no data on stability of this storage and our Offline Support
 * for large APIs or longterm use. Proceed with caution.
 */
export const makeDefaultStorage = (opts?: StorageOptions): DefaultStorage => {
  opts ??= {}

  let callback: (() => void) | undefined

  const DB_NAME = opts.idbName || 'graphcache-v4'
  const ENTRIES_KEY = `${DB_NAME}:entries`
  const METADATA_KEY = `${DB_NAME}:metadata`

  let batch: SerializedEntries = Object.create(null)
  const timestamp = Math.floor(new Date().valueOf() / (1000 * 60 * 60 * 24))
  const maxAge = timestamp - (opts.maxAge || 7)

  return {
    clear () {
      batch = Object.create(null)
      return Promise.all([
        AsyncStorage.removeItem(ENTRIES_KEY),
        AsyncStorage.removeItem(METADATA_KEY)
      ]).then(() => undefined)
    },

    readMetadata (): Promise<null | SerializedRequest[]> {
      return AsyncStorage.getItem(METADATA_KEY).then(
        raw => (raw ? JSON.parse(raw) as SerializedRequest[] : null),
        () => null
      )
    },

    writeMetadata (metadata: SerializedRequest[]) {
      AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata)).catch(() => {
        /* noop */
      })
    },

    writeData (entries: SerializedEntries): Promise<void> {
      Object.assign(batch, entries)
      const toUndefined = () => undefined

      return AsyncStorage.getItem(ENTRIES_KEY)
        .then(raw => {
          const stored: Record<number, SerializedEntries> = raw ? JSON.parse(raw) : {}
          stored[timestamp] = { ...(stored[timestamp] || {}), ...batch }
          return AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(stored))
        })
        .then(toUndefined, toUndefined)
    },

    readData (): Promise<SerializedEntries> {
      const data = Object.create(null)
      return AsyncStorage.getItem(ENTRIES_KEY)
        .then(raw => {
          const stored: Record<number, SerializedEntries> = raw ? JSON.parse(raw) : {}
          for (const [key, entries] of Object.entries(stored)) {
            const numKey = Number(key)
            if (numKey < maxAge) {
              delete stored[numKey]
            } else {
              if (numKey === timestamp) Object.assign(batch, entries)
              Object.assign(data, entries)
            }
          }
          // Write back cleaned data
          AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(stored)).catch(() => {})
          return data
        })
        .catch(() => batch)
    },
    onCacheHydrated: opts.onCacheHydrated,
    onOnline (cb: () => void) {
      if (callback) {
        // Remove previous listener (no direct equivalent, just update reference)
        callback = undefined
      }

      callback = cb
      // In React Native, use AppState to detect when app comes to foreground
      AppState.addEventListener('change', (state) => {
        if (state === 'active' && callback) {
          callback()
        }
      })
    }
  }
}
