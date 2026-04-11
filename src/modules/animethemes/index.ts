import Debug from 'debug'

import type { AnimeThemesResponse } from './types'

const debug = Debug('ui:animethemes')

async function safefetch<T> (_fetch: typeof fetch, url: string): Promise<T | null> {
  try {
    const res = await _fetch(url)
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function themes (id: number, _fetch = fetch) {
  debug('fetching themes for id', id)
  return safefetch<AnimeThemesResponse>(_fetch, `https://api.animethemes.moe/anime/?fields[audio]=id,basename,link,size&fields[video]=id,basename,link,tags&filter[external_id]=${id}&filter[has]=resources&filter[site]=AniList&include=animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists`)
}
