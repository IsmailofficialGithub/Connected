// If you want the SIMPLEST solution with no extra packages:
// components/transfer/SimpleVideoUpload.tsx

'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Video,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  Play,
  X
} from 'lucide-react'
import { useRealtime } from '@/lib/realtime'
import { formatFileSize } from '@/utils/fileHandling'
import { toast } from 'react-hot-toast'

interface SimpleVideoUploadProps {
  sessionKey?: string
  className?: string
}

interface UploadingVideo {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}

export default function SimpleVideoUpload({ sessionKey, className }: SimpleVideoUploadProps) {
  const { sendTransfer } = useRealtime(sessionKey)
  const [uploadingVideos, setUploadingVideos] = useState<UploadingVideo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadVideoSimple = async (file: File) => {
    const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const uploadingVideo: UploadingVideo = {
      id: videoId,
      file,
      progress: 0,
      status: 'uploading'
    }

    setUploadingVideos(prev => [...prev, uploadingVideo])

    try {
      // Simple direct upload to Cloudinary (no server involved)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'data-transfer') // You need to create this in Cloudinary
      formData.append('folder', 'data-transfer/videos')
      formData.append('resource_type', 'video')

      // Direct upload with progress tracking
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadingVideos(prev => 
            prev.map(v => v.id === videoId ? { ...v, progress } : v)
          )
        }
      })
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText)
            resolve(result)
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'))
        })

        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timed out'))
        })

        xhr.timeout = 0 // No timeout
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${"dzkoeyx3s"}/video/upload`)
        xhr.send(formData)
      })

      const result = await uploadPromise

      // Create transfer record
      await sendTransfer({
        type: 'video',
        file_url: result.secure_url,
        file_name: file.name,
        file_size: file.size,
        metadata: {
          cloudinary_public_id: result.public_id,
          cloudinary_format: result.format,
          cloudinary_width: result.width,
          cloudinary_height: result.height,
          cloudinary_duration: result.duration,
          cloudinary_bytes: result.bytes,
          upload_method: 'simple_direct'
        },
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })

      setUploadingVideos(prev => 
        prev.map(v => v.id === videoId ? { 
          ...v, 
          status: 'completed',
          progress: 100,
          url: result.secure_url
        } : v)
      )

      toast.success(`Video uploaded successfully!`)

    } catch (error: any) {
      console.error('Video upload error:', error)
      setUploadingVideos(prev => 
        prev.map(v => v.id === videoId ? { 
          ...v, 
          status: 'error',
          error: error.message
        } : v)
      )
      toast.error(`Upload failed: ${error.message}`)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a video file`)
        return
      }

      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 100MB)`)
        return
      }

      uploadVideoSimple(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeVideo = (id: string) => {
    setUploadingVideos(prev => prev.filter(v => v.id !== id))
  }

  const retryUpload = (video: UploadingVideo) => {
    removeVideo(video.id)
    uploadVideoSimple(video.file)
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Simple Video Upload
          </CardTitle>
          <CardDescription>
            Direct upload to Cloudinary - no timeouts, no server processing needed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={handleFileSelect}
            className="w-full h-12"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Video Files
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Status */}
          {uploadingVideos.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploading Videos ({uploadingVideos.length})</h4>
              {uploadingVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Video className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-medium">{video.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(video.file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {video.status === 'completed' && (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          {video.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(video.url, '_blank')}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                          )}
                        </>
                      )}
                      {video.status === 'error' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryUpload(video)}
                        >
                          Retry
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideo(video.id)}
                        className="text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center space-x-2">
                        {video.status === 'uploading' && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        <span className="capitalize">{video.status}</span>
                      </span>
                      <span>{Math.round(video.progress)}%</span>
                    </div>
                    <Progress value={video.progress} className="h-2" />
                    {video.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{video.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Required:</strong> Create an unsigned upload preset named "data-transfer" 
              in your Cloudinary dashboard for this to work.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

// SUPER SIMPLE 5-MINUTE SETUP GUIDE:

/*
1. Go to cloudinary.com and create a free account
2. In dashboard, go to Settings > Upload
3. Click "Add upload preset"
4. Name it: "data-transfer"
5. Set Mode to: "Unsigned"  
6. Set Folder to: "data-transfer"
7. Save it

8. Add to your .env.local:
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

9. Replace your video component with this SimpleVideoUpload

That's it! Videos will upload directly to Cloudinary without any server timeouts.
*/