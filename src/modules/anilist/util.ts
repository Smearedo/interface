export type Media = {
  id: number
  idMal?: number | null
  title?: {
    romaji?: string | null
    english?: string | null
    native?: string | null
    userPreferred?: string | null
  } | null
  description?: string | null
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' | null
  seasonYear?: number | null
  format?: 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT' | null
  status?: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS' | null
  episodes?: number | null
  duration?: number | null
  averageScore?: number | null
  genres?: string[] | null
  isFavourite?: boolean
  coverImage?: {
    extraLarge?: string | null
    medium?: string | null
    color?: string | null
  } | null
  source?: string | null
  countryOfOrigin?: string | null
  isAdult?: boolean
  bannerImage?: string | null
  synonyms?: string[] | null
  nextAiringEpisode?: {
    id: number
    timeUntilAiring: number
    episode: number
  } | null
  startDate?: { year?: number | null; month?: number | null; day?: number | null } | null
  endDate?: { year?: number | null; month?: number | null; day?: number | null } | null
  trailer?: { id?: string | null; site?: string | null } | null
  relations?: {
    edges?: Array<{
      relationType?: string | null
      node?: Media | null
    }> | null
  } | null
  mediaListEntry?: {
    id?: number
    status?: string | null
    progress?: number | null
    repeat?: number | null
    score?: number | null
    customLists?: unknown
  } | null
  aired?: { n?: Array<{ a: number; e: number }> | null } | null
  notaired?: { n?: Array<{ a: number; e: number }> | null } | null
  type?: string | null
}

export type MediaEdge = {
  relationType?: string | null
  node?: Media | null
}

export function banner (media: Pick<Media, 'trailer' | 'bannerImage' | 'coverImage'>): string | undefined {
  if (media.bannerImage) return media.bannerImage
  if (media.trailer?.id) return `https://i.ytimg.com/vi/${media.trailer.id}/maxresdefault.jpg`
  return media.coverImage?.extraLarge ?? undefined
}

export const STATUS_LABELS: Record<string, string> = {
  CURRENT: 'Watching',
  PLANNING: 'Plan to Watch',
  COMPLETED: 'Completed',
  PAUSED: 'Paused',
  DROPPED: 'Dropped',
  REPEATING: 'Re-Watching'
}

export function cover (media: Pick<Media, 'trailer' | 'bannerImage' | 'coverImage'>): string | undefined {
  return media.coverImage?.extraLarge ?? banner(media)
}

export function coverMedium (media: Pick<Media, 'trailer' | 'bannerImage' | 'coverImage'>): string | undefined {
  return media.coverImage?.medium?.replace('/small/', '/medium/') ?? banner(media)
}

export function coverSmall (media: Pick<Media, 'trailer' | 'bannerImage' | 'coverImage'>): string | undefined {
  return media.coverImage?.medium ?? banner(media)
}

export function title (media: Pick<Media, 'title'>): string {
  return media.title?.userPreferred ?? 'TBA'
}

const STATUS_MAP: Record<string, string> = {
  RELEASING: 'Releasing',
  NOT_YET_RELEASED: 'Not Yet Released',
  FINISHED: 'Finished',
  CANCELLED: 'Cancelled',
  HIATUS: 'Hiatus'
}

export function status (media: Pick<Media, 'status'>): string {
  if (media.status != null) return STATUS_MAP[media.status] ?? 'N/A'
  return 'N/A'
}

const RELATION_MAP: Record<string, string> = {
  ADAPTATION: 'Adaptation',
  PREQUEL: 'Prequel',
  SEQUEL: 'Sequel',
  PARENT: 'Parent',
  SIDE_STORY: 'Side Story',
  CHARACTER: 'Character',
  SUMMARY: 'Summary',
  ALTERNATIVE: 'Alternative',
  SPIN_OFF: 'Spin Off',
  OTHER: 'Other',
  SOURCE: 'Source',
  COMPILATION: 'Compilation',
  CONTAINS: 'Contains'
}

export function relation (rel: string | null): string {
  if (!rel) return 'N/A'
  return RELATION_MAP[rel] ?? 'N/A'
}

const FORMAT_MAP: Record<string, string> = {
  TV: 'TV Series',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
  MANGA: 'Manga',
  NOVEL: 'Novel',
  ONE_SHOT: 'One Shot'
}

export function format (media: Pick<Media, 'format'>): string {
  if (media.format != null) return FORMAT_MAP[media.format] ?? 'N/A'
  return 'N/A'
}

export function episodes (media: Pick<Media, 'aired' | 'notaired' | 'episodes' | 'mediaListEntry' | 'id'>): number {
  if (media.episodes) return media.episodes
  const upcoming = media.aired?.n?.[media.aired.n.length - 1]?.e ?? 0
  const past = media.notaired?.n?.[media.notaired.n.length - 1]?.e ?? 0
  const progress = media.mediaListEntry?.progress ?? 0
  return Math.max(upcoming, past, progress)
}

export function season (media: Pick<Media, 'season' | 'seasonYear' | 'startDate'>): string {
  return [media.season?.toLowerCase() ?? (media.startDate?.month && getSeasonForMonth(media.startDate.month).toLowerCase()), media.seasonYear ?? media.startDate?.year].filter(s => s).join(' ')
}

export function duration (media: Pick<Media, 'duration'>): string | undefined {
  if (!media.duration) return
  return `${media.duration} Minute${media.duration > 1 ? 's' : ''}`
}

export function desc (media: Pick<Media, 'description'>): string {
  return notes(media.description?.replace(/<[^>]+>/g, '').replace(/\n+/g, '\n') ?? 'No description available.')
}

export function notes (string: string): string {
  return string.replace(/\n?\(?Source: [^)]+\)?\n?/m, '').replace(/\n?Notes?:[ |\n][^\n]+\n?/m, '')
}

export function isMovie (media: Pick<Media, 'format' | 'title' | 'synonyms' | 'duration' | 'episodes'>): boolean {
  if (media.format === 'MOVIE') return true
  if ([...Object.values(media.title ?? {}), ...media.synonyms ?? []].some(t => typeof t === 'string' && t.toLowerCase().includes('movie'))) return true
  return (media.duration ?? 0) > 80 && media.episodes === 1
}

export function isSingleEpisode (media: Pick<Media, 'format' | 'title' | 'synonyms' | 'duration' | 'episodes'>): boolean {
  return media.episodes === 1 || (isMovie(media) && !media.episodes)
}

function getSeasonForMonth (month: number): 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' {
  return (['WINTER', 'SPRING', 'SUMMER', 'FALL'] as const)[Math.floor((month / 12) * 4) % 4]
}

const date = new Date()
const month = date.getMonth()
export const currentSeason = getSeasonForMonth(month)
export const currentYear = date.getFullYear()
export const nextSeason = getSeasonForMonth(month + 3)
export const nextYear = currentYear + (nextSeason === 'WINTER' ? 1 : 0)
export const lastSeason = getSeasonForMonth(month - 3)
export const lastYear = currentYear - (lastSeason === 'FALL' ? 1 : 0)

export function getBGColorForRating (rating: number): string {
  if (rating >= 75) return 'bg-green-700'
  if (rating >= 65) return 'bg-orange-400'
  return 'bg-red-400'
}

export function getTextColorForRating (rating: number): string {
  if (rating >= 75) return 'text-green-700'
  if (rating >= 65) return 'text-orange-400'
  return 'text-red-500'
}
