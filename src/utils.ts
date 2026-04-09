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
}
