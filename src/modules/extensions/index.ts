/**
 * Extensions module stub.
 *
 * Extensions are not yet functional on mobile but the types and
 * placeholder exports are needed by other modules.
 */

// TODO: implement for mobile

export interface ExtensionConfig {
  url: string
  name: string
  version: string
  description?: string
  author?: string
  icon?: string
}

export interface SingleEpisode {
  episode: number
  image?: string
  summary?: string
  rating?: string
  runtime?: number
  title?: Record<string, string>
  length?: number
  airdate?: string
  airingAt?: Date
  filler: boolean
  anidbEid?: number
  tvdbId?: number
  tvdbShowId?: number
  absoluteEpisodeNumber?: number
}

export interface TorrentResult {
  title: string
  link: string
  seeders: number
  leechers: number
  size: number
  hash?: string
  verified?: boolean
}

/** Saved extension configs (stub: always empty) */
export const savedConfigs: Record<string, ExtensionConfig> = {}

/** Saved extension options (stub: always empty) */
export const savedOptions: Record<string, { options: Record<string, never>; enabled: boolean }> = {}

/** Filler episode map (stub: always empty) */
export const fillerEpisodes: Record<number, number[] | undefined> = {}

/** Search extensions for torrents (stub: returns empty array) */
export async function searchExtensions (
  _query: string,
  _options?: Record<string, unknown>
): Promise<TorrentResult[]> {
  // TODO: implement for mobile
  return []
}

/** Load a single extension (stub: no-op) */
export async function loadExtension (_url: string): Promise<void> {
  // TODO: implement for mobile
}

/** Remove an extension (stub: no-op) */
export async function removeExtension (_url: string): Promise<void> {
  // TODO: implement for mobile
}
