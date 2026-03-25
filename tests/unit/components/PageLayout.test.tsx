import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLayout } from '@/components/ui/PageLayout'

describe('PageLayout', () => {
  it('renders the loading skeleton when status is loading', () => {
    render(<PageLayout state={{ status: 'loading' }}>{() => null}</PageLayout>)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('renders the error message when status is error', () => {
    render(
      <PageLayout state={{ status: 'error', error: 'Something went wrong' }}>
        {() => null}
      </PageLayout>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders children with data when status is success', () => {
    render(
      <PageLayout state={{ status: 'success', data: { value: 42 } }}>
        {(data) => <span data-testid="content">{data.value}</span>}
      </PageLayout>
    )
    expect(screen.getByTestId('content')).toHaveTextContent('42')
  })

  it('wraps content in a centred full-height main element', () => {
    render(<PageLayout state={{ status: 'loading' }}>{() => null}</PageLayout>)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen')
  })

  it('renders a retry button in error state when onRetry is provided', () => {
    render(
      <PageLayout
        state={{ status: 'error', error: 'Failed' }}
        onRetry={vi.fn()}
      >
        {() => null}
      </PageLayout>
    )
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('does not render a retry button in error state when onRetry is not provided', () => {
    render(
      <PageLayout state={{ status: 'error', error: 'Failed' }}>
        {() => null}
      </PageLayout>
    )
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })
})
