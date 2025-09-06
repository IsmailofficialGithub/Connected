// src/app/api/upload/direct/route.ts - Direct upload for small files
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
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploadId = formData.get('uploadId') as string

    if (!file || !uploadId) {
      return NextResponse.json({ error: 'Missing file or upload ID' }, { status: 400 })
    }

    // Validate file size (max 5MB for direct upload)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large for direct upload. Use chunked upload instead.' 
      }, { status: 400 })
    }

    const fileExtension = file.name.split('.').pop() || 'bin'
    const timestamp = Date.now()
    const storagePath = `uploads/${user.id}/${timestamp}-${uploadId}.${fileExtension}`

    // Upload directly to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(storagePath)

    return NextResponse.json({
      success: true,
      uploadId,
      fileUrl: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      originalSize: file.size,
      compressed: false,
      storagePath,
      method: 'direct'
    })
  } catch (error: any) {
    console.error('Direct upload error:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}