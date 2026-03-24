import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from '@/mocks/setup'
import Exercise2Page from '@/app/exercise2/page'

describe('Exercise 2 — Fixed Range (integration)', () => {
  it('renders the full page structure', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('region', { name: /fixed values/i })).toBeInTheDocument()
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })

  it('both thumbs are keyboard focusable', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    screen.getAllByRole('slider').forEach((s) =>
      expect(s).toHaveAttribute('tabindex', '0')
    )
  })

  it('ArrowRight on left thumb snaps to next stop (5.99)', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb] = screen.getAllByRole('slider')
    leftThumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '5.99')
  })

  it('ArrowLeft on left thumb at first stop stays at 1.99', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb] = screen.getAllByRole('slider')
    leftThumb.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '1.99')
  })

  it('ArrowRight on right thumb at last stop stays at 70.99', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [, rightThumb] = screen.getAllByRole('slider')
    rightThumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '70.99')
  })

  it('values do not cross: left thumb stops at right thumb value', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb, rightThumb] = screen.getAllByRole('slider')
    const maxValue = rightThumb.getAttribute('aria-valuenow')!

    leftThumb.focus()
    for (let i = 0; i < 10; i++) {
      await userEvent.keyboard('{ArrowRight}')
    }
    expect(Number(leftThumb.getAttribute('aria-valuenow'))).toBeLessThanOrEqual(
      Number(maxValue)
    )
  })

  it('labels are NOT editable (no buttons)', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('clicking labels does not open an input', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const label = screen.getAllByText('1.99 €')[0]
    await userEvent.click(label)
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('aria-valuetext shows formatted currency on each thumb', async () => {
    render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    const [leftThumb, rightThumb] = screen.getAllByRole('slider')
    expect(leftThumb).toHaveAttribute('aria-valuetext', '1.99 €')
    expect(rightThumb).toHaveAttribute('aria-valuetext', '70.99 €')
  })

  it('has no axe violations on full render', async () => {
    const { container } = render(<Exercise2Page />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
