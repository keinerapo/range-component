import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats an integer value without decimal places', () => {
    expect(formatCurrency(100)).toBe('100 €')
    expect(formatCurrency(1)).toBe('1 €')
  })

  it('formats a float value with 2 decimal places', () => {
    expect(formatCurrency(5.99)).toBe('5.99 €')
    expect(formatCurrency(1.99)).toBe('1.99 €')
    expect(formatCurrency(70.99)).toBe('70.99 €')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0 €')
  })

  it('formats values with one decimal place to two', () => {
    expect(formatCurrency(5.9)).toBe('5.90 €')
  })
})
