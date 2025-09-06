import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionKey = searchParams.get('key')

    if (!sessionKey) {
      return NextResponse.json({ valid: false, error: 'Session key required' })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    // Check if session exists and hasn't expired
    const { data: session, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_key', sessionKey)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !session) {
      return NextResponse.json({ valid: false, error: 'Session not found or expired' })
    }

    // Update last_active timestamp
    await supabase
      .from('user_sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('id', session.id)

    return NextResponse.json({ 
      valid: true, 
      session: {
        id: session.id,
        created_at: session.created_at,
        expires_at: session.expires_at,
        device_info: session.device_info
      }
    })
  } catch (error: unknown) {
   const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}