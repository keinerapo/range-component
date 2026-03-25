'use client'

import { Range } from '@/components/range/Range'
import { ReadOnlyLabel } from '@/components/range/ReadOnlyLabel'
import { PageLayout } from '@/components/ui/PageLayout'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useFixedRange } from '@/hooks/useFixedRange'
import { RANGE_LABELS } from '@/constants/labels'
import type { FixedRangeData } from '@/services/rangeService.types'
import Link from 'next/link'

function PageContent({ data }: { data: FixedRangeData }) {
  const stops = data.rangeValues

  if (!stops || stops.length < 2) {
    return <ErrorMessage message="Fixed range data is invalid." />
  }

  const absMin = stops[0]
  const absMax = stops[stops.length - 1]

  return (
    <section role="region" aria-labelledby="fixed-range-heading" className="w-full max-w-xl">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded"
        >
          ← Back to home
        </Link>
      </nav>
      <h2 id="fixed-range-heading" className="mb-6 text-lg font-semibold text-gray-900">
        Fixed Values
      </h2>

      <Range
        min={absMin}
        max={absMax}
        stops={stops}
        groupLabel="Fixed price range slider"
        minLabel={RANGE_LABELS.min}
        maxLabel={RANGE_LABELS.max}
        renderMinLabel={({ minValue }) => (
          <ReadOnlyLabel value={minValue} label={RANGE_LABELS.min} />
        )}
        renderMaxLabel={({ maxValue }) => (
          <ReadOnlyLabel value={maxValue} label={RANGE_LABELS.max} />
        )}
      />
    </section>
  )
}

export default function Exercise2Page() {
  const { refetch, ...state } = useFixedRange()

  return (
    <PageLayout state={state} onRetry={refetch}>
      {(data) => <PageContent data={data} />}
    </PageLayout>
  )
}
