/**
 * Torrent client module stub.
 *
 * Torrent streaming is not yet available on mobile.
 */

// TODO: implement for mobile

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

export interface ProtocolStatus {
  dht: boolean
  lsd: boolean
  pex: boolean
  nat: boolean
  forwarding: boolean
  persisting: boolean
  streaming: boolean
}

export interface PeerInfo {
  ip: string
  seeder: boolean
  client: string
  progress: number
  size: { downloaded: number; uploaded: number }
  speed: { down: number; up: number }
  time: number
  flags: readonly string[]
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
 * Stub torrent server client.
 */
export const server = {
  /** Last played torrent info */
  last: null as { media: unknown; id: string; episode: number } | null,

  /** Current torrent stats */
  stats: defaultTorrentInfo,

  /** Protocol status */
  protocol: defaultProtocolStatus,

  /** Play a torrent (stub: no-op) */
  async play (
    _id: string,
    _media: unknown,
    _episode: number
  ): Promise<TorrentFile[]> {
    // TODO: implement for mobile
    return []
  },

  /** Stop/delete current torrent (stub: no-op) */
  async stop (): Promise<void> {
    // TODO: implement for mobile
  },

  /** Get library of cached torrents (stub: returns empty) */
  async library (): Promise<unknown[]> {
    // TODO: implement for mobile
    return []
  }
}
