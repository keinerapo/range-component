import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorMessage } from './ErrorMessage'
import type { FetchState } from '@/types/fetch'

interface PageLayoutProps<T> {
  state: FetchState<T>
  onRetry?: () => void
  children: (data: T) => React.ReactNode
}

export function PageLayout<T>({ state, onRetry, children }: PageLayoutProps<T>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {state.status === 'loading' && <LoadingSkeleton />}
      {state.status === 'error' && (
        <ErrorMessage message={state.error} onRetry={onRetry} />
      )}
      {state.status === 'success' && children(state.data)}
    </main>
  )
}
