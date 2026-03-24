export function LoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading range slider"
      aria-busy="true"
      className="w-full animate-pulse"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-16 rounded bg-gray-200" />
        <div className="h-6 w-16 rounded bg-gray-200" />
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200" />
    </div>
  )
}
