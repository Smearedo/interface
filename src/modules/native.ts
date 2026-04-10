/**
 * Native bridge stub for React Native / Expo.
 *
 * The head app uses a `native` module that talks to an Electron/Tauri backend.
 * On mobile we stub most of these and use React Native APIs where possible.
 */
import { Linking, Share, Platform } from 'react-native'

// TODO: implement for mobile – most of these are desktop-only features

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

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
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

const native = {
  /** Open a URL in the system browser */
  openURL: async (url: string): Promise<void> => {
    await Linking.openURL(url)
  },

  /** Share content using native share sheet */
  share: async (data: { title?: string; text?: string; url?: string }): Promise<void> => {
    await Share.share({
      title: data.title,
      message: data.text ?? data.url ?? ''
    })
  },

  /** Whether we are running inside a desktop app */
  isApp: false as const,

  /** Platform identifier */
  platform: Platform.OS,

  // --- Auth stubs (handled through AuthSession/WebBrowser on mobile) ---
  authAL: async (_url: string): Promise<AuthResponse> => {
    // TODO: implement for mobile using expo-auth-session
    throw new Error('AniList auth not yet implemented for mobile')
  },

  authMAL: async (_url: string): Promise<{ code: string; state: string }> => {
    // TODO: implement for mobile using expo-auth-session
    throw new Error('MAL auth not yet implemented for mobile')
  },

  // --- Desktop window stubs ---
  restart: async (): Promise<void> => { /* no-op on mobile */ },
  minimise: async (): Promise<void> => { /* no-op */ },
  maximise: async (): Promise<void> => { /* no-op */ },
  focus: async (): Promise<void> => { /* no-op */ },
  close: async (): Promise<void> => { /* no-op */ },

  // --- Torrent stubs ---
  playTorrent: async (): Promise<TorrentFile[]> => [],
  rescanTorrents: async (): Promise<void> => { /* no-op */ },
  deleteTorrents: async (): Promise<void> => { /* no-op */ },
  library: async (): Promise<unknown[]> => [],
  torrentInfo: async (): Promise<TorrentInfo> => ({
    name: '', progress: 0,
    size: { total: 0, downloaded: 0, uploaded: 0 },
    speed: { down: 0, up: 0 },
    time: { remaining: 0, elapsed: 0 },
    peers: { seeders: 0, leechers: 0, wires: 0 },
    pieces: { total: 0, size: 0 },
    hash: ''
  }),
  fileInfo: async (): Promise<unknown[]> => [],
  peerInfo: async (): Promise<unknown[]> => [],
  protocolStatus: async (): Promise<ProtocolStatus> => ({
    dht: false, lsd: false, pex: false, nat: false,
    forwarding: false, persisting: false, streaming: false
  }),

  // --- Player stubs ---
  selectPlayer: async (): Promise<string> => 'default',
  spawnPlayer: async (): Promise<void> => { /* no-op */ },
  tracks: async (): Promise<unknown[]> => [],
  subtitles: async (): Promise<void> => { /* no-op */ },
  chapters: async (): Promise<unknown[]> => [],
  attachments: async (): Promise<unknown[]> => [],

  // --- Media session stubs ---
  setMediaSession: async (): Promise<void> => { /* no-op */ },
  setPositionState: async (): Promise<void> => { /* no-op */ },
  setPlayBackState: async (): Promise<void> => { /* no-op */ },
  setActionHandler: async (): Promise<void> => { /* no-op */ },

  // --- Update stubs ---
  checkUpdate: async (): Promise<void> => { /* no-op */ },
  updateAndRestart: async (): Promise<void> => { /* no-op */ },
  updateReady: async (): Promise<void> => { /* no-op */ },
  version: async (): Promise<string> => '0.0.0-mobile',

  // --- Misc stubs ---
  selectDownload: async (): Promise<string> => '',
  setAngle: async (): Promise<void> => { /* no-op */ },
  getLogs: async (): Promise<string> => '',
  getDeviceInfo: async (): Promise<Record<string, unknown>> => ({}),
  openUIDevtools: async (): Promise<void> => { /* no-op */ },
  openTorrentDevtools: async (): Promise<void> => { /* no-op */ },
  toggleDiscordDetails: async (): Promise<void> => { /* no-op */ },
  downloadProgress: async (): Promise<void> => { /* no-op */ },
  updateProgress: async (): Promise<void> => { /* no-op */ },
  updateSettings: async (): Promise<void> => { /* no-op */ },
  setDOH: async (): Promise<void> => { /* no-op */ },
  cachedTorrents: async (): Promise<unknown[]> => [],
  setHideToTray: async (): Promise<void> => { /* no-op */ },
  setExperimentalGPU: async (): Promise<void> => { /* no-op */ },
  transparency: async (): Promise<void> => { /* no-op */ },
  setZoom: async (): Promise<void> => { /* no-op */ },
  navigate: async (): Promise<void> => { /* no-op */ },
  createNZB: async (): Promise<void> => { /* no-op */ },
  getDisplays: async (): Promise<void> => { /* no-op */ },
  castPlay: async (): Promise<void> => { /* no-op */ },
  castClose: async (): Promise<void> => { /* no-op */ },
  enableCORS: async (): Promise<void> => { /* no-op */ },
  checkAvailableSpace: async (): Promise<number> => 0,
  checkIncomingConnections: async (): Promise<boolean> => false,
  updatePeerCounts: async (): Promise<unknown[]> => [],
  defaultTransparency: (): boolean => false,
  errors: async (): Promise<void> => { /* no-op */ },
  debug: async (): Promise<void> => { /* no-op */ },
  profile: async (): Promise<void> => { /* no-op */ },
  unsafeUseInternalALAPI: async (): Promise<void> => { /* no-op */ },
  updateToNewEndpoint: async (): Promise<void> => { /* no-op */ }
}

export default native
