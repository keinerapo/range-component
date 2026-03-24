import { useFetch } from './useFetch'
import { getFixedRange } from '@/services/rangeService'

export function useFixedRange() {
  return useFetch(getFixedRange)
}
