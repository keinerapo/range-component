import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useNormalRange } from '@/hooks/useNormalRange'

describe('useNormalRange', () => {
  it('starts with status loading', () => {
    const { result } = renderHook(() => useNormalRange())
    expect(result.current.status).toBe('loading')
  })

  it('transitions to success with correct data', async () => {
    const { result } = renderHook(() => useNormalRange())
    await waitFor(() => expect(result.current.status).toBe('success'))
    if (result.current.status === 'success') {
      expect(result.current.data).toEqual({ min: 1, max: 100 })
    }
  })

  it('transitions to error when fetch fails', async () => {
    server.use(
      http.get('/api/range/normal', () =>
        new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
      )
    )
    const { result } = renderHook(() => useNormalRange())
    await waitFor(() => expect(result.current.status).toBe('error'))
    if (result.current.status === 'error') {
      expect(result.current.error).toMatch(/Failed to fetch normal range/)
    }
  })
})
