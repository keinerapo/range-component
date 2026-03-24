/**
 * Snaps a value to the nearest entry in the sorted stops array.
 * @example snapToNearest(4, [1.99, 5.99, 10.99]) → 5.99
 */
export function snapToNearest(value: number, stops: number[]): number {
  if (stops.length === 0) return value
  return stops.reduce((closest, stop) =>
    Math.abs(stop - value) < Math.abs(closest - value) ? stop : closest
  )
}

/**
 * Returns the next stop after currentValue.
 * If currentValue is not in stops, snaps to nearest.
 * Returns the last stop if already at the end.
 */
export function nextStop(currentValue: number, stops: number[]): number {
  const idx = stops.indexOf(currentValue)
  if (idx === -1) return snapToNearest(currentValue, stops)
  return stops[Math.min(idx + 1, stops.length - 1)]
}

/**
 * Returns the previous stop before currentValue.
 * If currentValue is not in stops, snaps to nearest.
 * Returns the first stop if already at the beginning.
 */
export function prevStop(currentValue: number, stops: number[]): number {
  const idx = stops.indexOf(currentValue)
  if (idx === -1) return snapToNearest(currentValue, stops)
  return stops[Math.max(idx - 1, 0)]
}
