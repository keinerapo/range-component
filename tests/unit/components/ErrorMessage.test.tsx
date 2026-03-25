import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('does not render a retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Oops" />)
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })

  it('renders a retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Oops" onRetry={vi.fn()} />)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn()
    render(<ErrorMessage message="Oops" onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
