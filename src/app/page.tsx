import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Range Component</h1>
      <nav aria-label="Exercise pages" className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/exercise1"
          className="rounded-lg bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors text-center"
        >
          Exercise 1 — Normal Range
        </Link>
        <Link
          href="/exercise2"
          className="rounded-lg bg-purple-600 px-8 py-4 text-white font-semibold hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-colors text-center"
        >
          Exercise 2 — Fixed Values
        </Link>
      </nav>
    </main>
  )
}
