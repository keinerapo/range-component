export function LoadingSkeleton() {
  return (
    <section className="w-full max-w-xl animate-pulse" role="status" aria-label="Loading range slider" aria-busy="true">
      <div className="mb-8 h-4 w-24 rounded bg-gray-200" />
      <div className="mb-6 h-6 w-36 rounded bg-gray-200" />
      <div className="flex items-center gap-4">
        <div className="h-6 w-12 rounded bg-gray-200 shrink-0" />
        <div className="flex-1 py-3">
          <div className="h-1.5 w-full rounded-full bg-gray-200" />
        </div>
        <div className="h-6 w-12 rounded bg-gray-200 shrink-0" />
      </div>
    </section>
  )
}
