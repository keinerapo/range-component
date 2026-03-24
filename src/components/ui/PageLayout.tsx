import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorMessage } from './ErrorMessage'

type FetchState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }

interface PageLayoutProps<T> {
  state: FetchState<T>
  children: (data: T) => React.ReactNode
}

export function PageLayout<T>({ state, children }: PageLayoutProps<T>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {state.status === 'loading' && <LoadingSkeleton />}
      {state.status === 'error' && <ErrorMessage message={state.error} />}
      {state.status === 'success' && children(state.data)}
    </main>
  )
}
