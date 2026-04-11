/**
 * Navigation and input handling module for React Native.
 *
 * The head app provides D-pad navigation, hover/click wrappers, and drag scrolling
 * for DOM elements. React Native uses a completely different interaction model.
 *
 * This module provides the type definitions and essential exports.
 */

type InputType = 'mouse' | 'touch' | 'dpad'

let _inputType: InputType = 'touch'

export function getInputType (): InputType {
  return _inputType
}

export function setInputType (type: InputType) {
  _inputType = type
}

/** Subscribe to input type changes. Returns unsubscribe function. */
export function subscribeInputType (cb: (type: InputType) => void): () => void {
  // In React Native, input type is always 'touch' on mobile
  // TODO: implement for TV/gamepad support
  cb(_inputType)
  return () => {}
}

// No-op equivalents of DOM-based functions from HEAD
export function navigate (_e: unknown) {
  // D-pad navigation is handled by React Navigation on RN
}
