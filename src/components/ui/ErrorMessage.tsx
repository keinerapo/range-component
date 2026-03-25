interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-label="Error loading range"
      className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto p-6"
    >
      <p className="text-sm text-red-600 font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 cursor-pointer transition-colors duration-100"
        >
          Retry
        </button>
      )}
    </section>
  )
}
