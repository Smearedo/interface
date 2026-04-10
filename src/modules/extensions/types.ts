/* eslint-disable @typescript-eslint/no-explicit-any */
export type Accuracy = 'high' | 'medium' | 'low'

type CountryCodes = 'ALL' | 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AQ' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BV' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GS' | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HM' | 'HN' | 'HR' | 'HT'

export type SearchOptions = Record<string, {
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  values?: any[]
  default: any
}>

export interface ExtensionConfig {
  name: string
  version: string
  description: string
  id: string
  type: 'torrent' | 'nzb' | 'url'
  accuracy: Accuracy
  ratio?: 'perma' | number
  icon: string
  media: 'sub' | 'dub' | 'both'
  url?: string
  languages: CountryCodes[]
  update?: string
  code: string
  options?: SearchOptions
}

export interface TorrentResult {
  title: string
  link: string
  id?: number
  seeders: number
  leechers: number
  downloads: number
  accuracy: Accuracy
  hash: string
  size: number
  date: Date
  type?: 'batch' | 'best' | 'alt'
}

export interface TorrentQuery {
  media: any
  anilistId: number
  anidbAid?: number
  anidbEid?: number
  tvdbId?: number
  tvdbEId?: number
  imdbId?: string
  tmdbId?: string
  titles: string[]
  episode: number
  episodeCount?: number
  absoluteEpisodeNumber?: number
  resolution: '2160' | '1080' | '720' | '540' | '480' | ''
  exclusions: string[]
  type?: 'sub' | 'dub'
}

export type TorrentQueryWithFetch = TorrentQuery & { fetch: typeof fetch }

export type SearchFunction = (query: TorrentQueryWithFetch, options?: SearchOptions) => Promise<TorrentResult[]>
export type NZBorURLFunction = (hash: string, options?: SearchOptions) => Promise<string>

export class TorrentSource {
  test!: () => Promise<boolean>
  single!: SearchFunction
  batch!: SearchFunction
  movie!: SearchFunction
}

export class NZBorURLSource {
  test!: () => Promise<boolean>
  query!: (hash: string, options?: SearchOptions, fetcher?: typeof fetch) => Promise<string>
}
