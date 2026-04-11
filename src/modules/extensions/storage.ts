import Debug from 'debug'
import AsyncStorage from '@react-native-async-storage/async-storage'

import type { ExtensionConfig } from './types'

const debug = Debug('ui:extensions')

type ExtensionID = string

type SavedExtensions = Record<ExtensionID, ExtensionConfig>

type ExtensionsOptions = {
  [K in keyof SavedExtensions]: {
    options: Record<string, never>
    enabled: boolean
  }
}

// In-memory state (persisted to AsyncStorage)
let _savedConfigs: SavedExtensions = {}
let _savedOptions: ExtensionsOptions = {}

async function _loadConfigs () {
  try {
    const raw = await AsyncStorage.getItem('extensions')
    if (raw) _savedConfigs = JSON.parse(raw)
  } catch {
    // ignore
  }
}

async function _loadOptions () {
  try {
    const raw = await AsyncStorage.getItem('extensionoptions')
    if (raw) _savedOptions = JSON.parse(raw)
  } catch {
    // ignore
  }
}

async function _saveConfigs () {
  await AsyncStorage.setItem('extensions', JSON.stringify(_savedConfigs))
}

async function _saveOptions () {
  await AsyncStorage.setItem('extensionoptions', JSON.stringify(_savedOptions))
}

export function getSavedConfigs (): SavedExtensions {
  return _savedConfigs
}

export function getSavedOptions (): ExtensionsOptions {
  return _savedOptions
}

export const storage = new class ConfigManager {
  // TODO: implement CodeManager for React Native (web workers not available)
  codeManager = {
    extensions: new Map() as Map<string, never>,
    async delete (_id: string) { /* no-op */ },
    async initiate (_configs: ExtensionConfig[]) { /* no-op */ },
    async enableCORS (_urls: string[]) { /* no-op */ },
    async downloadScripts (_configs: ExtensionConfig[], _update = false): Promise<string[]> { return [] }
  }

  ready = this._init()

  private async _init () {
    await _loadConfigs()
    await _loadOptions()
    debug('Extension storage initialized')
  }

  constructor () {
    this.update()
  }

  _validateConfig (config: Partial<ExtensionConfig> | null): boolean {
    const valid = !!config && ['name', 'version', 'id', 'type', 'accuracy', 'icon', 'update', 'code'].every(prop => prop in (config ?? {}))
    debug('_validateConfig', config, 'result:', valid)
    return valid
  }

  _ensureOptions (ids: ExtensionID[], enabled = true) {
    debug('_ensureOptions for', ids, 'enabled:', enabled)
    for (const id of ids) {
      if (!(id in _savedOptions)) {
        (_savedOptions as Record<string, unknown>)[id] = { options: {}, enabled }
      }
    }
    _saveOptions()
  }

  _updateSaved (configs: ExtensionConfig[]) {
    debug('_updateSaved', configs.map(c => c.id))
    for (const c of configs) {
      _savedConfigs[c.id] = c
    }
    _saveConfigs()
  }

  configs () {
    debug('configs()')
    return _savedConfigs
  }

  async import (url: string) {
    debug('Importing extension config from', url)
    // TODO: implement extension import for React Native
    throw new Error('Extension import not yet implemented for mobile')
  }

  async delete (id: ExtensionID) {
    debug('Deleting extension from storage', id)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete _savedConfigs[id]
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (_savedOptions as Record<string, unknown>)[id]
    await _saveConfigs()
    await _saveOptions()
    debug('Extension deleted from storage', id)
  }

  async update () {
    await this.ready
    debug('Updating extensions')
    // TODO: implement extension updates for React Native
    debug('Update complete (no-op on mobile)')
  }
}()
