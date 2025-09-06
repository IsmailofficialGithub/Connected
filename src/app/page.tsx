import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Zap, Smartphone, Code, FileText, Video } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Personal Data Transfer
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
              Made Simple & Secure
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Send text, code, files, images, and videos between your devices in real-time. 
            No more email attachments or USB drives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                End-to-end encryption with authentication required for all transfers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Real-Time Transfer</CardTitle>
              <CardDescription>
                Data starts transferring immediately - no waiting for uploads to complete
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Cross-Device</CardTitle>
              <CardDescription>
                Works seamlessly between desktop, mobile, and tablets with QR code sync
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Supported Data Types */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Transfer Any Type of Data
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-3">
              <Code className="w-8 h-8 text-blue-600" />
              <span className="font-medium">Code & Text</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <FileText className="w-8 h-8 text-green-600" />
              <span className="font-medium">Documents</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 bg-yellow-600 rounded"></div>
              <span className="font-medium">Images</span>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <Video className="w-8 h-8 text-purple-600" />
              <span className="font-medium">Videos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}