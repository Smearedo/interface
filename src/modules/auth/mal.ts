import Debug from 'debug'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

import { mappings, mappingsByMalId } from '../anizip'

const debug = Debug('ui:mal')

type ALMediaStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING'

const MAL_TO_AL_STATUS: Record<MALMediaStatus, ALMediaStatus> = {
  watching: 'CURRENT',
  plan_to_watch: 'PLANNING',
  completed: 'COMPLETED',
  dropped: 'DROPPED',
  on_hold: 'PAUSED'
}

const AL_TO_MAL_STATUS: Record<ALMediaStatus, MALMediaStatus> = {
  CURRENT: 'watching',
  PLANNING: 'plan_to_watch',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  PAUSED: 'on_hold',
  REPEATING: 'watching'
}

type MALMediaStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

interface MALOAuth {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
  created_at: number
}

interface MALUser {
  id: number
  name: string
  picture?: string
  gender?: string
  joined_at: string
  anime_statistics?: {
    num_items: number
    num_episodes: number
    num_days: number
  }
}

interface MALListUpdate {
  status: MALMediaStatus
  num_watched_episodes?: number
  score?: number
  num_times_rewatched?: number
  is_rewatching?: boolean
  rewatch_value?: number
}

interface MALStatus {
  status: MALMediaStatus
  score: number
  num_episodes_watched: number
  is_rewatching: boolean
  updated_at: string
  start_date?: string
  finish_date?: string
  num_times_rewatched: number
}

interface MALAnimeListItem {
  node: {
    id: number
    title: string
    main_picture?: {
      medium: string
      large: string
    }
    num_episodes: number
    status: string
    my_list_status: MALStatus
  }
}

const ENDPOINTS = {
  API_BASE: 'https://api.myanimelist.net/v2',
  API_OAUTH: 'https://myanimelist.net/v1/oauth2/token',
  API_AUTHORIZE: 'https://myanimelist.net/v1/oauth2/authorize',
  API_USER: 'https://api.myanimelist.net/v2/users/@me',
  API_ANIME_LIST: 'https://api.myanimelist.net/v2/users/@me/animelist',
  API_ANIME: 'https://api.myanimelist.net/v2/anime'
} as const

interface MALSyncState {
  auth?: MALOAuth
  viewer?: Record<string, unknown>
  userlist: Record<string, unknown>
}

export default new class MALSync {
  malToAL: Record<string, string> = {}
  ALToMal: Record<string, string> = {}

  private _state: MALSyncState = {
    auth: undefined,
    viewer: undefined,
    userlist: {}
  }

  constructor () {
    this._loadState()
  }

  private async _loadState () {
    try {
      const raw = await AsyncStorage.getItem('malState')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<MALSyncState>
        Object.assign(this._state, parsed)
        if (this._state.auth) this._user()
      }
    } catch (e) {
      debug('failed to load MAL state', e)
    }
  }

  private async _saveState () {
    try {
      await AsyncStorage.setItem('malState', JSON.stringify({
        auth: this._state.auth,
        viewer: this._state.viewer
      }))
    } catch (e) {
      debug('failed to save MAL state', e)
    }
  }

  async _request<T = object> (url: string | URL, method: string, body?: URLSearchParams): Promise<T | { error: string }> {
    const auth = this._state.auth
    try {
      if (auth) {
        const expiresAt = (auth.created_at + auth.expires_in) * 1000
        if (expiresAt < Date.now() - 1000 * 60 * 5 && !body?.get('refresh_token')) {
          await this._refresh()
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      if (auth) {
        headers.Authorization = `Bearer ${auth.access_token}`
      }

      // if android append body to the URL
      if (Platform.OS === 'android' && body) {
        if (url instanceof URL) {
          url.search = body.toString()
        } else {
          url += '?' + body.toString()
        }
        body = undefined
      }

      const res = await fetch(url.toString(), {
        method,
        headers,
        body: body?.toString()
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errorText}`)
      }

      if (method === 'DELETE') return undefined as T

      return await res.json() as T
    } catch (error) {
      const err = error as Error
      console.error('MAL Error:', err.message)
      return { error: err.message }
    }
  }

  async _get<T> (target: string, params: Record<string, unknown> = {}): Promise<T | { error: string }> {
    const url = new URL(target)
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, String(value))
    }
    return await this._request<T>(url, 'GET')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async _post <T> (url: string, body?: Record<string, any>): Promise<T | { error: string }> {
    return await this._request<T>(url, 'POST', new URLSearchParams(body))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async _patch<T> (url: string, body: Record<string, any>): Promise<T | { error: string }> {
    return await this._request<T>(url, 'PATCH', new URLSearchParams(body))
  }

  async _delete<T> (url: string): Promise<T | { error: string }> {
    return await this._request<T>(url, 'DELETE')
  }

  async _refresh () {
    debug('Refreshing MAL token')
    const auth = this._state.auth
    if (!auth?.refresh_token) return

    // TODO: get malClientID from settings store
    const clientID = 'd93b624a92e431a9b6dfe7a66c0c5bbb'
    const data = await this._post<MALOAuth>(
      ENDPOINTS.API_OAUTH,
      {
        client_id: clientID,
        grant_type: 'refresh_token',
        refresh_token: auth.refresh_token
      }
    )

    if ('access_token' in data) {
      this._state.auth = {
        ...data,
        created_at: Math.floor(Date.now() / 1000)
      }
      await this._saveState()
    }
  }

  async login () {
    debug('Logging in to MAL')
    // TODO: implement MAL OAuth flow for React Native
    // This requires opening a browser for authorization
    debug('MAL login not yet implemented for mobile')
  }

  async logout () {
    await AsyncStorage.removeItem('malState')
    this._state = { auth: undefined, viewer: undefined, userlist: {} }
  }

  async _user () {
    debug('Fetching MAL user data')
    const res = await this._get<MALUser>(ENDPOINTS.API_USER, {
      fields: 'anime_statistics'
    })

    if ('error' in res) return

    debug('MAL user data fetched successfully', res)

    this._state.viewer = {
      id: res.id,
      name: res.name,
      about: '',
      avatar: {
        large: res.picture ?? null
      },
      bannerImage: null,
      createdAt: +new Date(res.joined_at),
      isFollowing: false,
      isFollower: false,
      donatorBadge: null,
      options: null,
      statistics: {
        anime: {
          count: res.anime_statistics?.num_items ?? 0,
          minutesWatched: (res.anime_statistics?.num_days ?? 0) * 24 * 60,
          episodesWatched: res.anime_statistics?.num_episodes ?? 0,
          genres: null
        }
      }
    }

    await this._saveState()
  }

  _malEntryToAl (item: MALStatus, id: number): Record<string, unknown> {
    return {
      id,
      status: item.is_rewatching ? 'REPEATING' : MAL_TO_AL_STATUS[item.status],
      progress: item.num_episodes_watched,
      score: item.score,
      repeat: item.num_times_rewatched,
      customLists: null
    }
  }

  async _getMalId (alId: number): Promise<string | undefined> {
    const malId = this.ALToMal[alId]
    if (malId) return malId
    const res = await mappings(alId)
    if (!res?.mal_id) return
    this.ALToMal[alId] = res.mal_id.toString()
    return res.mal_id.toString()
  }

  async _getAlId (malId: number): Promise<string | undefined> {
    const alId = this.malToAL[malId]
    if (alId) return alId
    const res = await mappingsByMalId(malId)
    if (!res?.anilist_id) return
    this.malToAL[malId] = res.anilist_id.toString()
    return res.anilist_id.toString()
  }

  hasAuth (): boolean {
    return this._state.viewer !== undefined && !!(this._state.viewer as Record<string, unknown>).id
  }

  id () {
    return (this._state.viewer as Record<string, unknown> | undefined)?.id as number | undefined
  }

  profile (): Record<string, unknown> | undefined {
    debug('Fetching MAL user profile')
    return this._state.viewer
  }

  async toggleFav (_id: number) {
    // MAL doesn't have a public favorites API endpoint
  }

  async deleteEntry (_media: { id: number; idMal?: number | null }) {
    debug('deleteEntry not yet fully implemented for mobile')
  }

  following (_id: number) {
    return null
  }

  async entry (_variables: Record<string, unknown>) {
    debug('entry not yet fully implemented for mobile')
  }
}()
