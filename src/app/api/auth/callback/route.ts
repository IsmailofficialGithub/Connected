import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (!code) {
    return NextResponse.json({ ok: false, error: 'Missing code' }, { status: 400 })
  }

  // TODO: Exchange the code with your auth provider and set cookies/session.
  // For now, just acknowledge and redirect target can be handled client-side.
  return NextResponse.json({ ok: true, code, next })
} 