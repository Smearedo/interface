import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function toTS (d: number): string {
  d = Math.round(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor(d % 60)

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
  return `${m}:${pad(s)}`
}

export function fastPrettyBytes (num: number): string {
  if (isNaN(num)) return '0 B'
  if (num < 1) return num + ' B'
  const units = [' B', ' kB', ' MB', ' GB', ' TB']
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  return Number((num / Math.pow(1000, exponent)).toFixed(1)) + units[exponent]!
}

export function fastPrettyBits (num: number): string {
  if (isNaN(num)) return '0 b'
  if (num < 1) return num + ' b'
  const units = [' b', ' kb', ' Mb', ' Gb', ' Tb']
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  return Number((num / Math.pow(1000, exponent)).toFixed(1)) + units[exponent]!
}

export function toTimeString (ms: number): string {
  const s = Math.floor(ms / 1000) % 60
  const m = Math.floor(ms / 60000) % 60
  const h = Math.floor(ms / 3600000) % 24
  const d = Math.floor(ms / 86400000)

  if (d) return `${d}d ${h}h`
  if (h) return `${h}h ${m}m`
  if (m) return `${m}m ${s}s`
  return `${s}s`
}

export class HashMap<K, V> {
  private map = new Map<string, V>()

  constructor (private keyFn: (key: K) => string) {}

  get (key: K): V | undefined {
    return this.map.get(this.keyFn(key))
  }

  set (key: K, value: V): void {
    this.map.set(this.keyFn(key), value)
  }

  has (key: K): boolean {
    return this.map.has(this.keyFn(key))
  }

  delete (key: K): boolean {
    return this.map.delete(this.keyFn(key))
  }

  clear (): void {
    this.map.clear()
  }

  get size (): number {
    return this.map.size
  }

  values (): IterableIterator<V> {
    return this.map.values()
  }

  [Symbol.iterator] (): IterableIterator<V> {
    return this.values()
  }
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, waitFor)
  }
}

let relativeFormatter: Intl.RelativeTimeFormat | null = null
try {
  relativeFormatter = new Intl.RelativeTimeFormat('en')
} catch {
  // Fallback for environments without Intl.RelativeTimeFormat
}

const sinceRanges: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  years: 3600 * 24 * 365,
  months: 3600 * 24 * 30,
  weeks: 3600 * 24 * 7,
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  seconds: 1
}

export function since (date: Date): string {
  const secondsElapsed = (date.getTime() - Date.now()) / 1000
  for (const _key in sinceRanges) {
    const key = _key as Intl.RelativeTimeFormatUnit
    if ((sinceRanges[key] ?? 0) < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / (sinceRanges[key] ?? 0)
      if (relativeFormatter) {
        return relativeFormatter.format(Math.round(delta), key)
      }
      const abs = Math.abs(Math.round(delta))
      return `${abs} ${key} ago`
    }
  }
  return 'now'
}

export function eta (seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0s'

  const units = [
    { label: 'y', secs: 31536000 },
    { label: 'mo', secs: 2592000 },
    { label: 'd', secs: 86400 },
    { label: 'h', secs: 3600 },
    { label: 'm', secs: 60 },
    { label: 's', secs: 1 }
  ]

  let remaining = Math.floor(seconds)
  const parts: string[] = []

  for (const { label, secs } of units) {
    if (remaining >= secs) {
      const value = Math.floor(remaining / secs)
      parts.push(`${value}${label}`)
      remaining %= secs
      if (parts.length === 2) break
    }
  }

  return parts.length ? parts.join(' ') : '0s'
}

export interface TraceAnime {
  anilist: number
  filename: string
  episode: number
  from: number
  to: number
  similarity: number
  video: string
  image: string
}

export async function traceAnime (imageUrl: string): Promise<TraceAnime[]> {
  const res = await fetch(`https://api.trace.moe/search?cutBorders&url=${imageUrl}`)
  const { result } = (await res.json()) as { result: TraceAnime[] }

  if (result.length) {
    return result
  }
  throw new Error("Search Failed\nCouldn't find anime for specified image!")
}

export function codeToEmoji (c: string): string {
  if (c === 'ALL') return '🌎'
  return c.replace(/./g, (ch) => String.fromCodePoint(0x1f1a5 + ch.charCodeAt(0)))
}

export const subtitleExtensions = ['srt', 'vtt', 'ass', 'ssa', 'sub', 'txt']
export const subRx = new RegExp(`.(${subtitleExtensions.join('|')})$`, 'i')

export const videoExtensions = ['3g2', '3gp', 'asf', 'avi', 'dv', 'flv', 'gxf', 'm2ts', 'm4a', 'm4b', 'm4p', 'm4r', 'm4v', 'mkv', 'mov', 'mp4', 'mpd', 'mpeg', 'mpg', 'mxf', 'nut', 'ogm', 'ogv', 'swf', 'ts', 'vob', 'webm', 'wmv', 'wtv']
export const videoRx = new RegExp(`.(${videoExtensions.join('|')})$`, 'i')

export const fontExtensions = ['ttf', 'ttc', 'woff', 'woff2', 'otf', 'cff', 'otc', 'pfa', 'pfb', 'pcf', 'fnt', 'bdf', 'pfr', 'eot']
export const fontRx = new RegExp(`.(${fontExtensions.join('|')})$`, 'i')

export async function safefetch<T> (...args: Parameters<typeof fetch>): Promise<T | null> {
  try {
    const res = await fetch(...args)
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function arrayEqual<T> (a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export function nextTick (): Promise<void> {
  return new Promise<void>(resolve => queueMicrotask(resolve))
}

export function colors (hex = '#ffffff'): { r: number; g: number; b: number } {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}
