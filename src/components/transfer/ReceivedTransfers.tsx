// components/transfer/ReceivedTransfers.tsx (Updated to handle Cloudinary files)
'use client'

import { useState } from 'react'
import { useRealtime } from '@/lib/realtime'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Code, 
  Type, 
  Clock,
  User,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  File,
  ExternalLink,
  Play
} from 'lucide-react'
import { getLanguageDisplayName } from '@/utils/codeDetection'
import { Database } from '@/types/supabase'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Transfer = Database['public']['Tables']['transfers']['Row']

interface ReceivedTransfersProps {
  sessionKey?: string
  className?: string
}

export default function ReceivedTransfers({ sessionKey, className }: ReceivedTransfersProps) {
  const { transfers, loading, updateStatus } = useRealtime(sessionKey)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const handleCopy = async (transfer: Transfer) => {
    try {
      if (transfer.content) {
        await navigator.clipboard.writeText(transfer.content)
        setCopiedItems(prev => new Set([...prev, transfer.id]))
        toast.success('Copied to clipboard!')
      } else {
        toast.error('No content to copy')
      }
      
      // Update transfer status
      if (transfer.status === 'pending') {
        await updateStatus(transfer.id, 'completed')
      }
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(transfer.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = (transfer: Transfer) => {
    if (transfer.file_url) {
      const a = document.createElement('a')
      a.href = transfer.file_url
      a.download = transfer.file_name || 'download'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success('Download started!')
    } else {
      toast.error('No file URL available')
    }
  }

  const handleDelete = async (transfer: Transfer) => {
    try {
      const response = await fetch(`/api/delete-file?transferId=${transfer.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Transfer deleted')
      } else {
        toast.error('Failed to delete transfer')
      }
    } catch (error) {
      toast.error('Failed to delete transfer')
    }
  }

  const toggleExpanded = (transferId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(transferId)) {
        newSet.delete(transferId)
      } else {
        newSet.add(transferId)
      }
      return newSet
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getDeviceIcon = (metadata: any) => {
    if (metadata?.userAgent?.includes('Mobile')) {
      return <Smartphone className="w-4 h-4" />
    }
    return <Monitor className="w-4 h-4" />
  }

  const getTransferIcon = (transfer: Transfer) => {
    switch (transfer.type) {
      case 'code':
        return <Code className="w-4 h-4 text-blue-600" />
      case 'text':
        return <Type className="w-4 h-4 text-green-600" />
      case 'image':
        return <ImageIcon className="w-4 h-4 text-purple-600" />
      case 'video':
        return <Video className="w-4 h-4 text-red-600" />
      case 'file':
        return <File className="w-4 h-4 text-orange-600" />
      default:
        return <File className="w-4 h-4 text-gray-600" />
    }
  }

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ''
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCloudinaryThumbnail = (url: string, type: string) => {
    if (!url.includes('cloudinary.com')) return url
    
    // Extract public ID from Cloudinary URL
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/)
    if (!matches) return url
    
    const publicId = matches[1]
    const cloudName = url.match(/https:\/\/res\.cloudinary\.com\/([^\/]+)\//)?.[1]
    
    if (!cloudName) return url
    
    if (type === 'image') {
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_150,c_fill,q_auto/${publicId}.jpg`
    } else if (type === 'video') {
      return `https://res.cloudinary.com/${cloudName}/video/upload/w_200,h_150,c_fill,q_auto,f_jpg/${publicId}.jpg`
    }
    
    return url
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading transfers...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Received Transfers</span>
          <Badge variant="outline">
            {transfers.length} item{transfers.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
        <CardDescription>
          {sessionKey 
            ? `Session: ${sessionKey.slice(-8)}`
            : 'Recent transfers from your other devices'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No transfers received yet</p>
            <p className="text-xs mt-1">Transfers will appear here in real-time</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {transfers.map((transfer) => {
                const isExpanded = expandedItems.has(transfer.id)
                const isCopied = copiedItems.has(transfer.id)
                const isCode = transfer.type === 'code'
                const isFile = ['image', 'video', 'file'].includes(transfer.type)
                const metadata = transfer.metadata as any

                return (
                  <div
                    key={transfer.id}
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      transfer.status === 'pending' && "bg-blue-50 border-blue-200",
                      transfer.status === 'completed' && "bg-green-50 border-green-200"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTransferIcon(transfer)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm capitalize">
                              {transfer.type}
                            </span>
                            {metadata?.language && (
                              <Badge variant="outline" className="text-xs">
                                {getLanguageDisplayName(metadata.language)}
                              </Badge>
                            )}
                            {transfer.file_name && (
                              <Badge variant="outline" className="text-xs">
                                {transfer.file_name}
                              </Badge>
                            )}
                          </div>
                          {transfer.file_size && (
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(transfer.file_size)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {getDeviceIcon(metadata)}
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(transfer.created_at)}</span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    {transfer.content && (
                      <div className="mb-3">
                        <div
                          className={cn(
                            "p-3 bg-gray-50 rounded border text-sm",
                            isCode && "font-mono",
                            !isExpanded && "cursor-pointer"
                          )}
                          onClick={() => !isExpanded && toggleExpanded(transfer.id)}
                        >
                          {isExpanded ? (
                            <pre className="whitespace-pre-wrap overflow-x-auto">
                              {transfer.content}
                            </pre>
                          ) : (
                            <div className="relative">
                              <div className={cn(isCode && "font-mono")}>
                                {truncateContent(transfer.content || '', 150)}
                              </div>
                              {(transfer.content?.length || 0) > 150 && (
                                <div className="absolute bottom-0 right-0 bg-gradient-to-l from-gray-50 to-transparent pl-8">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleExpanded(transfer.id)
                                    }}
                                    className="text-xs h-6"
                                  >
                                    Show more
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* File Preview for Images/Videos */}
                    {isFile && transfer.file_url && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded border">
                          {transfer.type === 'image' && (
                            <Image
                            width={64}
                            height={48}
                              src={getCloudinaryThumbnail(transfer.file_url, 'image')}
                              alt={transfer.file_name || 'Image'}
                              className="w-16 h-12 object-cover rounded"
                              loading="lazy"
                            />
                          )}
                          {transfer.type === 'video' && (
                            <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden">
                              <Image
                              width={64}
                              height={48}
                                src={getCloudinaryThumbnail(transfer.file_url, 'video')}
                                alt={transfer.file_name || 'Video'}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white bg-black bg-opacity-50 rounded-full p-0.5" />
                              </div>
                            </div>
                          )}
                          {transfer.type === 'file' && (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <File className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">
                              {transfer.file_name || 'Untitled'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(transfer.file_size)}
                              {metadata?.cloudinary_format && ` • ${metadata.cloudinary_format.toUpperCase()}`}
                            </p>
                            {metadata?.cloudinary_width && metadata?.cloudinary_height && (
                              <p className="text-xs text-muted-foreground">
                                {metadata.cloudinary_width} × {metadata.cloudinary_height}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        {metadata?.character_count && (
                          <span>{metadata.character_count} chars</span>
                        )}
                        {metadata?.line_count && (
                          <span>• {metadata.line_count} lines</span>
                        )}
                        <Badge 
                          variant={transfer.status === 'pending' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {transfer.status}
                        </Badge>
                        {metadata?.cloudinary_public_id && (
                          <Badge variant="outline" className="text-xs">
                            Cloudinary
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {isExpanded && transfer.content && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(transfer.id)}
                            className="text-xs h-7"
                          >
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Less
                          </Button>
                        )}

                        {transfer.content && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(transfer)}
                            className="text-xs h-7"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 mr-1 text-green-600" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        )}

                        {transfer.file_url && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(transfer.file_url, '_blank')}
                              className="text-xs h-7"
                            >
                              {transfer.type === 'video' ? (
                                <>
                                  <Play className="w-3 h-3 mr-1" />
                                  Play
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(transfer)}
                              className="text-xs h-7"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transfer)}
                          className="text-xs h-7 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}