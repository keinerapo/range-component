import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

describe('ErrorMessage', () => {
  it('renders the error message text', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('has role="alert" for screen readers', () => {
    render(<ErrorMessage message="Network error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('has aria-live="assertive"', () => {
    render(<ErrorMessage message="Load failed" />)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  it('renders with different messages', () => {
    const { rerender } = render(<ErrorMessage message="Error A" />)
    expect(screen.getByText('Error A')).toBeInTheDocument()
    rerender(<ErrorMessage message="Error B" />)
    expect(screen.getByText('Error B')).toBeInTheDocument()
  })
})
