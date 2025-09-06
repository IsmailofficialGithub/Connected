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
  X,
  Cloud,
  Zap
} from 'lucide-react'
import { useRealtime } from '@/lib/realtime'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary-client'
import { openCloudinaryWidget } from '@/utils/cloudinaryWidget'
import { formatFileSize } from '@/utils/fileHandling'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface VideoUploadProps {
  sessionKey?: string
  className?: string
}

interface UploadingVideo {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  url?: string
  thumbnailUrl?: string
  error?: string
  cloudinaryResult?: any
}

export default function VideoUpload({ sessionKey, className }: VideoUploadProps) {
  const { sendTransfer } = useRealtime(sessionKey)
  const [uploadingVideos, setUploadingVideos] = useState<UploadingVideo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadVideo = async (file: File) => {
    const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const uploadingVideo: UploadingVideo = {
      id: videoId,
      file,
      progress: 0,
      status: 'uploading'
    }

    setUploadingVideos(prev => [...prev, uploadingVideo])

    try {
      // Upload directly to Cloudinary
      const result = await uploadToCloudinaryDirect(file, (progress) => {
        setUploadingVideos(prev => 
          prev.map(v => v.id === videoId ? { ...v, progress: Math.min(progress, 90) } : v)
        )
      })

      // Update status to processing
      setUploadingVideos(prev => 
        prev.map(v => v.id === videoId ? {
          ...v,
          status: 'processing',
          progress: 95,
          cloudinaryResult: result,
          url: result.secure_url,
          thumbnailUrl: result.secure_url.replace('/video/upload/', '/video/upload/w_300,h_200,c_fill,q_auto,f_jpg/')
        } : v)
      )

      // Create transfer record
      await sendTransfer({
        type: 'video',
        file_url: result.secure_url,
        file_name: file.name,
        file_size: file.size,
        metadata: {
          cloudinary_public_id: result.public_id,
          cloudinary_resource_type: result.resource_type,
          cloudinary_format: result.format,
          cloudinary_width: result.width,
          cloudinary_height: result.height,
          cloudinary_duration: result.duration,
          cloudinary_bytes: result.bytes,
          thumbnail_url: result.secure_url.replace('/video/upload/', '/video/upload/w_300,h_200,c_fill,q_auto,f_jpg/'),
          original_filename: file.name,
          mime_type: file.type,
          upload_method: 'direct_cloudinary'
        },
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })

      // Mark as completed
      setUploadingVideos(prev => 
        prev.map(v => v.id === videoId ? { 
          ...v, 
          status: 'completed',
          progress: 100
        } : v)
      )

      toast.success(`Video "${file.name}" uploaded successfully!`)

    } catch (error: any) {
      console.error('Video upload error:', error)
      setUploadingVideos(prev => 
        prev.map(v => v.id === videoId ? { 
          ...v, 
          status: 'error',
          error: error.message || 'Upload failed'
        } : v)
      )
      toast.error(`Failed to upload "${file.name}": ${error.message || 'Unknown error'}`)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      // Validate video file
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a video file`)
        return
      }

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 100MB)`)
        return
      }

      uploadVideo(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleWidgetUpload = () => {
    openCloudinaryWidget(
      async ( result) => {
        try {
          // Create transfer record for widget upload
          await sendTransfer({
            type: 'video',
            file_url: result.secure_url,
            file_name: result.original_filename || 'video',
            file_size: result.bytes,
            metadata: {
              cloudinary_public_id: result.public_id,
              cloudinary_resource_type: result.resource_type,
              cloudinary_format: result.format,
              cloudinary_width: result.width,
              cloudinary_height: result.height,
              cloudinary_duration: result.duration,
              cloudinary_bytes: result.bytes,
              thumbnail_url: result.secure_url.replace('/video/upload/', '/video/upload/w_300,h_200,c_fill,q_auto,f_jpg/'),
              original_filename: result.original_filename,
              upload_method: 'cloudinary_widget'
            },
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })

          toast.success('Video uploaded via widget successfully!')
        } catch (error: any) {
          toast.error(`Failed to save transfer: ${error.message}`)
        }
      },
      (error) => {
        toast.error(`Upload widget error: ${error.message}`)
      }
    )
  }

  const removeVideo = (id: string) => {
    setUploadingVideos(prev => prev.filter(v => v.id !== id))
  }

  const retryUpload = (video: UploadingVideo) => {
    removeVideo(video.id)
    uploadVideo(video.file)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Fast Video Upload
          </CardTitle>
          <CardDescription>
            Lightning-fast video uploads with real-time progress. No timeouts, no chunks needed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Upload Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleFileSelect}
                className="h-12 flex items-center justify-center space-x-2"
                variant="default"
              >
                <Upload className="w-4 h-4" />
                <span>Select Video File</span>
              </Button>

              <Button
                onClick={handleWidgetUpload}
                className="h-12 flex items-center justify-center space-x-2"
                variant="outline"
              >
                <Cloud className="w-4 h-4" />
                <span>Upload Widget</span>
                <Zap className="w-3 h-3 text-yellow-500" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Features Info */}
            <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">⚡ Why It's Fast</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Direct client-side upload</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No server bottlenecks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Real-time progress tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Auto video optimization</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploading Videos */}
      {uploadingVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uploading Videos ({uploadingVideos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadingVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                   
                      {video.thumbnailUrl ? (
                        <div className="relative w-16 h-12 bg-gray-100 rounded overflow-hidden">
                          <Image
                            width={64}
                            height={48}
                            src={video.thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white bg-black bg-opacity-50 rounded-full p-0.5" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-purple-100 rounded flex items-center justify-center">
                          <Video className="w-6 h-6 text-purple-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{video.file.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(video.file.size)}</span>
                          <Badge variant="outline" className="text-xs">
                            {video.file.type.split('/')[1]?.toUpperCase()}
                          </Badge>
                          {video.cloudinaryResult?.duration && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(video.cloudinaryResult.duration)}s
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {video.status === 'completed' && (
                        <div className="flex items-center space-x-2">
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
                        </div>
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

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {video.status === 'uploading' && (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="font-medium">Uploading...</span>
                          </>
                        )}
                        {video.status === 'processing' && (
                          <>
                            <Video className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">Processing video...</span>
                          </>
                        )}
                        {video.status === 'completed' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Upload complete!</span>
                          </>
                        )}
                      </div>
                      <span>{Math.round(video.progress)}%</span>
                    </div>

                    <Progress value={video.progress} className="h-2" />

                    {video.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {video.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Info */}
      {sessionKey && (
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            Session: {sessionKey.slice(-8)} • Videos shared instantly via QR code
          </div>
        </div>
      )}
    </div>
  )
}