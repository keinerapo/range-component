import { describe, it, expect } from 'vitest'
import { clamp } from '@/utils/clamp'

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(50, 1, 100)).toBe(50)
  })

  it('clamps to min when value is below min', () => {
    expect(clamp(-5, 1, 100)).toBe(1)
  })

  it('clamps to max when value is above max', () => {
    expect(clamp(150, 1, 100)).toBe(100)
  })

  it('returns min when value equals min', () => {
    expect(clamp(1, 1, 100)).toBe(1)
  })

  it('returns max when value equals max', () => {
    expect(clamp(100, 1, 100)).toBe(100)
  })

  it('handles floating point values', () => {
    expect(clamp(5.99, 1.99, 70.99)).toBe(5.99)
    expect(clamp(0.5, 1.99, 70.99)).toBe(1.99)
    expect(clamp(99.99, 1.99, 70.99)).toBe(70.99)
  })

  it('returns min when min equals max', () => {
    expect(clamp(50, 10, 10)).toBe(10)
  })
})
