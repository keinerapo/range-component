/**
 * Clamps a number between min and max (inclusive).
 * @example clamp(150, 1, 100) → 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
