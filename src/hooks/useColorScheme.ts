import { useColorScheme as useNativeColorScheme } from 'react-native'

export function useColorScheme () {
  // Always return dark since the app is dark-mode only
  return 'dark' as const
}
