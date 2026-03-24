import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Range } from '@/components/range/Range'

const baseProps = {
  min: 1,
  max: 100,
  step: 1,
  groupLabel: 'Test range',
}

describe('Range', () => {
  it('renders with role="group" and aria-label', () => {
    render(<Range {...baseProps} />)
    expect(screen.getByRole('group', { name: /test range/i })).toBeInTheDocument()
  })

  it('renders two sliders', () => {
    render(<Range {...baseProps} />)
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })

  it('adds cursor-grabbing class when dragging via pointerdown on thumb', () => {
    render(<Range {...baseProps} />)
    const track = screen.getByTestId('range-track')
    track.setPointerCapture = vi.fn()

    const [minThumb] = screen.getAllByRole('slider')
    fireEvent.pointerDown(minThumb, { pointerId: 1, clientX: 50 })

    const group = screen.getByRole('group', { name: /test range/i })
    expect(group.className).toContain('cursor-grabbing')
  })

  it('min thumb moves via keyboard', () => {
    render(<Range {...baseProps} />)
    const [minThumb] = screen.getAllByRole('slider')

    fireEvent.keyDown(minThumb, { key: 'ArrowRight' })

    expect(minThumb).toHaveAttribute('aria-valuenow', '2')
  })

  it('max thumb moves via keyboard', () => {
    render(<Range {...baseProps} />)
    const [, maxThumb] = screen.getAllByRole('slider')

    fireEvent.keyDown(maxThumb, { key: 'ArrowLeft' })

    expect(maxThumb).toHaveAttribute('aria-valuenow', '99')
  })

  it('renders min and max labels via render props', () => {
    render(
      <Range
        {...baseProps}
        renderMinLabel={({ minValue }) => <span data-testid="min-label">{minValue}</span>}
        renderMaxLabel={({ maxValue }) => <span data-testid="max-label">{maxValue}</span>}
      />,
    )
    expect(screen.getByTestId('min-label')).toHaveTextContent('1')
    expect(screen.getByTestId('max-label')).toHaveTextContent('100')
  })

  it('pointer move during drag with stops snaps to nearest stop', () => {
    const STOPS = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
    render(
      <Range
        min={1.99}
        max={70.99}
        stops={STOPS}
        groupLabel="Fixed range"
      />,
    )
    const track = screen.getByTestId('range-track')
    track.setPointerCapture = vi.fn()

    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0, right: 200, width: 200, top: 0, bottom: 10, height: 10, x: 0, y: 0,
      toJSON: () => ({}),
    } as DOMRect)

    const [minThumb] = screen.getAllByRole('slider')
    fireEvent.pointerDown(minThumb, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 100 })

    expect(minThumb).toHaveAttribute('aria-valuenow', '30.99')
  })

  it('pointer move during drag in continuous mode uses Math.round step', () => {
    render(<Range {...baseProps} />)
    const track = screen.getByTestId('range-track')
    track.setPointerCapture = vi.fn()

    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0, right: 200, width: 200, top: 0, bottom: 10, height: 10, x: 0, y: 0,
      toJSON: () => ({}),
    } as DOMRect)

    const [minThumb] = screen.getAllByRole('slider')
    fireEvent.pointerDown(minThumb, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 100 })

    expect(Number(minThumb.getAttribute('aria-valuenow'))).toBeGreaterThan(1)
  })
})
