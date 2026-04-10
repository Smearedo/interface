import { binarySearch, firstArrayItem, getNextIp, identity, ipStr2Num, type Format, type indexFile, type ipBlockRecord, type locationRecord } from './utils'

const MASK = ipStr2Num('255.255.255.255')

// GeoIP data base URL - in head this fetches from /geoip/, for RN we use a CDN
// TODO: bundle or host geoip data for React Native
const GEOIP_BASE_URL = 'https://hayase.watch/geoip'

const ipCache: Record<string, Format> = {}
let locationCache: Promise<locationRecord[]> | null = null

async function fetchJSON<T> (path: string): Promise<T> {
  const res = await fetch(`${GEOIP_BASE_URL}/${path}.json`)
  return await res.json() as T
}

async function readFile<T extends Format> (filename: string): Promise<T> {
  if (ipCache[filename] !== undefined) {
    return await Promise.resolve(ipCache[filename] as T)
  }
  const content = await fetchJSON<T>(filename)
  ipCache[filename] = content
  return content
}

interface IpInfo {
  range: [number, number]
  country: string
  region: string
  eu: '0'|'1'
  timezone: string
  city: string
  ll: [number, number]
  metro: number
  area: number
}

// Number of nodes per mid-index (from doc999tor-fast-geoip params)
const NUMBER_NODES_PER_MIDINDEX = 100

export async function lookup (stringifiedIp: string): Promise<IpInfo> {
  const ip = ipStr2Num(stringifiedIp)

  if (Number.isNaN(ip)) throw new Error('IP cannot be NaN')

  const data = await readFile<indexFile>('index')
  const rootIndex = binarySearch(data, ip, identity)

  if (rootIndex === -1) throw new Error('IP not found in the database')

  let nextIp = getNextIp(data, rootIndex, MASK, identity)
  const data2 = await readFile<indexFile>('i' + rootIndex)
  const index = binarySearch(data2, ip, identity) + rootIndex * NUMBER_NODES_PER_MIDINDEX
  nextIp = getNextIp(data2, index, nextIp, identity)
  const data3 = await readFile<ipBlockRecord[]>('' + index)
  const index1 = binarySearch(data3, ip, firstArrayItem)
  const ipData = data3[index1]!

  if (!ipData[1]) throw new Error("IP doesn't have any region nor country associated")

  nextIp = getNextIp<ipBlockRecord>(data3, index1, nextIp, firstArrayItem)

  if (!locationCache) {
    locationCache = fetchJSON<locationRecord[]>('locations')
  }
  const locations = await locationCache
  const location = locations[ipData[1]]!

  return {
    range: [ipData[0], nextIp] as [number, number],
    country: location[0],
    region: location[1],
    eu: location[5],
    timezone: location[4],
    city: location[2],
    ll: [ipData[2], ipData[3]] as [number, number],
    metro: location[3],
    area: ipData[4]
  }
}
