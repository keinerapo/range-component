import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'

describe('rangeService', () => {
  describe('BASE_URL resolution', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      delete process.env.NEXT_PUBLIC_API_URL
    })

    it('uses the relative path /api/range when NEXT_PUBLIC_API_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL
      const { getNormalRange } = await import('@/services/rangeService')
      const data = await getNormalRange()
      expect(data).toMatchObject({ min: 1, max: 100 })
    })

    it('uses NEXT_PUBLIC_API_URL as prefix when the variable is set', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080'

      server.use(
        http.get('http://localhost:8080/api/range/normal', () =>
          HttpResponse.json({ min: 0, max: 50 })
        )
      )

      const { getNormalRange } = await import('@/services/rangeService')
      const data = await getNormalRange()
      expect(data).toMatchObject({ min: 0, max: 50 })
    })
  })
})
