// src/app/api/upload/chunk/route.ts (Fixed)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { chunkStore } from '@/lib/chunkStore'

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

    const formData = await request.formData()
    const chunk = formData.get('chunk') as Blob
    const uploadId = formData.get('uploadId') as string
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const fileName = formData.get('fileName') as string
    const fileHash = formData.get('fileHash') as string

    if (!chunk || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await chunk.arrayBuffer())

    // Initialize upload if not exists
    if (!chunkStore.has(uploadId)) {
      chunkStore.set(uploadId, {
        chunks: new Map(),
        metadata: { uploadId, chunkIndex, totalChunks, fileName, fileHash },
        uploadedChunks: new Set(),
        createdAt: new Date()
      })
    }

    const upload = chunkStore.get(uploadId)!
    upload.chunks.set(chunkIndex, buffer)
    upload.uploadedChunks.add(chunkIndex)

    console.log(`Received chunk ${chunkIndex}/${totalChunks} for ${fileName} (${buffer.length} bytes)`)

    return NextResponse.json({ 
      success: true, 
      chunkIndex,
      uploadedChunks: upload.uploadedChunks.size,
      totalChunks,
      uploadId
    })
  } catch (error: any) {
    console.error('Chunk upload error:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}

