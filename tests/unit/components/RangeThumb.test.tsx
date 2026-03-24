import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RangeThumb } from '@/components/range/RangeThumb'

const defaultProps = {
  role: 'slider' as const,
  tabIndex: 0,
  'aria-label': 'Minimum value',
  'aria-valuenow': 25,
  'aria-valuemin': 1,
  'aria-valuemax': 75,
  'aria-valuetext': '25 €',
  onKeyDown: vi.fn(),
  onPointerDown: vi.fn(),
  position: 24,
  isActive: false,
}

describe('RangeThumb', () => {
  it('renders with role="slider"', () => {
    render(<RangeThumb {...defaultProps} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('has the correct ARIA attributes', () => {
    render(<RangeThumb {...defaultProps} />)
    const thumb = screen.getByRole('slider')
    expect(thumb).toHaveAttribute('aria-valuenow', '25')
    expect(thumb).toHaveAttribute('aria-valuemin', '1')
    expect(thumb).toHaveAttribute('aria-valuemax', '75')
    expect(thumb).toHaveAttribute('aria-valuetext', '25 €')
    expect(thumb).toHaveAttribute('aria-label', 'Minimum value')
  })

  it('has tabIndex={0} for keyboard focus', () => {
    render(<RangeThumb {...defaultProps} />)
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '0')
  })

  it('applies cursor-grab class when not active', () => {
    render(<RangeThumb {...defaultProps} isActive={false} />)
    expect(screen.getByRole('slider')).toHaveClass('cursor-grab')
  })

  it('applies cursor-grabbing class when active', () => {
    render(<RangeThumb {...defaultProps} isActive={true} />)
    expect(screen.getByRole('slider')).toHaveClass('cursor-grabbing')
  })

  it('is positioned at the correct left percentage', () => {
    render(<RangeThumb {...defaultProps} position={50} />)
    expect(screen.getByRole('slider')).toHaveStyle('left: 50%')
  })

  it('calls onPointerDown when pointer is pressed', async () => {
    const onPointerDown = vi.fn()
    render(<RangeThumb {...defaultProps} onPointerDown={onPointerDown} />)
    await userEvent.pointer({ target: screen.getByRole('slider'), keys: '[MouseLeft>]' })
    expect(onPointerDown).toHaveBeenCalledTimes(1)
  })

  it('calls onKeyDown when a key is pressed while focused', async () => {
    const onKeyDown = vi.fn()
    render(<RangeThumb {...defaultProps} onKeyDown={onKeyDown} />)
    await userEvent.click(screen.getByRole('slider'))
    await userEvent.keyboard('{ArrowRight}')
    expect(onKeyDown).toHaveBeenCalled()
  })
})
