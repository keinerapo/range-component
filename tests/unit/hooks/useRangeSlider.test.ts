import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRangeSlider } from '@/hooks/useRangeSlider'

const baseOptions = {
  min: 1,
  max: 100,
  step: 1,
}

describe('useRangeSlider — initial state', () => {
  it('initialises with min and max values', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    expect(result.current.minValue).toBe(1)
    expect(result.current.maxValue).toBe(100)
  })

  it('isDragging starts as false', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    expect(result.current.isDragging).toBe(false)
  })

  it('activeThumb starts as null', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    expect(result.current.activeThumb).toBeNull()
  })
})

describe('useRangeSlider — setMinValue / setMaxValue', () => {
  it('setMinValue updates the min value', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(25))
    expect(result.current.minValue).toBe(25)
  })

  it('setMaxValue updates the max value', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMaxValue(75))
    expect(result.current.maxValue).toBe(75)
  })

  it('setMinValue clamps to absolute min', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(-99))
    expect(result.current.minValue).toBe(1)
  })

  it('setMaxValue clamps to absolute max', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMaxValue(999))
    expect(result.current.maxValue).toBe(100)
  })

  it('setMinValue cannot exceed maxValue (crossing guard)', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMaxValue(50))
    act(() => result.current.setMinValue(80))
    expect(result.current.minValue).toBe(50)
  })

  it('setMaxValue cannot go below minValue (crossing guard)', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(40))
    act(() => result.current.setMaxValue(10))
    expect(result.current.maxValue).toBe(40)
  })
})

describe('useRangeSlider — keyboard: continuous mode', () => {
  it('ArrowRight increases minValue by step', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowRight', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(2)
  })

  it('ArrowLeft decreases minValue by step', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(10))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowLeft', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(9)
  })

  it('ArrowUp increases minValue by step', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(10))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowUp', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(11)
  })

  it('ArrowDown decreases maxValue by step', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMaxValue(80))
    act(() => {
      result.current.handleKeyDown('max')(
        { key: 'ArrowDown', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.maxValue).toBe(79)
  })

  it('PageUp increases minValue by 10 steps', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(10))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'PageUp', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(20)
  })

  it('PageDown decreases minValue by 10 steps', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(50))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'PageDown', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(40)
  })

  it('Home sets minValue to absolute min', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(50))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'Home', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(1)
  })

  it('End on min thumb sets minValue to current maxValue', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(10))
    act(() => result.current.setMaxValue(70))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'End', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(70)
  })

  it('Home on max thumb sets maxValue to current minValue', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(30))
    act(() => result.current.setMaxValue(70))
    act(() => {
      result.current.handleKeyDown('max')(
        { key: 'Home', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.maxValue).toBe(30)
  })

  it('End on max thumb sets maxValue to absolute max', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMaxValue(50))
    act(() => {
      result.current.handleKeyDown('max')(
        { key: 'End', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.maxValue).toBe(100)
  })

  it('ArrowRight on min thumb stops at maxValue (no crossing)', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(50))
    act(() => result.current.setMaxValue(50))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowRight', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(50)
  })

  it('ArrowLeft on max thumb stops at minValue (no crossing)', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(50))
    act(() => result.current.setMaxValue(50))
    act(() => {
      result.current.handleKeyDown('max')(
        { key: 'ArrowLeft', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.maxValue).toBe(50)
  })

  it('unhandled keys are ignored', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(10))
    const before = result.current.minValue
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'Tab', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(before)
  })
})

describe('useRangeSlider — keyboard: fixed / stops mode', () => {
  const STOPS = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
  const fixedOptions = {
    min: 1.99,
    max: 70.99,
    stops: STOPS,
  }

  it('ArrowRight snaps min thumb to next stop', () => {
    const { result } = renderHook(() => useRangeSlider(fixedOptions))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowRight', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(5.99)
  })

  it('ArrowLeft snaps min thumb to previous stop', () => {
    const { result } = renderHook(() => useRangeSlider(fixedOptions))
    act(() => result.current.setMinValue(5.99))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowLeft', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(1.99)
  })

  it('ArrowLeft on min thumb at first stop stays at first stop', () => {
    const { result } = renderHook(() => useRangeSlider(fixedOptions))
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'ArrowLeft', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(1.99)
  })

  it('ArrowRight on max thumb at last stop stays at last stop', () => {
    const { result } = renderHook(() => useRangeSlider(fixedOptions))
    act(() => {
      result.current.handleKeyDown('max')(
        { key: 'ArrowRight', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.maxValue).toBe(70.99)
  })

  it('PageUp and PageDown are no-ops in fixed mode', () => {
    const { result } = renderHook(() => useRangeSlider(fixedOptions))
    act(() => result.current.setMinValue(10.99))
    const before = result.current.minValue
    act(() => {
      result.current.handleKeyDown('min')(
        { key: 'PageUp', preventDefault: () => {} } as React.KeyboardEvent
      )
    })
    expect(result.current.minValue).toBe(before)
  })
})

describe('useRangeSlider — ARIA attributes', () => {
  it('thumbAriaProps returns correct ARIA for min thumb', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(20))
    act(() => result.current.setMaxValue(80))
    const props = result.current.thumbAriaProps('min')
    expect(props.role).toBe('slider')
    expect(props.tabIndex).toBe(0)
    expect(props['aria-valuenow']).toBe(20)
    expect(props['aria-valuemin']).toBe(1)
    expect(props['aria-valuemax']).toBe(80)
    expect(props['aria-valuetext']).toBe('20 €')
  })

  it('thumbAriaProps returns correct ARIA for max thumb', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(20))
    act(() => result.current.setMaxValue(80))
    const props = result.current.thumbAriaProps('max')
    expect(props['aria-valuenow']).toBe(80)
    expect(props['aria-valuemin']).toBe(20)
    expect(props['aria-valuemax']).toBe(100)
    expect(props['aria-valuetext']).toBe('80 €')
  })

  it('ARIA attributes update when values change', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(30))
    const props = result.current.thumbAriaProps('min')
    expect(props['aria-valuenow']).toBe(30)
    expect(props['aria-valuetext']).toBe('30 €')
  })
})

describe('useRangeSlider — pointer events', () => {
  const makePointerEvent = (clientX: number) =>
    ({
      clientX,
      preventDefault: () => {},
      pointerId: 1,
    }) as unknown as React.PointerEvent

  it('handlePointerDown sets active thumb and isDragging to true', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => {
      result.current.handlePointerDown('min')(makePointerEvent(0))
    })
    expect(result.current.isDragging).toBe(true)
    expect(result.current.activeThumb).toBe('min')
  })

  it('handlePointerDown on max thumb sets activeThumb to max', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => {
      result.current.handlePointerDown('max')(makePointerEvent(0))
    })
    expect(result.current.isDragging).toBe(true)
    expect(result.current.activeThumb).toBe('max')
  })

  it('handlePointerUp resets isDragging and activeThumb', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => {
      result.current.handlePointerDown('min')(makePointerEvent(0))
    })
    act(() => {
      result.current.handlePointerUp()
    })
    expect(result.current.isDragging).toBe(false)
    expect(result.current.activeThumb).toBeNull()
  })

  it('handlePointerMove while not dragging does not change value', () => {
    const { result } = renderHook(() => useRangeSlider(baseOptions))
    act(() => result.current.setMinValue(10))
    act(() => result.current.setMaxValue(90))
    act(() => {
      result.current.handlePointerMove(makePointerEvent(50))
    })
    expect(result.current.minValue).toBe(10)
  })
})
