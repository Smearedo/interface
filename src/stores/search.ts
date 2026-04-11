import { create } from 'zustand'

interface SearchState {
  episode: number | null
  mediaId: number | null
  searchQuery: string
  setSearch: (episode: number | null, mediaId: number | null) => void
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  episode: null,
  mediaId: null,
  searchQuery: '',
  setSearch: (episode, mediaId) => set({ episode, mediaId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ episode: null, mediaId: null, searchQuery: '' })
}))
