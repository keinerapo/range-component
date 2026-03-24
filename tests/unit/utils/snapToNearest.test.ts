import { describe, it, expect } from 'vitest'
import { snapToNearest, nextStop, prevStop } from '@/utils/snapToNearest'

const STOPS = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

describe('snapToNearest', () => {
  it('returns the value itself when it matches a stop exactly', () => {
    expect(snapToNearest(5.99, STOPS)).toBe(5.99)
    expect(snapToNearest(1.99, STOPS)).toBe(1.99)
    expect(snapToNearest(70.99, STOPS)).toBe(70.99)
  })

  it('snaps to nearest stop when value is between stops', () => {
    expect(snapToNearest(4, STOPS)).toBe(5.99)
    expect(snapToNearest(2, STOPS)).toBe(1.99)
    expect(snapToNearest(20, STOPS)).toBe(10.99)
    expect(snapToNearest(40, STOPS)).toBe(30.99)
  })

  it('returns the only stop when array has one element', () => {
    expect(snapToNearest(999, [42])).toBe(42)
  })

  it('returns value when stops array is empty', () => {
    expect(snapToNearest(10, [])).toBe(10)
  })

  it('snaps to first stop when value is below all stops', () => {
    expect(snapToNearest(-10, STOPS)).toBe(1.99)
  })

  it('snaps to last stop when value is above all stops', () => {
    expect(snapToNearest(999, STOPS)).toBe(70.99)
  })
})

describe('nextStop', () => {
  it('returns the next stop in the array', () => {
    expect(nextStop(1.99, STOPS)).toBe(5.99)
    expect(nextStop(5.99, STOPS)).toBe(10.99)
    expect(nextStop(10.99, STOPS)).toBe(30.99)
  })

  it('returns the same stop when already at the last stop', () => {
    expect(nextStop(70.99, STOPS)).toBe(70.99)
  })

  it('snaps to nearest when value is not in stops array', () => {
    expect(nextStop(4, STOPS)).toBe(5.99)
  })
})

describe('prevStop', () => {
  it('returns the previous stop in the array', () => {
    expect(prevStop(70.99, STOPS)).toBe(50.99)
    expect(prevStop(50.99, STOPS)).toBe(30.99)
    expect(prevStop(5.99, STOPS)).toBe(1.99)
  })

  it('returns the same stop when already at the first stop', () => {
    expect(prevStop(1.99, STOPS)).toBe(1.99)
  })

  it('returns nearest stop when value is not in stops array', () => {
    expect(prevStop(4, STOPS)).toBe(5.99)
  })
})
