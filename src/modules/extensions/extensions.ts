import Debug from 'debug'

import type { Media } from '../anilist/util'
import type { EpisodesResponse, Titles, Episode } from '../anizip/types'
import type { TorrentResult } from './types'

const debug = Debug('ui:extensions')

// TODO: adapt codec exclusions for React Native
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exclusions: string[] = []

export let fillerEpisodes: Record<number, number[] | undefined> = {}

fetch('https://raw.githubusercontent.com/ThaUnknown/filler-scrape/master/filler.json').then(async res => {
  fillerEpisodes = await res.json()
}).catch(() => {
  debug('failed to fetch filler episodes')
})

export interface SingleEpisode {
  episode: number
  image?: string
  summary?: string
  rating?: string
  runtime?: number
  title?: Titles
  length?: number
  airdate?: string
  airingAt?: Date
  filler: boolean
  anidbEid?: number
  tvdbId?: number
  tvdbShowId?: number
  absoluteEpisodeNumber?: number
}

export function episodeByAirDate (alDate: Date | undefined, episodes: Map<string, Episode & { airdatems?: number }>, episode: number): (Episode & { airdatems?: number }) | undefined {
  if (!alDate || !+alDate) return episodes.get('' + episode)

  const closestEpisodes: Episode[] = [...episodes.values()].reduce<Episode[]>((prev, curr) => {
    if (!prev[0]) return [curr]
    const prevDate = Math.abs(+new Date(prev[0].airdate ?? 0) - +alDate)
    const currDate = Math.abs(+new Date(curr.airdate ?? 0) - +alDate)
    if (prevDate === currDate) {
      prev.push(curr)
      return prev
    }
    if (currDate < prevDate) return [curr]
    return prev
  }, [])

  if (!closestEpisodes.length) return episodes.get('' + episode)

  return closestEpisodes.reduce((prev, curr) => {
    return Math.abs(Number(curr.episode) - episode) < Math.abs(Number(prev.episode) - episode) ? curr : prev
  })
}

export function makeEpisodeList (media: Media, episodesRes?: EpisodesResponse | null): SingleEpisode[] {
  const count = media.episodes ?? episodesRes?.episodeCount ?? 0
  const alSchedule: Record<number, Date | undefined> = {}

  const airingEntries = (media as Record<string, unknown>).aired as { n?: Array<{ a: number; e: number }> | null } | null | undefined
  const notAiredEntries = (media as Record<string, unknown>).notaired as { n?: Array<{ a: number; e: number }> | null } | null | undefined

  for (const item of [...(airingEntries?.n ?? []), ...(notAiredEntries?.n ?? [])]) {
    alSchedule[item.e] = new Date(item.a * 1000)
  }

  const isSingle = count === 1 || media.format === 'MOVIE' || media.format === 'SPECIAL' || media.format === 'MUSIC'
  if (!alSchedule[1] && isSingle && media.startDate) {
    alSchedule[1] = new Date(media.startDate.year ?? 0, (media.startDate.month ?? 1) - 1, media.startDate.day ?? 1)
  }

  const episodeList: SingleEpisode[] = []
  const filtered = new Map<string, Episode & { airdatems?: number }>()
  const now = Date.now()
  for (const [key, value] of Object.entries(episodesRes?.episodes ?? {})) {
    filtered.set(key, { ...value, airdatems: value.airdate ? +new Date(value.airdate) : undefined })
  }

  const hasSpecial = !!episodesRes?.specialCount
  const hasCountMatch = (media.episodes ?? 0) === (episodesRes?.episodeCount ?? 0)
  for (let episode = 1; episode <= count; episode++) {
    const airingAt = alSchedule[episode]

    const hasEpisode = episodesRes?.episodes?.[Number(episode)]
    const needsValidation = !(!hasSpecial || (hasEpisode && hasCountMatch))
    const resolvedEpisode = needsValidation ? episodeByAirDate(airingAt, filtered, episode) : filtered.get('' + episode)

    if (needsValidation && resolvedEpisode) {
      for (const [key, value] of filtered.entries()) {
        if (
          (value.anidbEid != null && value.anidbEid === resolvedEpisode.anidbEid) ||
          (value.airdatems != null && value.airdatems < (resolvedEpisode.airdatems ?? now))
        ) {
          filtered.delete(key)
        }
      }
    }

    const { image, summary, overview, rating, title, length, airdate, anidbEid, runtime, tvdbId, absoluteEpisodeNumber } = (resolvedEpisode ?? {}) as Record<string, unknown>
    const res: SingleEpisode = {
      episode,
      image: image as string | undefined,
      summary: (summary ?? overview) as string | undefined,
      rating: rating as string | undefined,
      title: title as Titles | undefined,
      length: length as number | undefined,
      airdate: airdate as string | undefined,
      airingAt,
      filler: !!fillerEpisodes[media.id]?.includes(episode),
      anidbEid: anidbEid as number | undefined,
      runtime: runtime as number | undefined,
      tvdbId: tvdbId as number | undefined,
      absoluteEpisodeNumber: absoluteEpisodeNumber as number | undefined
    }
    episodeList.push(res)
  }
  return episodeList
}

export const extensions = new class Extensions {
  createTitles (media: Media) {
    const grouped = [...new Set(
      [...Object.values(media.title ?? {}), ...(media.synonyms ?? [])]
        .filter((name): name is string => name != null && (name as string).length > 3)
    )]
    const titles: string[] = []
    const appendTitle = (title: string) => {
      titles.push(title)
      const match1 = title.match(/(\d)(?:nd|rd|th) Season/i)
      const match2 = title.match(/Season (\d)/i)

      if (match2) {
        titles.push(title.replace(/Season \d/i, `S${match2[1]}`))
      } else if (match1) {
        titles.push(title.replace(/(\d)(?:nd|rd|th) Season/i, `S${match1[1]}`))
      }
    }
    for (const t of grouped) {
      appendTitle(t)
      if (t.includes('-')) appendTitle(t.replaceAll('-', ''))
    }
    return titles
  }

  async getResultsFromExtensions (_options: { media: Media; episode: number; resolution: string }): Promise<{ results: TorrentResult[]; errors: Array<{ error: Error; extension: string }> }> {
    // TODO: implement extension loading for React Native (web workers not available)
    debug('getResultsFromExtensions not yet implemented for mobile')
    return { results: [], errors: [] }
  }

  async getNZBResultsFromExtensions (_hash: string): Promise<Array<{ nzb: string; options: Record<string, string> }>> {
    // TODO: implement for React Native
    debug('getNZBResultsFromExtensions not yet implemented for mobile')
    return []
  }

  async updatePeerCounts <T extends TorrentResult[]> (entries: T): Promise<T> {
    debug(`Updating peer counts for ${entries.length} entries`)
    // TODO: implement peer count updates for React Native
    return entries
  }

  dedupe <T extends TorrentResult & { extension: Set<string> }> (entries: T[]): T[] {
    const deduped: Record<string, T> = {}
    for (const entry of entries) {
      if (entry.hash in deduped) {
        const dupe = deduped[entry.hash]!
        for (const ext of entry.extension) dupe.extension.add(ext)
        dupe.accuracy = (['high', 'medium', 'low'].indexOf(entry.accuracy) <= ['high', 'medium', 'low'].indexOf(dupe.accuracy)
          ? entry.accuracy
          : dupe.accuracy)
        dupe.title = entry.title.length > dupe.title.length ? entry.title : dupe.title
        dupe.link ??= entry.link
        dupe.id ??= entry.id
        dupe.seeders ||= entry.seeders >= 30000 ? 0 : entry.seeders
        dupe.leechers ||= entry.leechers >= 30000 ? 0 : entry.leechers
        dupe.downloads ||= entry.downloads
        dupe.size ||= entry.size
        dupe.date ||= entry.date
        dupe.type = (['best', 'alt', 'batch'].indexOf(entry.type ?? 'best') <= ['best', 'alt', 'batch'].indexOf(dupe.type ?? 'best')
          ? entry.type
          : dupe.type) ?? entry.type ?? dupe.type
      } else {
        deduped[entry.hash] = entry
      }
    }
    return Object.values(deduped)
  }
}()
