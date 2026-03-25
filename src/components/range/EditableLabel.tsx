'use client'

import { useState, useRef, useEffect } from 'react'
import { clamp } from '@/utils/clamp'
import { formatCurrency } from '@/utils/formatCurrency'

interface EditableLabelProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  label: string
}

export function EditableLabel({ value, min, max, onChange, label }: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    setDraft(String(value))
    setIsEditing(true)
  }

  const commit = () => {
    const parsed = parseFloat(draft)
    const next = isNaN(parsed) ? value : clamp(parsed, min, max)
    if (next !== value) onChange(next)
    setIsEditing(false)
  }

  const revert = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={draft}
        min={min}
        max={max}
        aria-label={label}
        className="w-20 text-center text-sm font-medium text-gray-900 border border-gray-900 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') revert()
        }}
      />
    )
  }

  return (
    <button
      type="button"
      aria-label={`${label}: ${value}. Click to edit`}
      className="min-w-12 text-center text-sm font-medium text-gray-900 border border-transparent rounded px-1 py-0.5 hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 cursor-pointer transition-colors duration-100"
      onClick={startEditing}
    >
      {formatCurrency(value)}
    </button>
  )
}
