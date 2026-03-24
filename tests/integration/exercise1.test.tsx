import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from '@/mocks/setup'
import Exercise1Page from '@/app/exercise1/page'

describe('Exercise 1 — Normal Range (integration)', () => {
  it('renders the full page structure', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('region', { name: /normal range/i })).toBeInTheDocument()
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })

  it('both thumbs are keyboard focusable (tabIndex=0)', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    const sliders = screen.getAllByRole('slider')
    sliders.forEach((s) => expect(s).toHaveAttribute('tabindex', '0'))
  })

  it('ArrowRight on left thumb increases its value', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb] = screen.getAllByRole('slider')
    leftThumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '2')
  })

  it('ArrowLeft on left thumb at min stays at min', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb] = screen.getAllByRole('slider')
    leftThumb.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '1')
  })

  it('Home key moves left thumb to absolute minimum', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb] = screen.getAllByRole('slider')
    leftThumb.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    await userEvent.keyboard('{Home}')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '1')
  })

  it('End key on left thumb moves to current right thumb value', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb, rightThumb] = screen.getAllByRole('slider')
    const maxValue = rightThumb.getAttribute('aria-valuenow')!

    leftThumb.focus()
    await userEvent.keyboard('{End}')
    expect(leftThumb).toHaveAttribute('aria-valuenow', maxValue)
  })

  it('values do not cross: left thumb cannot exceed right', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb, rightThumb] = screen.getAllByRole('slider')
    const maxValue = Number(rightThumb.getAttribute('aria-valuenow'))

    leftThumb.focus()
    for (let i = 0; i < 120; i++) {
      await userEvent.keyboard('{ArrowRight}')
    }
    expect(Number(leftThumb.getAttribute('aria-valuenow'))).toBeLessThanOrEqual(maxValue)
  })

  it('editing min label below 1 clamps to 1', async () => {
    render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [minButton] = screen.getAllByRole('button')
    await userEvent.click(minButton)
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '-50')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(screen.getByText('1 €')).toBeInTheDocument())
  })

  it('has no axe violations on full render', async () => {
    const { container } = render(<Exercise1Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
