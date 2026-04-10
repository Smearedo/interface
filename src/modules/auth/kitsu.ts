import Debug from 'debug'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { mappings, mappingsByKitsuId } from '../anizip'

import type { Anime, Fav, KEntry, KitsuError, KitsuMediaStatus, Mapping, OAuth, Res, Resource, ResSingle, User } from './kitsu-types'

const debug = Debug('ui:kitsu')

const ENDPOINTS = {
  API_OAUTH: 'https://kitsu.app/api/oauth/token',
  API_USER_FETCH: 'https://kitsu.app/api/edge/users',
  API_USER_LIBRARY: 'https://kitsu.app/api/edge/library-entries',
  API_FAVOURITES: 'https://kitsu.app/api/edge/favorites'
} as const

type ALMediaStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING'

const KITSU_TO_AL_STATUS: Record<KitsuMediaStatus, ALMediaStatus> = {
  current: 'CURRENT',
  planned: 'PLANNING',
  completed: 'COMPLETED',
  dropped: 'DROPPED',
  on_hold: 'PAUSED'
}

const AL_TO_KITSU_STATUS: Record<ALMediaStatus, KitsuMediaStatus> = {
  CURRENT: 'current',
  PLANNING: 'planned',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  PAUSED: 'on_hold',
  REPEATING: 'current'
}

interface KitsuSyncState {
  auth?: OAuth
  viewer?: Record<string, unknown>
  userlist: Record<string, unknown>
  favorites: Record<string, string>
}

export default new class KitsuSync {
  kitsuToAL: Record<string, string> = {}
  ALToKitsu: Record<string, string> = {}

  private _state: KitsuSyncState = {
    auth: undefined,
    viewer: undefined,
    userlist: {},
    favorites: {}
  }

  constructor () {
    this._loadState()
  }

  private async _loadState () {
    try {
      const raw = await AsyncStorage.getItem('kitsuState')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<KitsuSyncState>
        Object.assign(this._state, parsed)
        if (this._state.auth) this._user()
      }
    } catch (e) {
      debug('failed to load kitsu state', e)
    }
  }

  private async _saveState () {
    try {
      await AsyncStorage.setItem('kitsuState', JSON.stringify({
        auth: this._state.auth,
        viewer: this._state.viewer,
        favorites: this._state.favorites
      }))
    } catch (e) {
      debug('failed to save kitsu state', e)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async _request <T = object> (url: string | URL, method: string, body?: any): Promise<T | KitsuError> {
    const auth = this._state.auth
    try {
      if (auth) {
        const expiresAt = (auth.created_at + auth.expires_in) * 1000
        if (expiresAt < Date.now() - 1000 * 60 * 5) {
          await this._refresh()
        }
      }
      const res = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: auth ? `Bearer ${auth.access_token}` : ''
        },
        body: body ? JSON.stringify(body) : undefined
      })

      if (method === 'DELETE') return undefined as T

      const json = await res.json() as object | KitsuError

      if ('error' in json) {
        console.error('Kitsu Error:', (json as { error_description: string }).error_description)
      } else if ('errors' in json) {
        for (const error of (json as { errors: Array<{ detail: string }> }).errors) {
          console.error('Kitsu Error:', error.detail)
        }
      }

      return json as T | KitsuError
    } catch (error) {
      const err = error as Error
      console.error('Kitsu Error:', err.message)
      return {
        error: err.name,
        error_description: err.stack ?? 'An unknown error occurred'
      }
    }
  }

  async _get <T> (target: string, body?: Record<string, unknown>): Promise<T | KitsuError> {
    const url = new URL(target)
    for (const [key, value] of Object.entries(body ?? {})) url.searchParams.append(key, String(value))
    return await this._request<T>(url, 'GET')
  }

  async _delete <T> (url: string): Promise<T | KitsuError> {
    return await this._request<T>(url, 'DELETE')
  }

  async _post <T> (url: string, body?: Record<string, unknown>): Promise<T | KitsuError> {
    return await this._request<T>(url, 'POST', body)
  }

  async _patch <T> (url: string, body?: Record<string, unknown>): Promise<T | KitsuError> {
    return await this._request<T>(url, 'PATCH', body)
  }

  async _refresh () {
    debug('refreshing Kitsu auth token')
    const auth = this._state.auth
    const data = await this._post<OAuth>(
      ENDPOINTS.API_OAUTH,
      {
        grant_type: 'refresh_token',
        refresh_token: auth?.refresh_token
      }
    )

    if ('access_token' in data) {
      this._state.auth = data
      await this._saveState()
    }
  }

  async login (username: string, password: string) {
    debug('logging in to Kitsu with username', username)
    const data = await this._request<OAuth>(
      ENDPOINTS.API_OAUTH,
      'POST',
      {
        grant_type: 'password',
        username,
        password
      }
    )

    if ('access_token' in data) {
      debug('Kitsu login successful, setting auth data')
      this._state.auth = data
      await this._saveState()
      await this._user()
    }
  }

  async logout () {
    await AsyncStorage.removeItem('kitsuState')
    this._state = { auth: undefined, viewer: undefined, userlist: {}, favorites: {} }
  }

  async _user () {
    debug('fetching Kitsu user data')
    const res = await this._get<Res<User>>(
      ENDPOINTS.API_USER_FETCH,
      {
        'filter[self]': true,
        include: 'favorites.item,libraryEntries.anime,libraryEntries.anime.mappings',
        'fields[users]': 'name,about,avatar,coverImage,createdAt',
        'fields[anime]': 'status,episodeCount,mappings',
        'fields[mappings]': 'externalSite,externalId',
        'fields[libraryEntries]': 'anime,progress,status,reconsumeCount,reconsuming,rating'
      }
    )

    if ('error' in res || 'errors' in res || !res.data[0]) return

    const { id, attributes } = res.data[0]

    debug('Kitsu user data fetched, setting viewer data')

    this._state.viewer = {
      id: Number(id),
      name: attributes.name ?? '',
      about: attributes.about ?? '',
      avatar: {
        large: attributes.avatar?.original ?? null
      },
      bannerImage: attributes.coverImage?.original ?? null,
      createdAt: +new Date(attributes.createdAt),
      isFollowing: false,
      isFollower: false,
      donatorBadge: null,
      options: null,
      statistics: null
    }

    await this._saveState()
  }

  async _getKitsuId (alId: number) {
    const kitsuId = this.ALToKitsu[alId.toString()]
    if (kitsuId) return kitsuId
    const res = await mappings(alId)
    if (!res?.kitsu_id) return
    this.ALToKitsu[alId.toString()] = res.kitsu_id.toString()
    return res.kitsu_id.toString()
  }

  async _getAlId (kitsuId: number) {
    const alId = this.kitsuToAL[kitsuId]
    if (alId) return alId
    const res = await mappingsByKitsuId(kitsuId)
    if (!res?.anilist_id) return
    this.kitsuToAL[kitsuId] = res.anilist_id.toString()
    return res.anilist_id.toString()
  }

  hasAuth (): boolean {
    return this._state.viewer !== undefined && !!(this._state.viewer as Record<string, unknown>).id
  }

  id () {
    return (this._state.viewer as Record<string, unknown> | undefined)?.id as number | undefined
  }

  profile (): Record<string, unknown> | undefined {
    return this._state.viewer
  }

  // TODO: implement schedule, toggleFav, deleteEntry, entry, following, followingMany
  // These require integration with the anilist client module

  async toggleFav (_id: number) {
    debug('toggleFav not yet implemented for mobile')
  }

  async deleteEntry (_media: { id: number }) {
    debug('deleteEntry not yet implemented for mobile')
  }

  following (_id: number) {
    return null
  }

  followingMany (_ids: number[]) {
    return null
  }

  async entry (_variables: Record<string, unknown>) {
    debug('entry not yet implemented for mobile')
  }
}()
