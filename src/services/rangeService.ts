import type { NormalRangeData, FixedRangeData } from './rangeService.types'

const BASE_URL = '/api/range'

export async function getNormalRange(): Promise<NormalRangeData> {
  const response = await fetch(`${BASE_URL}/normal`)
  if (!response.ok) {
    throw new Error(`Failed to fetch normal range: ${response.statusText}`)
  }
  return response.json() as Promise<NormalRangeData>
}

export async function getFixedRange(): Promise<FixedRangeData> {
  const response = await fetch(`${BASE_URL}/fixed`)
  if (!response.ok) {
    throw new Error(`Failed to fetch fixed range: ${response.statusText}`)
  }
  return response.json() as Promise<FixedRangeData>
}
