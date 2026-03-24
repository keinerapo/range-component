'use client'

import { useRangeSlider, type RangeSliderOptions } from '@/hooks/useRangeSlider'
import { RangeTrack } from './RangeTrack'
import { RangeThumb } from './RangeThumb'

export interface RangeLabelsApi {
  minValue: number
  maxValue: number
  setMinValue: (value: number) => void
  setMaxValue: (value: number) => void
}

interface RangeProps extends RangeSliderOptions {
  groupLabel?: string
  renderMinLabel?: (api: RangeLabelsApi) => React.ReactNode
  renderMaxLabel?: (api: RangeLabelsApi) => React.ReactNode
}

export function Range({
  min,
  max,
  step,
  stops,
  minLabel,
  maxLabel,
  groupLabel = 'Price range',
  renderMinLabel,
  renderMaxLabel,
}: RangeProps) {
  const slider = useRangeSlider({ min, max, step, stops, minLabel, maxLabel })

  const {
    minValue, maxValue, isDragging, activeThumb,
    trackRef, thumbAriaProps,
    handleKeyDown, handlePointerDown, handlePointerMove, handlePointerUp,
    setMinValue, setMaxValue,
  } = slider

  const toPercent = (v: number) => ((v - min) / (max - min)) * 100
  const minPercent = toPercent(minValue)
  const maxPercent = toPercent(maxValue)

  const labelsApi: RangeLabelsApi = { minValue, maxValue, setMinValue, setMaxValue }

  return (
    <div className="flex items-center gap-4">
      {renderMinLabel?.(labelsApi)}

      <div className="flex-1">
        <div
          role="group"
          aria-label={groupLabel}
          className={[
            'relative flex items-center w-full select-none py-3',
            isDragging ? 'cursor-grabbing' : '',
          ].filter(Boolean).join(' ')}
          data-testid="range-slider"
        >
          <RangeTrack
            trackRef={trackRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            minPercent={minPercent}
            maxPercent={maxPercent}
          >
            <RangeThumb
              {...thumbAriaProps('min')}
              onKeyDown={handleKeyDown('min')}
              onPointerDown={handlePointerDown('min')}
              position={minPercent}
              isActive={activeThumb === 'min'}
            />
            <RangeThumb
              {...thumbAriaProps('max')}
              onKeyDown={handleKeyDown('max')}
              onPointerDown={handlePointerDown('max')}
              position={maxPercent}
              isActive={activeThumb === 'max'}
            />
          </RangeTrack>
        </div>
      </div>

      {renderMaxLabel?.(labelsApi)}
    </div>
  )
}
