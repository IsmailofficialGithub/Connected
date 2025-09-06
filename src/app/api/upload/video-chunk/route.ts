import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

// Video streaming specific chunk handler
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

    const { videoId, chunkIndex, chunkData, totalChunks, sessionKey } = await request.json()

    // Store video chunk in realtime for immediate streaming
    const { error } = await supabase
      .from('transfers')
      .insert({
        sender_id: user.id,
        type: 'video',
        content: chunkData, // Base64 encoded chunk
        session_key: sessionKey,
        metadata: {
          video_id: videoId,
          chunk_index: chunkIndex,
          total_chunks: totalChunks,
          is_video_chunk: true,
          streaming: true
        },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true,
      chunkIndex,
      videoId 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}
