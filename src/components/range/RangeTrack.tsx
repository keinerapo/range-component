import { ReactNode, RefObject } from "react"

interface RangeTrackProps {
  trackRef: RefObject<HTMLDivElement | null>
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: () => void
  minPercent: number
  maxPercent: number
  children: ReactNode
}

export function RangeTrack({ trackRef, onPointerMove, onPointerUp, minPercent, maxPercent, children }: RangeTrackProps) {
  return (
    <div
      ref={trackRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-testid="range-track"
      className="relative h-1.5 w-full rounded-full bg-gray-300 cursor-default touch-none"
    >
      <div
        data-testid="range-fill"
        className="absolute h-full rounded-full bg-gray-900"
        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
