/**
 * Extension worker stub for React Native.
 *
 * The head app uses Web Workers via abslink to run extensions in isolated contexts.
 * Web Workers are not available in React Native, so this is a stub.
 *
 * TODO: investigate JSI or native modules for sandboxed extension execution
 */

import type { SearchOptions, TorrentQuery, TorrentResult } from './types'

export interface ExtensionWorker {
  construct (code: string): void
  loaded (): Promise<void>
  url (): Promise<string>
  single (query: TorrentQuery, options?: SearchOptions): Promise<TorrentResult[]>
  batch (query: TorrentQuery, options?: SearchOptions): Promise<TorrentResult[]>
  movie (query: TorrentQuery, options?: SearchOptions): Promise<TorrentResult[]>
  query (hash: string, options?: SearchOptions): Promise<string>
  test (): Promise<boolean>
}

// Stub: no-op worker that always returns empty results
const workerStub: ExtensionWorker = {
  construct (_code: string) {
    // no-op: web workers not available in React Native
  },
  async loaded () {
    // no-op
  },
  async url () {
    return ''
  },
  async single (_query: TorrentQuery, _options?: SearchOptions): Promise<TorrentResult[]> {
    return []
  },
  async batch (_query: TorrentQuery, _options?: SearchOptions): Promise<TorrentResult[]> {
    return []
  },
  async movie (_query: TorrentQuery, _options?: SearchOptions): Promise<TorrentResult[]> {
    return []
  },
  async query (_hash: string, _options?: SearchOptions): Promise<string> {
    return ''
  },
  async test (): Promise<boolean> {
    return false
  }
}

export default workerStub
