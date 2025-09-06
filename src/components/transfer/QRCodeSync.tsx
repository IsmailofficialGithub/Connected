// components/transfer/QRCodeSync.tsx - SIMPLE VERSION THAT WORKS
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  QrCode,
  Smartphone,
  Monitor,
  Copy,
  RefreshCw,
  Share,
  Users,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import { useClipboard } from '@/hooks/useClipboard'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface QRCodeSyncProps {
  className?: string
  onSessionCreated?: (sessionKey: string) => void
}

export default function QRCodeSync({ className, onSessionCreated }: QRCodeSyncProps) {
  const { currentSessionKey, createSession, sessions, fetchSessions, loading } = useSession()
  const { copyToClipboard } = useClipboard()
  const [shareUrl, setShareUrl] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'connected'>('offline')

  // Generate QR code URL using online service (ALWAYS WORKS)
  const generateQRCodeUrl = (url: string) => {
    const encodedUrl = encodeURIComponent(url)
    // Primary service
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedUrl}&bgcolor=255-255-255&color=0-0-0&qzone=1&margin=10&format=png`
  }

  // Create new session
  const handleCreateSession = async () => {
    try {
      console.log('Creating session...')
      const session = await createSession({
        device_type: 'desktop',
        browser: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })

      console.log('Session created:', session)
      const url = `${window.location.origin}/receive/${session.session_key}`
      setShareUrl(url)
      console.log('Share URL:', url)
      
      onSessionCreated?.(session.session_key)
      toast.success('QR code generated! Scan with your mobile device.')
    } catch (error: any) {
      console.error('Session creation failed:', error)
      toast.error('Failed to create session: ' + error.message)
    }
  }

  // Copy share URL
  const handleCopyUrl = async () => {
    if (shareUrl) {
      try {
        await copyToClipboard(shareUrl)
        toast.success('Link copied to clipboard!')
      } catch (error) {
        // Fallback copy method
        navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied!')
      }
    }
  }

  // Refresh QR code
  const handleRefresh = async () => {
    if (currentSessionKey) {
      const url = `${window.location.origin}/receive/${currentSessionKey}`
      setShareUrl(url)
      toast.success('QR code refreshed')
    } else {
      await handleCreateSession()
    }
  }

  // Initialize on mount
  useEffect(() => {
    console.log('Component mounted, currentSessionKey:', currentSessionKey)
    if (currentSessionKey) {
      const url = `${window.location.origin}/receive/${currentSessionKey}`
      setShareUrl(url)
      setConnectionStatus('connected')
      console.log('Initialized with existing session')
    }
    fetchSessions()
  }, [currentSessionKey])

  // Update connection status
  useEffect(() => {
    if (currentSessionKey) {
      setConnectionStatus('connected')
    } else {
      setConnectionStatus('offline')
    }
  }, [currentSessionKey])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor(diff / 60000)
    
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getDeviceIcon = (deviceInfo: any) => {
    if (deviceInfo?.device_type === 'mobile' || deviceInfo?.userAgent?.includes('Mobile')) {
      return <Smartphone className="w-4 h-4" />
    }
    return <Monitor className="w-4 h-4" />
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main QR Code Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            QR Code Sync
          </CardTitle>
          <CardDescription>
            Generate a QR code to quickly connect your mobile devices and share data instantly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* No Session State */}
            {!currentSessionKey && !shareUrl ? (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
                  <QrCode className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Ready to Connect?</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate a QR code to instantly connect your mobile device
                  </p>
                </div>
                <Button
                  onClick={handleCreateSession}
                  disabled={loading}
                  size="lg"
                  className="w-full max-w-sm h-12"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </div>
            ) : (
              /* Active Session State */
              <div className="space-y-6">
                {/* QR Code Display */}
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
                    <Image
                    width={256}
                    height={256}
                      src={generateQRCodeUrl(shareUrl)}
                      alt="QR Code"
                      className="w-64 h-64 rounded-lg"
                      onLoad={() => console.log('QR code loaded successfully')}
                      onError={(e) => {
                        console.error('Primary QR service failed, trying backup')
                        // Backup QR service
                        const backupUrl = `https://chart.googleapis.com/chart?chs=256x256&cht=qr&chl=${encodeURIComponent(shareUrl)}&choe=UTF-8`
                        e.currentTarget.src = backupUrl
                        
                        e.currentTarget.onerror = () => {
                          console.error('Backup QR service also failed, using third service')
                          // Third backup
                          const thirdUrl = `https://quickchart.io/qr?text=${encodeURIComponent(shareUrl)}&size=256`
                          e.currentTarget.src = thirdUrl
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      📱 Scan with your phone camera
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      {connectionStatus === 'connected' ? (
                        <>
                          <Wifi className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Session Active</span>
                          <Badge variant="outline" className="text-xs">
                            {currentSessionKey?.slice(-8)}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">No Active Session</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share URL */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    📎 Or share this link directly:
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="font-mono text-sm bg-gray-50"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUrl}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareUrl && window.open(shareUrl, '_blank')}
                    disabled={!shareUrl}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Test Link
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">📋 How to connect:</p>
                  <div className="text-sm space-y-1">
                    <p>1. 📱 Open your phone camera app</p>
                    <p>2. 📷 Point it at the QR code above</p>
                    <p>3. 🔗 Tap the link notification that appears</p>
                    <p>4. 🚀 Start sharing data instantly!</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⏰ Session expires in 24 hours for security
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Debug Info (helpful for troubleshooting) */}
            {process.env.NODE_ENV === 'development' && (
              <Alert>
                <AlertDescription>
                  <p className="text-xs font-mono">
                    <strong>Debug:</strong><br/>
                    Session Key: {currentSessionKey || 'None'}<br/>
                    Share URL: {shareUrl || 'None'}<br/>
                    Status: {connectionStatus}
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Connected Devices ({sessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getDeviceIcon(session.device_info)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {session.device_info?.device_type === 'mobile' ? 'Mobile Device' : 'Desktop'}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(session.last_active)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {session.session_key.slice(-6)}
                    </Badge>
                    {session.session_key === currentSessionKey && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}