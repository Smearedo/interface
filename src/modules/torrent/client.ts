import Debug from 'debug'

import type { Media } from '../anilist/util'

const debug = Debug('ui:torrent-client')

export interface TorrentInfo {
  name: string
  progress: number
  size: { total: number; downloaded: number; uploaded: number }
  speed: { down: number; up: number }
  time: { remaining: number; elapsed: number }
  peers: { seeders: number; leechers: number; wires: number }
  pieces: { total: number; size: number }
  hash: string
}

export interface TorrentFile {
  name: string
  hash: string
  type: string
  size: number
  path: string
  url: string
  lan?: string
  id: number
}

export interface ProtocolStatus {
  dht: boolean
  lsd: boolean
  pex: boolean
  nat: boolean
  forwarding: boolean
  persisting: boolean
  streaming: boolean
}

const defaultTorrentInfo: TorrentInfo = {
  name: '',
  progress: 0,
  size: { total: 0, downloaded: 0, uploaded: 0 },
  speed: { down: 0, up: 0 },
  time: { remaining: 0, elapsed: 0 },
  peers: { seeders: 0, leechers: 0, wires: 0 },
  pieces: { total: 0, size: 0 },
  hash: ''
}

const defaultProtocolStatus: ProtocolStatus = {
  dht: false, lsd: false, pex: false, nat: false,
  forwarding: false, persisting: false, streaming: false
}

/**
 * Stub torrent server client for React Native.
 *
 * The head app uses a native torrent client. This stub provides the same
 * interface shape but is non-functional on mobile.
 *
 * TODO: implement torrent streaming for React Native
 */
export const server = new class ServerClient {
  last: { media: Media; id: string; episode: number } | null = null
  stats: TorrentInfo = defaultTorrentInfo
  protocol: ProtocolStatus = defaultProtocolStatus

  constructor () {
    debug('torrent client stub initialized')
  }

  async play (id: string, media: Media, episode: number): Promise<TorrentFile[]> {
    debug('play called (stub)', id, media.id, episode)
    // TODO: implement for mobile
    return []
  }

  async playFile (_id: ArrayBufferView, _media: Media, _episode: number): Promise<undefined> {
    debug('playFile called (stub)')
    // TODO: implement for mobile
    return undefined
  }

  async updateLibrary () {
    debug('updateLibrary called (stub)')
    // TODO: implement for mobile
  }

  async cachedSet (): Promise<Set<string>> {
    debug('fetching cached torrents (stub)')
    return new Set()
  }
}()
