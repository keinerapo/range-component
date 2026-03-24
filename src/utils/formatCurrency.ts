/**
 * Formats a number as a currency string with the euro symbol.
 * Integers are shown without decimals; floats are shown with 2 decimal places.
 * @example formatCurrency(5.99) → "5.99 €"
 * @example formatCurrency(100)  → "100 €"
 */
export function formatCurrency(value: number): string {
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return `${formatted} €`
}
