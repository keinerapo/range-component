import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ min: 1, max: 100 })
}
