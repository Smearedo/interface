import { Client, fetchExchange, cacheExchange } from '@urql/core'
import Bottleneck from 'bottleneck'
import { useAuthStore } from '@/stores/auth'

const ANILIST_ENDPOINT = 'https://graphql.anilist.co'

const limiter = new Bottleneck({
  reservoir: 90,
  reservoirRefreshAmount: 90,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 10
})

function createAnilistClient (): Client {
  return new Client({
    url: ANILIST_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
      const token = useAuthStore.getState().anilistToken
      const headers: Record<string, string> = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      return { headers }
    }
  })
}

export const anilistClient = createAnilistClient()

export async function anilistQuery<T> (query: string, variables?: Record<string, unknown>): Promise<T> {
  return limiter.schedule(async () => {
    const result = await anilistClient.query(query, variables).toPromise()
    if (result.error) throw result.error
    return result.data as T
  })
}

export async function anilistMutation<T> (mutation: string, variables?: Record<string, unknown>): Promise<T> {
  return limiter.schedule(async () => {
    const result = await anilistClient.mutation(mutation, variables).toPromise()
    if (result.error) throw result.error
    return result.data as T
  })
}

// Search query
const SEARCH_QUERY = `
query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort], $season: MediaSeason, $seasonYear: Int, $genre: [String], $ids: [Int], $status: [MediaStatus], $statusNot: [MediaStatus], $onList: Boolean, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage, total }
    media(search: $search, sort: $sort, season: $season, seasonYear: $seasonYear, genre_in: $genre, id_in: $ids, status_in: $status, status_not_in: $statusNot, onList: $onList, type: ANIME, isAdult: $isAdult) {
      id, idMal, title { romaji, english, native, userPreferred },
      coverImage { extraLarge, medium, color },
      bannerImage, format, status, episodes, season, seasonYear,
      averageScore, genres, isFavourite, isAdult, description(asHtml: false),
      nextAiringEpisode { id, timeUntilAiring, episode },
      mediaListEntry { id, status, progress, score(format: POINT_10) },
      trailer { id, site }
    }
  }
}
`

export interface SearchVariables {
  page?: number
  perPage?: number
  search?: string
  sort?: string[]
  season?: string
  seasonYear?: number
  genre?: string[]
  ids?: number[]
  status?: string[]
  statusNot?: string[]
  onList?: boolean
  isAdult?: boolean | null
}

export interface SearchResult {
  Page: {
    pageInfo: { hasNextPage: boolean; total: number }
    media: Array<import('./util').Media>
  }
}

export async function searchAnime (variables: SearchVariables): Promise<SearchResult> {
  return anilistQuery<SearchResult>(SEARCH_QUERY, {
    page: 1,
    perPage: 20,
    ...variables
  })
}

// Single media query
const MEDIA_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id, idMal, title { romaji, english, native, userPreferred },
    description(asHtml: false), season, seasonYear, format, status, episodes,
    duration, averageScore, genres, isFavourite, isAdult,
    coverImage { extraLarge, medium, color },
    bannerImage, synonyms, source, countryOfOrigin,
    nextAiringEpisode { id, timeUntilAiring, episode },
    startDate { year, month, day }, endDate { year, month, day },
    trailer { id, site },
    relations { edges { relationType(version: 2), node { id, title { userPreferred }, coverImage { extraLarge }, format, status, episodes, type } } },
    mediaListEntry { id, status, progress, repeat, score(format: POINT_10) }
  }
}
`

export async function getMedia (id: number): Promise<{ Media: import('./util').Media }> {
  return anilistQuery<{ Media: import('./util').Media }>(MEDIA_QUERY, { id })
}

// Toggle favourite mutation
const TOGGLE_FAV_MUTATION = `
mutation ($id: Int) {
  ToggleFavourite(animeId: $id) { anime { nodes { id } } }
}
`

export async function toggleFavourite (id: number): Promise<void> {
  await anilistMutation(TOGGLE_FAV_MUTATION, { id })
}

// Save media list entry
const SAVE_ENTRY_MUTATION = `
mutation ($id: Int, $status: MediaListStatus, $progress: Int, $repeat: Int, $score: Float) {
  SaveMediaListEntry(mediaId: $id, status: $status, progress: $progress, repeat: $repeat, score: $score) {
    id, status, progress, repeat, score(format: POINT_10)
  }
}
`

export async function saveEntry (variables: { id: number; status?: string; progress?: number; repeat?: number; score?: number }): Promise<void> {
  await anilistMutation(SAVE_ENTRY_MUTATION, variables)
}

// Delete media list entry
const DELETE_ENTRY_MUTATION = `
mutation ($id: Int) {
  DeleteMediaListEntry(id: $id) { deleted }
}
`

export async function deleteEntry (entryId: number): Promise<void> {
  await anilistMutation(DELETE_ENTRY_MUTATION, { id: entryId })
}

// Viewer query
const VIEWER_QUERY = `
query {
  Viewer {
    id, name, avatar { large, medium },
    bannerImage, about, statistics { anime { count, meanScore, minutesWatched, episodesWatched } },
    options { profileColor }
  }
}
`

export async function getViewer (): Promise<Record<string, unknown>> {
  return anilistQuery<Record<string, unknown>>(VIEWER_QUERY)
}

// Schedule query
const SCHEDULE_QUERY = `
query ($page: Int, $perPage: Int, $airingAt_greater: Int, $airingAt_lesser: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage }
    airingSchedules(airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, sort: TIME) {
      id, episode, airingAt, timeUntilAiring,
      media {
        id, title { userPreferred }, coverImage { extraLarge, medium },
        format, episodes, bannerImage,
        mediaListEntry { id, status, progress }
      }
    }
  }
}
`

export async function getSchedule (startTime: number, endTime: number, page = 1): Promise<unknown> {
  return anilistQuery(SCHEDULE_QUERY, {
    page,
    perPage: 50,
    airingAt_greater: Math.floor(startTime / 1000),
    airingAt_lesser: Math.floor(endTime / 1000)
  })
}
