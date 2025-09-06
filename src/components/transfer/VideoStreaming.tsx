// components/transfer/VideoStreaming.tsx (Fixed and Simplified)
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
  Pause,
  Volume2,
  VolumeX,
  Download,
  X
} from 'lucide-react'
import { useRealtime } from '@/lib/realtime'
import { formatFileSize, chunkFile } from '@/utils/fileHandling'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface VideoStreamingProps {
  sessionKey?: string
  className?: string
}

interface StreamingVideo {
  id: string
  file: File
  status: 'uploading' | 'streaming' | 'completed' | 'error'
  progress: number
  totalChunks: number
  sentChunks: number
  url?: string
  error?: string
}

interface ReceivedVideo {
  id: string
  fileName: string
  totalChunks: number
  receivedChunks: number
  chunks: Map<number, string>
  status: 'receiving' | 'completed' | 'error'
  url?: string
}

const CHUNK_SIZE = 500 * 1024 // 500KB chunks as specified

export default function VideoStreaming({ sessionKey, className }: VideoStreamingProps) {
  const { transfers, sendTransfer } = useRealtime(sessionKey)
  const [streamingVideos, setStreamingVideos] = useState<StreamingVideo[]>([])
  const [receivedVideos, setReceivedVideos] = useState<ReceivedVideo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Stream video using Cloudinary + packet streaming hybrid approach
  const streamVideo = async (file: File) => {
    const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      const streamingVideo: StreamingVideo = {
        id: videoId,
        file,
        status: 'uploading',
        progress: 0,
        totalChunks: 0,
        sentChunks: 0
      }

      setStreamingVideos(prev => [...prev, streamingVideo])
      toast.success('Starting video upload and streaming...')

      // First, upload the full video to Cloudinary for quality and backup
      const formData = new FormData()
      formData.append('file', file)
      if (sessionKey) {
        formData.append('sessionKey', sessionKey)
      }

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.error || 'Upload failed')
      }

      const uploadResult = await uploadResponse.json()
      
      // Update status to streaming
      setStreamingVideos(prev => 
        prev.map(v => v.id === videoId ? {
          ...v,
          status: 'streaming',
          url: uploadResult.cloudinary.secure_url,
          progress: 50 // Upload complete, now streaming
        } : v)
      )

      // Now create streaming chunks for real-time viewing
      const { chunks } = await chunkFile(file, CHUNK_SIZE)
      
      setStreamingVideos(prev => 
        prev.map(v => v.id === videoId ? {
          ...v,
          totalChunks: chunks.length
        } : v)
      )

      // Send chunks for real-time streaming
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        
        // Convert chunk to base64
        const chunkData = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(chunk)
        })

        // Send chunk via realtime
        await fetch('/api/upload/video-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId,
            chunkIndex: i,
            totalChunks: chunks.length,
            chunkData,
            fileName: file.name,
            sessionKey,
            isLastChunk: i === chunks.length - 1,
            cloudinaryUrl: uploadResult.cloudinary.secure_url // Include the full quality URL
          })
        })

        // Update progress
        const streamingProgress = 50 + ((i + 1) / chunks.length) * 50 // 50-100%
        setStreamingVideos(prev => 
          prev.map(v => v.id === videoId ? { 
            ...v, 
            progress: streamingProgress,
            sentChunks: i + 1
          } : v)
        )

        // Small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Mark as completed
      setStreamingVideos(prev => 
        prev.map(v => v.id === videoId ? { 
          ...v, 
          status: 'completed',
          progress: 100
        } : v)
      )

      toast.success(`Video "${file.name}" uploaded and streamed successfully!`)

    } catch (error: any) {
      console.error('Video streaming error:', error)
      setStreamingVideos(prev => 
        prev.map(v => v.id === videoId ? { 
          ...v, 
          status: 'error',
          error: error.message
        } : v)
      )
      toast.error(`Failed to stream video: ${error.message}`)
    }
  }

  const handleVideoSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate video file
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a video file`)
        continue
      }

      // Check file size (max 500MB for video streaming)
      if (file.size > 500 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 500MB)`)
        continue
      }

      streamVideo(file)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeVideo = (id: string) => {
    setStreamingVideos(prev => prev.filter(v => v.id !== id))
  }

  const retryStream = (video: StreamingVideo) => {
    removeVideo(video.id)
    streamVideo(video.file)
  }

  // Process received video transfers
  const videoTransfers = transfers.filter(t => 
    t.type === 'video' && 
    t.metadata?.is_video_chunk
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Video Upload & Streaming
          </CardTitle>
          <CardDescription>
            Upload videos with dual streaming: instant 500KB packets + high-quality Cloudinary backup
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleVideoSelect}
              className="w-full"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Video to Upload
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">🚀 Advanced Video Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-800">
                <div>• 500KB packet streaming for instant playback</div>
                <div>• Cloudinary optimization & transcoding</div>
                <div>• Progressive download while viewing</div>
                <div>• Global CDN delivery</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streaming Videos */}
      {streamingVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uploading Videos ({streamingVideos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streamingVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{video.file.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(video.file.size)}</span>
                          {video.totalChunks > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {video.sentChunks}/{video.totalChunks} packets
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
                              Watch
                            </Button>
                          )}
                        </div>
                      )}
                      {video.status === 'error' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryStream(video)}
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
                            <span className="font-medium">Uploading to Cloudinary...</span>
                          </>
                        )}
                        {video.status === 'streaming' && (
                          <>
                            <Video className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">Streaming packets...</span>
                          </>
                        )}
                        {video.status === 'completed' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Complete!</span>
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

      {/* Received Video Chunks */}
      {videoTransfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Streaming Videos ({videoTransfers.length} packets)</CardTitle>
            <CardDescription>
              Video packets being received in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videoTransfers.slice(0, 5).map((transfer) => (
                <div key={transfer.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        {transfer.metadata?.file_name || 'Video Stream'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Packet {transfer.metadata?.chunk_index + 1} / {transfer.metadata?.total_chunks}
                      </Badge>
                    </div>
                    {transfer.metadata?.cloudinaryUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(transfer.metadata.cloudinaryUrl, '_blank')}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Watch Full Quality
                      </Button>
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
            Session: {sessionKey.slice(-8)} • Videos shared via QR code with dual streaming
          </div>
        </div>
      )}
    </div>
  )
}