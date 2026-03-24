interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-label="Error loading range"
      className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto p-6"
    >
      <p className="text-sm text-red-600 font-medium">{message}</p>
    </section>
  )
}
