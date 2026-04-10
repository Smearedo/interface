/**
 * IRC chat module stub for React Native.
 *
 * The head app uses @thaunknown/web-irc for IRC communication.
 * This is not available in React Native.
 *
 * TODO: implement IRC client for React Native
 */

export const prevAgreed = { value: false }

export type UserType = 'al' | 'guest'

export interface IRCChatUser {
  nick: string
  id: string
  pfpid: string
  type: UserType
}

export function getPFP (user: Pick<IRCChatUser, 'id' | 'pfpid' | 'type'>) {
  if (user.type === 'al') {
    return `https://s4.anilist.co/file/anilistcdn/user/avatar/medium/b${user.id}-${user.pfpid}`
  } else {
    return 'https://s4.anilist.co/file/anilistcdn/user/avatar/medium/default.png'
  }
}

export interface IRCUser { nick: string, ident: string, hostname: string, modes: string[], tags: object }

export interface PrivMessage {
  from_server: boolean
  nick: string
  ident: string
  hostname: string
  target: string
  message: string
  outgoing?: boolean
  tags: {
    msgid: string
    time: string
  }
  time: number
}

export interface ChatUser {
  id: string
  avatar: { large: string }
  name: string
  mediaListOptions: null
}

export interface ChatMessage {
  message: string
  user: ChatUser
  type: 'incoming' | 'outgoing'
  date: Date
}

/**
 * MessageClient stub for React Native.
 *
 * The head app connects to IRC via WebSocket.
 * This stub provides the interface shape only.
 */
export default class MessageClient {
  users: Record<string, ChatUser> = {}
  messages: ChatMessage[] = []
  ident: IRCChatUser

  constructor (ident: IRCChatUser) {
    this.ident = ident
  }

  async say (_message: string) {
    // TODO: implement IRC messaging for React Native
  }

  static async new (ident: IRCChatUser): Promise<MessageClient> {
    // TODO: implement IRC connection for React Native
    return new MessageClient(ident)
  }

  destroy () {
    // TODO: implement cleanup for React Native
  }
}
