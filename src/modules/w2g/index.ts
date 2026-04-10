/**
 * Watch2Gether (W2G) module stub.
 *
 * P2P watch-together is not yet available on mobile.
 */

// TODO: implement for mobile

export interface PlayerState {
  paused: boolean
  time: number
}

export interface MediaState {
  id: number
  title?: string
  episode?: number
}

export interface ChatUser {
  id: number | string
  name: string
  avatar?: { large?: string | null } | null
}

export interface ChatMessage {
  user: ChatUser
  text: string
  timestamp: number
}

/** Generate a random hex code */
export function generateRandomHexCode (len: number): string {
  let hexCode = ''
  while (hexCode.length < len) {
    hexCode += Math.round(Math.random() * 15).toString(16)
  }
  return hexCode
}

/**
 * W2GClient stub.
 *
 * The real implementation uses P2PT for peer-to-peer sync.
 * This stub provides the type shape only.
 */
export class W2GClient {
  player: PlayerState = { paused: true, time: 0 }
  index = 0
  media: MediaState | undefined
  isHost: boolean
  code: string
  destroyed = false
  messages: ChatMessage[] = []

  get inviteLink (): string {
    return `https://hayase.watch/w2g/${this.code}`
  }

  constructor (code: string, isHost: boolean, _media?: MediaState) {
    this.isHost = isHost
    this.code = code
    // TODO: implement for mobile
  }

  destroy (): void {
    this.destroyed = true
    // TODO: implement for mobile
  }
}
