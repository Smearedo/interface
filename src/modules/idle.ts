import { AppState, type AppStateStatus } from 'react-native'

type ActivityState = 'active' | 'inactive'
type IdleState = 'active' | 'idle'
type LockedState = 'locked' | 'unlocked'

let _activityState: ActivityState = 'active'
let _idleState: IdleState = 'active'
let _lockedState: LockedState = 'unlocked'
let _isPlaying = false

// Track app state changes
AppState.addEventListener('change', (state: AppStateStatus) => {
  if (state === 'active') {
    _activityState = 'active'
    _idleState = 'active'
    _lockedState = 'unlocked'
  } else if (state === 'background') {
    _activityState = 'inactive'
    _idleState = 'idle'
    _lockedState = 'locked'
  } else if (state === 'inactive') {
    _activityState = 'inactive'
  }
})

export function getActivityState (): ActivityState {
  return _activityState
}

export function getIdleState (): IdleState {
  return _idleState
}

export function getLockedState (): LockedState {
  return _lockedState
}

export function getIsPlaying (): boolean {
  return _isPlaying
}

export function setIsPlaying (value: boolean) {
  _isPlaying = value
}

/** Subscribe to activity state changes. Returns unsubscribe function. */
export function subscribeActivityState (cb: (state: ActivityState) => void): () => void {
  const subscription = AppState.addEventListener('change', (appState) => {
    const newState: ActivityState = appState === 'active' ? 'active' : 'inactive'
    if (newState !== _activityState) {
      _activityState = newState
      cb(newState)
    }
  })
  return () => subscription.remove()
}

/** Subscribe to idle state changes. Returns unsubscribe function. */
export function subscribeIdleState (cb: (state: IdleState) => void): () => void {
  const subscription = AppState.addEventListener('change', (appState) => {
    const newState: IdleState = appState === 'active' ? 'active' : 'idle'
    if (newState !== _idleState) {
      _idleState = newState
      cb(newState)
    }
  })
  return () => subscription.remove()
}

/** Subscribe to locked state changes. Returns unsubscribe function. */
export function subscribeLockedState (cb: (state: LockedState) => void): () => void {
  const subscription = AppState.addEventListener('change', (appState) => {
    const newState: LockedState = appState === 'background' ? 'locked' : 'unlocked'
    if (newState !== _lockedState) {
      _lockedState = newState
      cb(newState)
    }
  })
  return () => subscription.remove()
}
