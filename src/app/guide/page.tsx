// src/app/guide/page.tsx - Complete Guide Page
'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play,
  QrCode,
  Smartphone,
  Monitor,
  Send,
  Download,
  Upload,
  Code,
  Image,
  Video,
  Files,
  Shield,
  Zap,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  BookOpen,
  PlayCircle,
  Camera,
  Wifi,
  Globe,
  Lock,
  RefreshCw,
  Mail
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function GuidePage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const handleDemoClick = (demoId: string) => {
    setActiveDemo(activeDemo === demoId ? null : demoId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Use Your Data Transfer Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn everything you need to know about transferring files, sharing code, 
            and syncing data across all your devices instantly.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="troubleshooting">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  What Is This Platform?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  This is a universal data transfer platform that works like <strong>"AirDrop for everything"</strong> - 
                  but it works between any devices: iPhone to Windows, Android to Mac, tablet to laptop, and more.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Instant Transfer</h3>
                    <p className="text-sm text-gray-600">Data appears on other devices in real-time</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Secure & Private</h3>
                    <p className="text-sm text-gray-600">All transfers are encrypted and auto-delete</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Cross-Platform</h3>
                    <p className="text-sm text-gray-600">Works on any device with a web browser</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-green-600" />
                  How It Works (30 Seconds)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Generate QR Code</h3>
                    <p className="text-sm text-gray-600">Click "QR Code" → "Generate" on your computer</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Scan with Phone</h3>
                    <p className="text-sm text-gray-600">Open camera → Point at QR → Tap notification</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Devices Connected</h3>
                    <p className="text-sm text-gray-600">Both devices are now linked together</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-600 font-bold text-lg">4</span>
                    </div>
                    <h3 className="font-semibold mb-2">Share Anything</h3>
                    <p className="text-sm text-gray-600">Send files, text, code instantly between devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You Can Transfer */}
            <Card>
              <CardHeader>
                <CardTitle>What Can You Transfer?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Code className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Code & Text</h4>
                      <p className="text-sm text-gray-600">Auto-detects 9+ programming languages</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Image className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Images</h4>
                      <p className="text-sm text-gray-600">Photos, screenshots, designs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Video className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Videos</h4>
                      <p className="text-sm text-gray-600">Stream while uploading (500KB packets)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Files className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Documents</h4>
                      <p className="text-sm text-gray-600">PDFs, Word docs, presentations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Download className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Any File Type</h4>
                      <p className="text-sm text-gray-600">Up to 100MB per file</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <QrCode className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Quick Links</h4>
                      <p className="text-sm text-gray-600">URLs, contact info, WiFi passwords</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="space-y-8">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>First time?</strong> Follow this step-by-step guide to get started in under 2 minutes!
              </AlertDescription>
            </Alert>

            {/* Step-by-Step Guide */}
            <div className="space-y-6">
              {/* Step 1 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    Create Your First Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">On Your Computer:</h4>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Go to the "Transfer" page
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Click the "QR Code" tab
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Click "Generate QR Code" button
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          QR code appears on your screen
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">On Your Phone:</h4>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-blue-600" />
                          Open your camera app
                        </li>
                        <li className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-blue-600" />
                          Point camera at the QR code
                        </li>
                        <li className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-blue-600" />
                          Tap the notification that appears
                        </li>
                        <li className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-blue-600" />
                          Your phone opens the session page
                        </li>
                      </ol>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <Wifi className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Success!</strong> Both devices are now connected and will sync data instantly.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    Send Your First Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDemoClick('text')}>
                      <div className="text-center">
                        <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium mb-2">Send Text/Code</h4>
                        <p className="text-xs text-gray-600">Type or paste content</p>
                        {activeDemo === 'text' && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-left">
                            <strong>Try this:</strong><br />
                            1. Go to "Text" tab<br />
                            2. Paste: console.log("Hello!")<br />
                            3. Click "Send"<br />
                            4. See it appear on your phone!
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDemoClick('file')}>
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium mb-2">Upload Files</h4>
                        <p className="text-xs text-gray-600">Drag & drop or click</p>
                        {activeDemo === 'file' && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-left">
                            <strong>Try this:</strong><br />
                            1. Go to "Files" tab<br />
                            2. Drop an image file<br />
                            3. Watch upload progress<br />
                            4. Download on other device!
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleDemoClick('video')}>
                      <div className="text-center">
                        <Video className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <h4 className="font-medium mb-2">Stream Videos</h4>
                        <p className="text-xs text-gray-600">Real-time streaming</p>
                        {activeDemo === 'video' && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-left">
                            <strong>Try this:</strong><br />
                            1. Go to "Video" tab<br />
                            2. Select a video file<br />
                            3. Watch streaming progress<br />
                            4. Play on other devices!
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    Pro Tips for Daily Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Speed Tips
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Keep one QR session active all day</li>
                        <li>• Use keyboard shortcut: Ctrl+Enter to send</li>
                        <li>• Drag files directly onto upload areas</li>
                        <li>• Copy-paste works for quick text sharing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        Security Tips
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Sessions expire after 24 hours automatically</li>
                        <li>• Files are deleted after 7 days</li>
                        <li>• Never share QR codes publicly</li>
                        <li>• Use private browser mode for sensitive data</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">You're All Set! 🎉</h3>
                <p className="text-gray-700 mb-4">
                  You now know the basics. Start transferring data between your devices instantly!
                </p>
                <Link href="/transfer">
                  <Button size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Start Transferring
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Text & Code Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Smart Text & Code Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Auto Language Detection</h4>
                        <p className="text-sm text-gray-600">Automatically detects JavaScript, Python, Java, HTML, CSS, SQL, and more</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Syntax Highlighting</h4>
                        <p className="text-sm text-gray-600">Code appears with proper formatting and colors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">One-Click Copy</h4>
                        <p className="text-sm text-gray-600">Copy entire code blocks to clipboard instantly</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    Perfect for developers
                  </Badge>
                </CardContent>
              </Card>

              {/* File Transfer Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Files className="w-5 h-5 text-purple-600" />
                    Advanced File Transfer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Drag & Drop Upload</h4>
                        <p className="text-sm text-gray-600">Simply drag files from your computer onto the website</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Auto Image Optimization</h4>
                        <p className="text-sm text-gray-600">Images are compressed and optimized automatically</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Global CDN Delivery</h4>
                        <p className="text-sm text-gray-600">Fast downloads from anywhere in the world</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    Powered by Cloudinary
                  </Badge>
                </CardContent>
              </Card>

              {/* Video Streaming */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-600" />
                    Video Streaming Technology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">500KB Packet Streaming</h4>
                        <p className="text-sm text-gray-600">Videos stream in real-time 500KB packets for instant viewing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Progressive Playback</h4>
                        <p className="text-sm text-gray-600">Start watching while the video is still uploading</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Auto Transcoding</h4>
                        <p className="text-sm text-gray-600">Videos are optimized for web playback automatically</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    Professional quality
                  </Badge>
                </CardContent>
              </Card>

              {/* QR Code System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-green-600" />
                    QR Code Connection System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Universal Compatibility</h4>
                        <p className="text-sm text-gray-600">Works with any phone camera - iPhone, Android, tablets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Multi-Device Sessions</h4>
                        <p className="text-sm text-gray-600">One QR code can connect multiple devices simultaneously</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Secure & Temporary</h4>
                        <p className="text-sm text-gray-600">Each session has unique keys and expires after 24 hours</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    Enterprise security
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ/Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-l-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-900">Q: QR code won't scan or doesn't work?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Solution:</strong> Make sure your phone camera can see the entire QR code clearly. 
                      Try refreshing the QR code or use the share link instead. Ensure both devices have internet connection.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-l-green-500 pl-4">
                    <h4 className="font-semibold text-green-900">Q: Files are not uploading or taking too long?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Solution:</strong> Check your internet connection. Files over 100MB are not supported. 
                      Try uploading smaller files first. Clear browser cache if problems persist.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-l-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-900">Q: Data not appearing on other devices?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Solution:</strong> Ensure both devices are connected to the same session (same QR code). 
                      Check that both devices show "Connected" status. Refresh the page if needed.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-l-orange-500 pl-4">
                    <h4 className="font-semibold text-orange-900">Q: Is my data secure and private?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Answer:</strong> Yes! All transfers are encrypted in transit. Files are automatically deleted after 7 days. 
                      Sessions expire after 24 hours. We never store or access your personal data.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-l-red-500 pl-4">
                    <h4 className="font-semibold text-red-900">Q: What file types and sizes are supported?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Answer:</strong> Almost all file types are supported including images, videos, documents, archives. 
                      Maximum file size is 100MB. For larger files, consider compressing them first.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-gray-700">
                    Can't find what you're looking for? We're here to help!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    <Link href="/transfer">
                      <Button>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Try It Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}