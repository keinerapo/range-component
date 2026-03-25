import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats an integer value with 2 decimal places', () => {
    expect(formatCurrency(100)).toMatch(/100,00\s€/)
    expect(formatCurrency(1)).toMatch(/1,00\s€/)
  })

  it('formats a float value with 2 decimal places', () => {
    expect(formatCurrency(5.99)).toMatch(/5,99\s€/)
    expect(formatCurrency(1.99)).toMatch(/1,99\s€/)
    expect(formatCurrency(70.99)).toMatch(/70,99\s€/)
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/0,00\s€/)
  })

  it('formats values with one decimal place to two', () => {
    expect(formatCurrency(5.9)).toMatch(/5,90\s€/)
  })
})
