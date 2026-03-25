import { useState, useEffect, useCallback } from 'react'
import type { FetchState } from '@/types/fetch'

export type UseFetchResult<T> = FetchState<T> & { refetch: () => void }

export function useFetch<T>(fetcher: () => Promise<T>): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'loading' })
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' }) // eslint-disable-line react-hooks/set-state-in-effect -- intentional: reset on refetch/fetcher change

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            error: err instanceof Error ? err.message : String(err),
          })
        }
      })

    return () => { cancelled = true }
  }, [fetcher, fetchKey])

  const refetch = useCallback(() => setFetchKey((k) => k + 1), [])

  return { ...state, refetch }
}
