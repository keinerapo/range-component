import { useFetch } from './useFetch'
import { getNormalRange } from '@/services/rangeService'

export function useNormalRange() {
  return useFetch(getNormalRange)
}
