import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useFixedRange } from '@/hooks/useFixedRange'

describe('useFixedRange', () => {
  it('starts with status loading', () => {
    const { result } = renderHook(() => useFixedRange())
    expect(result.current.status).toBe('loading')
  })

  it('transitions to success with correct data', async () => {
    const { result } = renderHook(() => useFixedRange())
    await waitFor(() => expect(result.current.status).toBe('success'))
    if (result.current.status === 'success') {
      expect(result.current.data).toEqual({
        rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
      })
    }
  })

  it('transitions to error when fetch fails', async () => {
    server.use(
      http.get('/api/range/fixed', () =>
        new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })
      )
    )
    const { result } = renderHook(() => useFixedRange())
    await waitFor(() => expect(result.current.status).toBe('error'))
    if (result.current.status === 'error') {
      expect(result.current.error).toMatch(/Failed to fetch fixed range/)
    }
  })
})
