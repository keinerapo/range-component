/**
 * Formats a number as a currency string using the euro currency format.
 * Uses Intl.NumberFormat for locale-aware formatting (es-ES locale).
 * @example formatCurrency(5.99) → "5,99 €"
 * @example formatCurrency(100)  → "100,00 €"
 */
const formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function formatCurrency(value: number): string {
  return formatter.format(value)
}
