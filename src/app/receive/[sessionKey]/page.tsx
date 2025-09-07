// src/app/receive/[sessionKey]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRealtime } from '@/lib/realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import TextTransfer from '@/components/transfer/TextTransfer'
import FileTransfer from '@/components/transfer/FileTransfer'
import ReceivedTransfers from '@/components/transfer/ReceivedTransfers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Smartphone,
  Monitor,
  QrCode,
  Send,
  Inbox,
  Upload,
  Users,
  CheckCircle,
  AlertCircle,
  Wifi
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function ReceivePage() {
  const params = useParams()
  const { user } = useAuth()
  const sessionKey = params.sessionKey as string
  const [sessionValid, setSessionValid] = useState<boolean | null>(null)
  const [connectedDevices, setConnectedDevices] = useState<number>(1)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  // Use realtime with session key
  const { transfers, loading, onlineUsers } = useRealtime(sessionKey)

  // Validate session on mount
 useEffect(() => {
  const validateSession = async () => {
    try {
      if (!sessionKey || sessionKey.length < 10) {
        setSessionValid(false)
        return
      }
      setSessionValid(true)
      toast.success('Connected to session successfully!')
    } catch (error) {
      setSessionValid(false)
      toast.error('Failed to validate session')
    }
  }

  if (sessionKey) {
    validateSession()
  }
}, [sessionKey])

  // Update connected devices count based on online users
  useEffect(() => {
    const deviceCount = Object.keys(onlineUsers).length
    setConnectedDevices(Math.max(1, deviceCount))
  }, [onlineUsers])

  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return 'mobile'
    }
    return 'desktop'
  }

  const formatSessionKey = (key: string) => {
    return key.slice(-8).toUpperCase()
  }

  if (sessionValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Connecting to session...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sessionValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Session Invalid</CardTitle>
            <CardDescription>
              This session has expired or doesn't exist. Please scan a new QR code or check the link.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR Session</h1>
                <p className="text-sm text-muted-foreground">
                  Session: {formatSessionKey(sessionKey)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">Connected</span>
              </div>

              {/* Connected Devices */}
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{connectedDevices} device{connectedDevices !== 1 ? 's' : ''}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    You're connected! Send and receive data instantly.
                  </p>
                  <p className="text-sm mt-1">
                    This session will expire in 24 hours for your security.
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  {getDeviceType() === 'mobile' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Monitor className="w-4 h-4" />
                  )}
                  <span className="capitalize">{getDeviceType()}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{transfers.length}</div>
              <div className="text-sm text-muted-foreground">Transfers</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{connectedDevices}</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
              <div className="text-sm text-muted-foreground">Status</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">24h</div>
              <div className="text-sm text-muted-foreground">Expires</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Receive
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Files
            </TabsTrigger>
          </TabsList>

          {/* Send Tab */}
          <TabsContent value="send" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <TextTransfer sessionKey={sessionKey} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Info</CardTitle>
                  <CardDescription>Details about this QR session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="font-mono">{formatSessionKey(sessionKey)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Device Type:</span>
                      <span className="capitalize">{getDeviceType()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Connected Devices:</span>
                      <span>{connectedDevices}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>

                  {/* Share Session */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const url = window.location.href
                        navigator.clipboard.writeText(url)
                        toast.success('Session URL copied!')
                      }}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Share Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Receive Tab */}
          <TabsContent value="receive">
            <ReceivedTransfers sessionKey={sessionKey}  />
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <FileTransfer sessionKey={sessionKey} />
          </TabsContent>
        </Tabs>

        {/* Mobile-specific tips */}
        {getDeviceType() === 'mobile' && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Smartphone className="w-5 h-5" />
                Mobile Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-blue-800">
              <p>• Add this page to your home screen for quick access</p>
              <p>• Use the camera to scan QR codes from other devices</p>
              <p>• Files uploaded here will sync to your desktop instantly</p>
            </CardContent>
          </Card>
        )}

        {/* Desktop-specific tips */}
        {getDeviceType() === 'desktop' && (
          <Card className="mt-8 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Monitor className="w-5 h-5" />
                Desktop Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-purple-800">
              <p>• Drag and drop files directly onto upload areas</p>
              <p>• Use keyboard shortcuts: Ctrl+Enter to send</p>
              <p>• Generate new QR codes to connect more devices</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}