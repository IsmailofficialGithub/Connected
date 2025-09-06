// src/app/api/upload/finalize/route.ts (Fixed)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { chunkStore } from '@/lib/chunkStore'

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

    const { uploadId, fileName, fileSize, fileType, totalChunks, fileHash } = await request.json()

    if (!uploadId || !fileName || !fileSize || !totalChunks) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get upload from store
    const upload = chunkStore.get(uploadId)
    if (!upload) {
      return NextResponse.json({ error: 'Upload not found. Chunks may have expired.' }, { status: 404 })
    }

    // Verify all chunks are uploaded
    if (upload.uploadedChunks.size !== totalChunks) {
      return NextResponse.json({ 
        error: `Missing chunks. Expected ${totalChunks}, got ${upload.uploadedChunks.size}`,
        received: Array.from(upload.uploadedChunks).sort((a, b) => a - b),
        missing: Array.from({ length: totalChunks }, (_, i) => i).filter(i => !upload.uploadedChunks.has(i))
      }, { status: 400 })
    }

    console.log(`Finalizing upload: ${fileName} with ${totalChunks} chunks`)

    // Combine chunks in correct order
    const sortedChunks: Buffer[] = []
    for (let i = 0; i < totalChunks; i++) {
      const chunk = upload.chunks.get(i)
      if (!chunk) {
        return NextResponse.json({ 
          error: `Missing chunk ${i}` 
        }, { status: 400 })
      }
      sortedChunks.push(chunk)
    }

    const completeFile = Buffer.concat(sortedChunks)
    console.log(`Combined file size: ${completeFile.length} bytes`)

    // Upload to Supabase Storage
    const fileExtension = fileName.split('.').pop() || 'bin'
    const timestamp = Date.now()
    const storagePath = `uploads/${user.id}/${timestamp}-${uploadId}.${fileExtension}`

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, completeFile, {
        contentType: fileType || 'application/octet-stream',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ 
        error: `Storage upload failed: ${uploadError.message}` 
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(storagePath)

    // Clean up chunk store
    chunkStore.delete(uploadId)
    console.log(`Upload completed: ${publicUrl}`)

    return NextResponse.json({
      success: true,
      uploadId,
      fileUrl: publicUrl,
      fileName,
      fileSize: completeFile.length,
      originalSize: fileSize,
      fileHash,
      compressed: fileSize !== completeFile.length,
      storagePath
    })
  } catch (error: any) {
    console.error('Finalize upload error:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}
