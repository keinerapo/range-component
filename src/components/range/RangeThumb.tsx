interface RangeThumbProps {
  role: 'slider'
  tabIndex: number
  'aria-label': string
  'aria-valuenow': number
  'aria-valuemin': number
  'aria-valuemax': number
  'aria-valuetext': string
  onKeyDown: (e: React.KeyboardEvent) => void
  onPointerDown: (e: React.PointerEvent) => void
  position: number
  isActive: boolean
}

export function RangeThumb({ position, isActive, ...thumbProps }: RangeThumbProps) {
  return (
    <div
      {...thumbProps}
      className={[
        'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
        'h-4 w-4 rounded-full bg-white border-2 border-gray-900',
        'shadow-sm transition-shadow duration-100',
        isActive ? 'shadow-md cursor-grabbing' : 'cursor-grab',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2',
        'z-10',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ left: `${position}%` }}
    />
  )
}
