/**
 * AniZip module – episode metadata from api.ani.zip
 */

// --- Types (mirrored from head types.d.ts) ---

export interface Image {
  coverType?: 'Banner' | 'Poster' | 'Fanart' | 'Clearlogo'
  url?: string
}

export interface Mappings {
  animeplanet_id?: string
  kitsu_id?: number
  mal_id?: number
  type?: string
  anilist_id?: number
  anisearch_id?: number
  anidb_id?: number
  notifymoe_id?: string
  livechart_id?: number
  thetvdb_id?: number
  imdb_id?: string
  themoviedb_id?: string
}

export type Languages =
  | 'x-jat' | 'ru' | 'ar' | 'nl' | 'lt' | 'tr' | 'uk' | 'fa'
  | 'ja' | 'zh' | 'en' | 'de' | 'fr' | 'it' | 'es' | 'ko'
  | 'pl' | 'pt' | 'pt-BR' | 'es-CA' | 'cs' | 'fi' | 'he'
  | 'hu' | 'ro' | 'bg' | 'zh-Hant' | 'zh-Hans' | 'es-419'

export type Titles = Partial<Record<Languages, string>>

export interface Episode {
  tvdbShowId?: number
  tvdbId?: number
  seasonNumber?: number
  episodeNumber?: number
  absoluteEpisodeNumber?: number
  title?: Titles
  airDate?: string
  airDateUtc?: string
  runtime?: number
  overview?: string
  image?: string
  episode: string
  anidbEid?: number
  length?: number
  airdate?: string
  rating?: string
  summary?: string
  finaleType?: string
}

export type Episodes = Record<string | number, Episode>

export interface EpisodesResponse {
  titles?: Titles
  episodes?: Episodes
  episodeCount?: number
  specialCount?: number
  images?: Image[]
  mappings?: Mappings
}

export type MappingsResponse = Mappings

// --- Helpers ---

async function safefetch<T> (url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    return (await res.json()) as T
  } catch {
    return null
  }
}

// Simple in-memory cache for episode lookups
let lastEpisodes = { id: 0, data: null as Promise<EpisodesResponse | null> | null }

/** Fetch episodes with a simple single-entry cache */
export async function episodesCached (id: number): Promise<EpisodesResponse | null> {
  if (lastEpisodes.id === id && lastEpisodes.data) {
    return lastEpisodes.data
  }
  const data = safefetch<EpisodesResponse>(`https://hayase.ani.zip/v1/episodes?anilist_id=${id}`)
  lastEpisodes = { id, data }
  return data
}

/** Fetch episodes (no cache) */
export async function episodes (id: number): Promise<EpisodesResponse | null> {
  return safefetch<EpisodesResponse>(`https://hayase.ani.zip/v1/episodes?anilist_id=${id}`)
}

/** Fetch mappings by AniList id */
export async function mappings (id: number): Promise<MappingsResponse | null> {
  return safefetch<MappingsResponse>(`https://hayase.ani.zip/v1/mappings?anilist_id=${id}`)
}

/** Fetch mappings by Kitsu id */
export async function mappingsByKitsuId (kitsuId: number): Promise<MappingsResponse | null> {
  return safefetch<MappingsResponse>(`https://hayase.ani.zip/v1/mappings?kitsu_id=${kitsuId}`)
}

/** Fetch mappings by MAL id */
export async function mappingsByMalId (malId: number): Promise<MappingsResponse | null> {
  return safefetch<MappingsResponse>(`https://hayase.ani.zip/v1/mappings?mal_id=${malId}`)
}
