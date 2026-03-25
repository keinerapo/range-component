import { describe, it, expect } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useFetch } from '@/hooks/useFetch'

const fetchNormal = () => fetch('/api/range/normal').then((r) => r.json())
const fetchFixed = () => fetch('/api/range/fixed').then((r) => r.json())

describe('useFetch<T>', () => {
  describe('initial state', () => {
    it('starts with status loading', () => {
      const { result } = renderHook(() => useFetch(fetchNormal))
      expect(result.current.status).toBe('loading')
    })
  })

  describe('success path', () => {
    it('transitions to success when fetch resolves', async () => {
      const { result } = renderHook(() => useFetch(fetchNormal))
      await waitFor(() => expect(result.current.status).toBe('success'))
      expect(result.current).toMatchObject({ status: 'success', data: { min: 1, max: 100 } })
    })

    it('resolves fixed range data correctly', async () => {
      const { result } = renderHook(() => useFetch(fetchFixed))
      await waitFor(() => expect(result.current.status).toBe('success'))
      expect(result.current).toMatchObject({
        status: 'success',
        data: { rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] },
      })
    })
  })

  describe('error path', () => {
    it('transitions to error when fetch rejects with 500', async () => {
      server.use(
        http.get('/api/range/normal', () =>
          new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
        )
      )
      const { result } = renderHook(() => useFetch(fetchNormal))
      await waitFor(() => expect(result.current.status).toBe('error'))
      expect(result.current).toMatchObject({ status: 'error', error: expect.any(String) })
    })

    it('the error string is non-empty', async () => {
      server.use(
        http.get('/api/range/fixed', () =>
          new HttpResponse(null, { status: 503, statusText: 'Service Unavailable' })
        )
      )
      const { result } = renderHook(() => useFetch(fetchFixed))
      await waitFor(() => expect(result.current.status).toBe('error'))
      if (result.current.status === 'error') {
        expect(result.current.error.length).toBeGreaterThan(0)
      }
    })
  })

  describe('discriminated union narrowing', () => {
    it('data is accessible without assertion after status === success', async () => {
      const { result } = renderHook(() => useFetch(fetchNormal))
      await waitFor(() => expect(result.current.status).toBe('success'))
      const state = result.current
      if (state.status === 'success') {
        expect(state.data).toBeDefined()
      } else {
        throw new Error('Expected success state')
      }
    })

    it('error is accessible without assertion after status === error', async () => {
      server.use(
        http.get('/api/range/normal', () =>
          new HttpResponse(null, { status: 500 })
        )
      )
      const { result } = renderHook(() => useFetch(fetchNormal))
      await waitFor(() => expect(result.current.status).toBe('error'))
      const state = result.current
      if (state.status === 'error') {
        expect(state.error).toBeDefined()
      } else {
        throw new Error('Expected error state')
      }
    })
  })

  describe('cancellation', () => {
    it('does not update state after unmount', async () => {
      const { result, unmount } = renderHook(() => useFetch(fetchNormal))
      unmount()
      expect(result.current.status).toBe('loading')
    })

    it('does not call setState when the component unmounts before the fetch resolves', async () => {
      let resolvePromise!: (value: unknown) => void
      const slowFetcher = () =>
        new Promise<{ min: number; max: number }>((res) => {
          resolvePromise = res as (value: unknown) => void
        })

      const { result, unmount } = renderHook(() => useFetch(slowFetcher))
      expect(result.current.status).toBe('loading')

      unmount()
      act(() => resolvePromise({ min: 1, max: 100 }))

      expect(result.current.status).toBe('loading')
    })
  })

  describe('refetch', () => {
    it('returns a refetch function', () => {
      const { result } = renderHook(() => useFetch(fetchNormal))
      expect(typeof result.current.refetch).toBe('function')
    })

    it('refetch resets to loading and re-fetches data', async () => {
      const { result } = renderHook(() => useFetch(fetchNormal))
      await waitFor(() => expect(result.current.status).toBe('success'))

      act(() => result.current.refetch())
      expect(result.current.status).toBe('loading')
      await waitFor(() => expect(result.current.status).toBe('success'))
      expect(result.current).toMatchObject({ status: 'success', data: { min: 1, max: 100 } })
    })

    it('refetch can recover from error state', async () => {
      server.use(
        http.get('/api/range/normal', () =>
          new HttpResponse(null, { status: 500 })
        )
      )
      const { result } = renderHook(() => useFetch(fetchNormal))
      await waitFor(() => expect(result.current.status).toBe('error'))

      server.resetHandlers()
      act(() => result.current.refetch())
      await waitFor(() => expect(result.current.status).toBe('success'))
      expect(result.current).toMatchObject({ status: 'success', data: { min: 1, max: 100 } })
    })
  })
})
