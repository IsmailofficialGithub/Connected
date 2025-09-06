import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

// POST - Manual cleanup of expired transfers and sessions
export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date().toISOString()

    // Delete expired transfers
    const { error: transferError } = await supabase
      .from('transfers')
      .delete()
      .lt('expires_at', now)
      .eq('sender_id', user.id)

    // Delete expired sessions
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', now)
      .eq('user_id', user.id)

    if (transferError || sessionError) {
      throw transferError || sessionError
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cleanup completed successfully' 
    })
  } catch (error: unknown) {
   const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}