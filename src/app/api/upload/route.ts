import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'
// import { createClient } from '@/lib/SupabaseServer'
export async function POST(request: NextRequest) {
  try {
    // const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
    
   
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sessionKey = formData.get('sessionKey') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`)

    // Validate file
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
      }, { status: 400 })
    }

    // Determine resource type and folder
    let resourceType: 'image' | 'video' | 'raw' = 'raw'
    let folder = 'data-transfer/files'

    if (file.type.startsWith('image/')) {
      resourceType = 'image'
      folder = 'data-transfer/images'
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video'
      folder = 'data-transfer/videos'
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique public ID
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const publicId = `${user.id}/${timestamp}_${randomStr}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(buffer, {
      folder,
      resource_type: resourceType,
      public_id: publicId,
      quality: resourceType === 'image' ? 'auto' : undefined
    })

    
    // Create transfer record in database
    const transferData = {
      sender_id: user.id,
      receiver_id: null,
      type: resourceType === 'raw' ? 'file' : resourceType as 'image' | 'video' | 'file',
      file_url: cloudinaryResult.secure_url,
      file_name: file.name,
      file_size: file.size,
      session_key: sessionKey || null,
      metadata: {
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_resource_type: cloudinaryResult.resource_type,
        original_filename: file.name,
        mime_type: file.type,
        upload_timestamp: timestamp,
        file_extension: file.name.split('.').pop()?.toLowerCase(),
        cloudinary_format: cloudinaryResult.format,
        cloudinary_width: cloudinaryResult.width,
        cloudinary_height: cloudinaryResult.height,
        cloudinary_bytes: cloudinaryResult.bytes
      },
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }
    const { data: transfer, error: dbError } = await supabase
      .from('transfers')
      .insert(transferData)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save transfer record: ' + dbError.message 
      }, { status: 500 })
    }


    return NextResponse.json({
      success: true,
      transfer,
      cloudinary: {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
        resource_type: cloudinaryResult.resource_type
      }
    })

  } catch (error: unknown) {
   const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

