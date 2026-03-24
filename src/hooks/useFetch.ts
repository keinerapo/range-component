import { useState, useEffect, useRef } from 'react'

type FetchState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }

export function useFetch<T>(fetcher: () => Promise<T>): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'loading' })
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    let cancelled = false

    fetcherRef.current()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            error: (err as Error).message,
          })
        }
      })

    return () => { cancelled = true }
  }, [])

  return state
}
