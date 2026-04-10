/**
 * Encryption/decryption module.
 *
 * The head app uses Web Crypto API (AES-CBC with PBKDF2 derived key).
 * React Native does not natively support crypto.subtle.
 *
 * TODO: implement using expo-crypto or react-native-quick-crypto
 */

const key = new Uint8Array([104, 97, 121, 97, 115, 101, 45, 111, 118, 101, 114, 45, 97, 108, 108, 45, 251, 249, 0, 204, 242, 221, 119, 44, 147, 27, 83, 227, 225, 179, 149, 80, 70, 163, 58, 97, 201, 1, 10, 33, 78, 172, 195, 239, 171, 119, 51, 199, 127, 248, 221, 31, 90, 114, 200, 255, 252, 158, 158, 57, 245, 153, 44, 126, 130, 232, 230, 192, 0, 223, 204, 137, 211, 115, 33, 42, 68, 227, 65, 161, 17, 116, 138, 195, 51, 51, 181, 183, 124, 119, 161, 74, 202, 21, 182, 195, 134, 198, 191, 182, 223, 205, 60, 175, 207, 223, 232, 94, 133, 70, 10, 127, 100, 170, 109, 22]).slice(0, 16)

// TODO: implement proper AES-CBC encryption for React Native
// The head app uses PBKDF2 key derivation + AES-CBC encryption via crypto.subtle
// For now, use a simple base64 encoding as a placeholder
// This MUST be replaced with real encryption before production use

function uint8ToHex (arr: Uint8Array): string {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

function hexToUint8 (hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

function textToUint8 (text: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(text)
}

function uint8ToText (arr: Uint8Array): string {
  const decoder = new TextDecoder()
  return decoder.decode(arr)
}

// Simple XOR-based encryption as fallback
// TODO: replace with proper AES-CBC via react-native-quick-crypto or expo-crypto
function xorCrypt (data: Uint8Array): Uint8Array {
  const result = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i]! ^ key[i % key.length]!
  }
  return result
}

export async function encryptMessage (message: string): Promise<string> {
  const data = textToUint8(message)
  const encrypted = xorCrypt(data)
  return uint8ToHex(encrypted)
}

export async function decryptMessage (encryptedMessage: string): Promise<string> {
  const data = hexToUint8(encryptedMessage)
  const decrypted = xorCrypt(data)
  return uint8ToText(decrypted)
}
