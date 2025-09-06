import { NextResponse } from 'next/server'
import { chunkStore } from '@/lib/chunkStore'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uploadId = searchParams.get('uploadId')

    if (!uploadId) {
      return NextResponse.json({ error: 'Upload ID required' }, { status: 400 })
    }

    const upload = chunkStore.get(uploadId)
    if (!upload) {
      return NextResponse.json({ 
        found: false,
        error: 'Upload not found'
      })
    }

    return NextResponse.json({
      found: true,
      uploadId,
      fileName: upload.metadata.fileName,
      totalChunks: upload.metadata.totalChunks,
      uploadedChunks: upload.uploadedChunks.size,
      receivedChunks: Array.from(upload.uploadedChunks).sort((a, b) => a - b),
      isComplete: upload.uploadedChunks.size === upload.metadata.totalChunks,
      progress: (upload.uploadedChunks.size / upload.metadata.totalChunks) * 100
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}
