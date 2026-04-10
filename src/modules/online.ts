/**
 * Online detection module.
 *
 * Provides a non-hook API compatible with the head's readable store.
 * For React components, prefer `useOnline()` from `@/hooks/useOnline`.
 */
import NetInfo from '@react-native-community/netinfo'

let _isOnline = true

// Subscribe to connectivity changes at module level
NetInfo.addEventListener((state) => {
  _isOnline = state.isConnected ?? true
})

/** Get current online status (non-reactive) */
export function isOnline (): boolean {
  return _isOnline
}

/** Subscribe to online status changes. Returns an unsubscribe function. */
export function subscribe (callback: (online: boolean) => void): () => void {
  return NetInfo.addEventListener((state) => {
    const online = state.isConnected ?? true
    callback(online)
  })
}

export default { isOnline, subscribe }
