import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      videoId, 
      chunkIndex, 
      totalChunks, 
      chunkData, 
      fileName, 
      sessionKey,
      isLastChunk 
    } = await request.json()

    // Store video chunk as transfer
    const transferData = {
      sender_id: user.id,
      receiver_id: null,
      type: 'video' as const,
      content: chunkData, // Base64 chunk data
      session_key: sessionKey || null,
      metadata: {
        video_id: videoId,
        chunk_index: chunkIndex,
        total_chunks: totalChunks,
        file_name: fileName,
        is_video_chunk: true,
        is_last_chunk: isLastChunk,
        streaming: true
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    const { data: transfer, error } = await supabase
      .from('transfers')
      .insert(transferData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      transfer,
      chunkIndex,
      videoId
    })

  } catch (error: any) {
    console.error('Video chunk error:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}
