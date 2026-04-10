import { Platform } from 'react-native'

export default {
  isAndroid: Platform.OS === 'android',
  isAndroidTV: false,
  isIOS: Platform.OS === 'ios',
  isUnderPowered: false
}
