import { formatCurrency } from '@/utils/formatCurrency'

interface ReadOnlyLabelProps {
  value: number
  label: string
}

export function ReadOnlyLabel({ value, label }: ReadOnlyLabelProps) {
  return (
    <span
      aria-label={`${label}: ${formatCurrency(value)}`}
      className="min-w-12 text-center text-sm font-medium text-gray-900 px-1"
    >
      {formatCurrency(value)}
    </span>
  )
}
