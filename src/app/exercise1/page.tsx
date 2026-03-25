'use client'

import { Range } from '@/components/range/Range'
import { EditableLabel } from '@/components/range/EditableLabel'
import { PageLayout } from '@/components/ui/PageLayout'
import { useNormalRange } from '@/hooks/useNormalRange'
import { RANGE_LABELS } from '@/constants/labels'
import type { NormalRangeData } from '@/services/rangeService.types'
import Link from 'next/link'

function PageContent({ data }: { data: NormalRangeData }) {
  return (
    <section role="region" aria-labelledby="normal-range-heading" className="w-full max-w-xl">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded"
        >
          ← Back to home
        </Link>
      </nav>
      <h2 id="normal-range-heading" className="mb-6 text-lg font-semibold text-gray-900">
        Normal Range
      </h2>

      <Range
        min={data.min}
        max={data.max}
        step={1}
        groupLabel="Price range slider"
        minLabel={RANGE_LABELS.min}
        maxLabel={RANGE_LABELS.max}
        renderMinLabel={({ minValue, maxValue, setMinValue }) => (
          <EditableLabel
            value={minValue}
            min={data.min}
            max={maxValue}
            onChange={setMinValue}
            label={RANGE_LABELS.min}
          />
        )}
        renderMaxLabel={({ minValue, maxValue, setMaxValue }) => (
          <EditableLabel
            value={maxValue}
            min={minValue}
            max={data.max}
            onChange={setMaxValue}
            label={RANGE_LABELS.max}
          />
        )}
      />
    </section>
  )
}

export default function Exercise1Page() {
  const { refetch, ...state } = useNormalRange()

  return (
    <PageLayout state={state} onRetry={refetch}>
      {(data) => <PageContent data={data} />}
    </PageLayout>
  )
}
