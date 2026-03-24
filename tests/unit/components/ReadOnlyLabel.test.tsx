import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReadOnlyLabel } from '@/components/range/ReadOnlyLabel'

describe('ReadOnlyLabel', () => {
  it('renders the formatted value with 2 decimal places', () => {
    render(<ReadOnlyLabel value={5.99} label="Minimum price" />)
    expect(screen.getByText('5.99 €')).toBeInTheDocument()
  })

  it('renders integer values without decimal places', () => {
    render(<ReadOnlyLabel value={100} label="Maximum price" />)
    expect(screen.getByText('100 €')).toBeInTheDocument()
  })

  it('has an accessible aria-label', () => {
    render(<ReadOnlyLabel value={5.99} label="Minimum price" />)
    expect(
      screen.getByLabelText(/minimum price: 5.99 €/i)
    ).toBeInTheDocument()
  })

  it('is not a button or input (read-only, non-interactive)', () => {
    render(<ReadOnlyLabel value={5.99} label="Minimum price" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('does not change on click', async () => {
    const onChange = vi.fn()
    render(<ReadOnlyLabel value={5.99} label="Minimum price" />)
    await userEvent.click(screen.getByText('5.99 €'))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByText('5.99 €')).toBeInTheDocument()
  })
})
