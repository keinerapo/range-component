import { useState, useRef, useEffect, RefObject } from 'react'
import { clamp } from '@/utils/clamp'
import { snapToNearest, nextStop, prevStop } from '@/utils/snapToNearest'
import { formatCurrency } from '@/utils/formatCurrency'

export type Thumb = 'min' | 'max'

export interface RangeSliderOptions {
  min: number
  max: number
  step?: number
  stops?: number[]
  minLabel?: string
  maxLabel?: string
}

export interface UseRangeSliderReturn {
  minValue: number
  maxValue: number
  isDragging: boolean
  activeThumb: Thumb | null
  trackRef: RefObject<HTMLDivElement | null>
  setMinValue: (value: number) => void
  setMaxValue: (value: number) => void
  handleKeyDown: (thumb: Thumb) => (e: React.KeyboardEvent) => void
  handlePointerDown: (thumb: Thumb) => (e: React.PointerEvent) => void
  handlePointerMove: (e: React.PointerEvent) => void
  handlePointerUp: () => void
  thumbAriaProps: (thumb: Thumb) => {
    role: 'slider'
    tabIndex: number
    'aria-label': string
    'aria-valuenow': number
    'aria-valuemin': number
    'aria-valuemax': number
    'aria-valuetext': string
  }
}

export function useRangeSlider({
  min,
  max,
  step = 1,
  stops,
  minLabel = 'Minimum value',
  maxLabel = 'Maximum value',
}: RangeSliderOptions): UseRangeSliderReturn {
  const [minValue, setMinRaw] = useState(min)
  const [maxValue, setMaxRaw] = useState(max)
  const [activeThumb, setActiveThumb] = useState<Thumb | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const minValueRef = useRef(minValue)
  const maxValueRef = useRef(maxValue)
  useEffect(() => {
    minValueRef.current = minValue
    maxValueRef.current = maxValue
  }, [minValue, maxValue])

  const setMinValue = (value: number) =>
    setMinRaw((prev) => {
      const clamped = clamp(value, min, maxValueRef.current)
      return clamped === prev ? prev : clamped
    })

  const setMaxValue = (value: number) =>
    setMaxRaw((prev) => {
      const clamped = clamp(value, minValueRef.current, max)
      return clamped === prev ? prev : clamped
    })

  function moveByStep(thumb: Thumb, direction: 1 | -1, multiplier = 1): void {
    const current = thumb === 'min' ? minValueRef.current : maxValueRef.current
    let next: number

    if (stops) {
      next = direction === 1 ? nextStop(current, stops) : prevStop(current, stops)
    } else {
      next = current + direction * step * multiplier
    }

    if (thumb === 'min') setMinValue(next)
    else setMaxValue(next)
  }

  function valueFromPointer(e: React.PointerEvent): number {
    const track = trackRef.current
    if (!track) return min
    const rect = track.getBoundingClientRect()
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const raw = min + ratio * (max - min)
    if (stops) return snapToNearest(raw, stops)
    return Math.round(raw / step) * step
  }

  function handleKeyDown(thumb: Thumb) {
    return (e: React.KeyboardEvent): void => {
      const handled: Record<string, () => void> = {
        ArrowRight: () => moveByStep(thumb, 1),
        ArrowUp:    () => moveByStep(thumb, 1),
        ArrowLeft:  () => moveByStep(thumb, -1),
        ArrowDown:  () => moveByStep(thumb, -1),
        PageUp:     () => { if (stops) moveByStep(thumb, 1); else moveByStep(thumb, 1, 10) },
        PageDown:   () => { if (stops) moveByStep(thumb, -1); else moveByStep(thumb, -1, 10) },
        Home: () => {
          if (thumb === 'min') setMinValue(min)
          else setMaxValue(minValueRef.current)
        },
        End: () => {
          if (thumb === 'min') setMinValue(maxValueRef.current)
          else setMaxValue(max)
        },
      }
      const handler = handled[e.key]
      if (handler) {
        e.preventDefault()
        handler()
      }
    }
  }

  function handlePointerDown(thumb: Thumb) {
    return (e: React.PointerEvent): void => {
      e.preventDefault()
      trackRef.current?.setPointerCapture(e.pointerId)
      setActiveThumb(thumb)
      setIsDragging(true)
    }
  }

  function handlePointerMove(e: React.PointerEvent): void {
    if (!isDragging || !activeThumb) return
    const value = valueFromPointer(e)
    if (activeThumb === 'min') setMinValue(value)
    else setMaxValue(value)
  }

  function handlePointerUp(): void {
    setActiveThumb(null)
    setIsDragging(false)
  }

  function thumbAriaProps(thumb: Thumb) {
    const value    = thumb === 'min' ? minValue : maxValue
    const thumbMin = thumb === 'min' ? min : minValue
    const thumbMax = thumb === 'min' ? maxValue : max
    const label    = thumb === 'min' ? minLabel : maxLabel

    return {
      role: 'slider' as const,
      tabIndex: 0,
      'aria-label': label,
      'aria-valuenow': value,
      'aria-valuemin': thumbMin,
      'aria-valuemax': thumbMax,
      'aria-valuetext': formatCurrency(value),
    }
  }

  return {
    minValue,
    maxValue,
    isDragging,
    activeThumb,
    trackRef,
    setMinValue,
    setMaxValue,
    handleKeyDown,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    thumbAriaProps,
  }
}
