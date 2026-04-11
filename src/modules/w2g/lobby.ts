import type { W2GClient } from '.'

/** Global W2G lobby reference (undefined when no session is active) */
export let w2globby: W2GClient | undefined

export function setW2GLobby (client: W2GClient | undefined) {
  w2globby = client
}
