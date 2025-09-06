// components/transfer/FileTransfer.tsx (Fixed and Simplified)
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload,
  File,
  Image,
  Video,
  Archive,
  FileText,
  X,
  Check,
  Loader2,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'
import {  formatFileSize } from '@/utils/fileHandling'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  sessionKey?: string
  className?: string
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
  transfer?: any
}

export default function FileTransfer({ sessionKey, className }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6 text-blue-600" />
    if (file.type.startsWith('video/')) return <Video className="w-6 h-6 text-purple-600" />
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="w-6 h-6 text-green-600" />
    if (file.type.includes('zip') || file.type.includes('archive')) return <Archive className="w-6 h-6 text-orange-600" />
    return <File className="w-6 h-6 text-gray-600" />
  }

   const simulateProgress = (uploadingFile: UploadingFile) => {
    const interval = setInterval(() => {
      setUploadingFiles(prev => 
        prev.map(f => {
          if (f.id === uploadingFile.id && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 15, 95)
            return { ...f, progress: newProgress }
          }
          return f
        })
      )
    }, 500)

    // Clear interval after upload completes
    setTimeout(() => clearInterval(interval), 10000)
  }

  const uploadFiles = async (uploadingFile: UploadingFile) => {
    const formData = new FormData()
    formData.append('file', uploadingFile.file)
    if (sessionKey) {
      formData.append('sessionKey', sessionKey)
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadingFile.id ? {
          ...f,
          status: 'completed',
          progress: 100,
          url: result.cloudinary.secure_url,
          transfer: result.transfer
        } : f)
      )

      toast.success(`${uploadingFile.file.name} uploaded successfully!`)
      
    } catch (error: any) {
      console.error('Upload failed:', error)
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadingFile.id ? {
          ...f,
          status: 'error',
          error: error.message
        } : f)
      )
      toast.error(`Failed to upload ${uploadingFile.file.name}: ${error.message}`)
    }
  }

 

  const handleFileUpload = async (files: File[]) => {
    const newUploads: UploadingFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadingFiles(prev => [...prev, ...newUploads])

    // Process each file
    for (const uploadFile of newUploads) {
      simulateProgress(uploadFile)
      await uploadFiles(uploadFile)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDragActive(false)
    
    // Validate files
    const validFiles = acceptedFiles.filter(file => {
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 100MB)`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      handleFileUpload(validFiles)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB max
  })

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id))
  }

  const retryUpload = async (uploadFile: UploadingFile) => {
    setUploadingFiles(prev => 
      prev.map(f => f.id === uploadFile.id ? { 
        ...f, 
        status: 'uploading',
        progress: 0,
        error: undefined 
      } : f)
    )
    simulateProgress(uploadFile)
    await uploadFiles(uploadFile)
  }

  const deleteFile = async (uploadFile: UploadingFile) => {
    if (!uploadFile.transfer) return

    try {
      const response = await fetch(`/api/delete-file?transferId=${uploadFile.transfer.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        removeFile(uploadFile.id)
        toast.success('File deleted successfully')
      } else {
        toast.error('Failed to delete file')
      }
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          File & Media Upload
        </CardTitle>
        <CardDescription>
          Upload images, videos, documents, and files. Powered by Cloudinary for fast, reliable delivery.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            (dragActive || isDragActive) 
              ? "border-blue-500 bg-blue-50 scale-105" 
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              (dragActive || isDragActive) ? "bg-blue-200" : "bg-blue-100"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-colors",
                (dragActive || isDragActive) ? "text-blue-700" : "text-blue-600"
              )} />
            </div>
            <div>
              <p className="text-lg font-medium">
                {dragActive || isDragActive ? "Drop files here!" : "Upload files"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports images, videos, documents • Max 100MB per file
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <File className="w-4 h-4" />
              Files ({uploadingFiles.length})
            </h4>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadingFiles.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className={cn(
                    "border rounded-lg p-4 space-y-3 transition-colors",
                    uploadFile.status === 'completed' && "bg-green-50 border-green-200",
                    uploadFile.status === 'error' && "bg-red-50 border-red-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(uploadFile.file)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{uploadFile.file.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(uploadFile.file.size)}</span>
                          <Badge variant="outline" className="text-xs">
                            {uploadFile.file.type.split('/')[0] || 'file'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {uploadFile.status === 'completed' && (
                        <div className="flex space-x-1">
                          {uploadFile.url && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => window.open(uploadFile.url, '_blank')}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                  const a = document.createElement('a')
                                  a.href = uploadFile.url!
                                  a.download = uploadFile.file.name
                                  a.click()
                                }}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                      {uploadFile.status === 'error' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => retryUpload(uploadFile)}
                        >
                          Retry
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => uploadFile.status === 'completed' 
                          ? deleteFile(uploadFile) 
                          : removeFile(uploadFile.id)
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'uploading' && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {uploadFile.status === 'completed' && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="capitalize font-medium">
                          {uploadFile.status}
                        </span>
                      </div>
                      <span>{Math.round(uploadFile.progress)}%</span>
                    </div>

                    <Progress value={uploadFile.progress} className="h-2" />

                    {uploadFile.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {uploadFile.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">✨ Powered by Cloudinary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-800">
            <div>• Automatic image optimization</div>
            <div>• Video transcoding & streaming</div>
            <div>• Global CDN delivery</div>
            <div>• Real-time file processing</div>
          </div>
        </div>

        {/* Session Info */}
        {sessionKey && (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Session: {sessionKey.slice(-8)} • Files shared via QR code
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}