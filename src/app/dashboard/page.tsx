// src/app/dashboard/page.tsx (Updated with dynamic data)
'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { useAuth } from '@/lib/auth'
import { useRealtime } from '@/lib/realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Send, 
  History, 
  QrCode, 
  Smartphone, 
  Monitor, 
  Tablet,
  TrendingUp,
  Files,
  Image,
  Video,
  Code,
  Type,
  Download,
  Eye,
  Clock,
  Calendar,
  Users,
  Activity
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Database } from '@/types/supabase'

type Transfer = Database['public']['Tables']['transfers']['Row']

interface DashboardStats {
  totalTransfers: number
  todayTransfers: number
  totalFiles: number
  totalSize: number
  activeSessions: number
  mostUsedType: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { transfers, loading } = useRealtime()
  const [stats, setStats] = useState<DashboardStats>({
    totalTransfers: 0,
    todayTransfers: 0,
    totalFiles: 0,
    totalSize: 0,
    activeSessions: 0,
    mostUsedType: 'text'
  })
  const [recentActivity, setRecentActivity] = useState<Transfer[]>([])

  // Calculate dynamic stats from transfers
  useEffect(() => {
    if (transfers && transfers.length > 0) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const todayTransfers = transfers.filter(t => 
        new Date(t.created_at) >= today
      ).length

      const totalFiles = transfers.filter(t => 
        ['file', 'image', 'video'].includes(t.type)
      ).length

      const totalSize = transfers.reduce((acc, t) => 
        acc + (t.file_size || 0), 0
      )

      // Count transfer types
      const typeCounts = transfers.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const mostUsedType = Object.entries(typeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'text'

      // Get active sessions (unique session keys from last 24 hours)
      const activeSessions = new Set(
        transfers
          .filter(t => t.session_key && new Date(t.created_at) >= new Date(Date.now() - 24 * 60 * 60 * 1000))
          .map(t => t.session_key)
      ).size

      setStats({
        totalTransfers: transfers.length,
        todayTransfers,
        totalFiles,
        totalSize,
        activeSessions,
        mostUsedType
      })

      // Set recent activity (last 10 transfers)
      setRecentActivity(transfers.slice(0, 10))
    }
  }, [transfers])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTransferIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4 text-blue-600" />
      case 'text': return <Type className="w-4 h-4 text-green-600" />
      case 'image': return <Image className="w-4 h-4 text-purple-600" />
      case 'video': return <Video className="w-4 h-4 text-red-600" />
      case 'file': return <Files className="w-4 h-4 text-orange-600" />
      default: return <Files className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeDisplayName = (type: string) => {
    const names = {
      code: 'Code',
      text: 'Text',
      image: 'Image',
      video: 'Video',
      file: 'File'
    }
    return names[type as keyof typeof names] || type
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your data transfers
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Total</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">{stats.totalTransfers}</div>
                <div className="text-xs text-blue-600">All transfers</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Today</span>
                </div>
                <div className="text-2xl font-bold text-green-800">{stats.todayTransfers}</div>
                <div className="text-xs text-green-600">New today</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Files className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Files</span>
                </div>
                <div className="text-2xl font-bold text-purple-800">{stats.totalFiles}</div>
                <div className="text-xs text-purple-600">Uploaded</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Storage</span>
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {stats.totalSize > 0 ? formatFileSize(stats.totalSize) : '0 MB'}
                </div>
                <div className="text-xs text-orange-600">Used</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-pink-700">Sessions</span>
                </div>
                <div className="text-2xl font-bold text-pink-800">{stats.activeSessions}</div>
                <div className="text-xs text-pink-600">Active</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {getTransferIcon(stats.mostUsedType)}
                  <span className="text-sm font-medium text-indigo-700">Popular</span>
                </div>
                <div className="text-lg font-bold text-indigo-800 capitalize">
                  {getTypeDisplayName(stats.mostUsedType)}
                </div>
                <div className="text-xs text-indigo-600">Most used</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/transfer">
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg mb-2">Send Data</CardTitle>
                  <CardDescription>
                    Send text, code, files, or videos to your other devices
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/transfer?tab=qr">
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg mb-2">QR Code Sync</CardTitle>
                  <CardDescription>
                    Generate QR code to quickly connect mobile devices
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/guide">
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <History className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg mb-2">How It Works</CardTitle>
                  <CardDescription>
                    Learn how to use all features of the platform
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-700" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest data transfers
                  </CardDescription>
                </div>
                {recentActivity.length > 0 && (
                  <Link href="/transfer?tab=receive">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No transfers yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start by sending your first data transfer!
                  </p>
                  <Link href="/transfer">
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Send Something
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((transfer) => (
                    <div 
                      key={transfer.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransferIcon(transfer.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {transfer.file_name || `${getTypeDisplayName(transfer.type)} Transfer`}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {getTypeDisplayName(transfer.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(transfer.created_at)}</span>
                          </span>
                          {transfer.file_size && (
                            <span>{formatFileSize(transfer.file_size)}</span>
                          )}
                          {transfer.session_key && (
                            <Badge variant="secondary" className="text-xs">
                              QR Session
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={transfer.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {transfer.status}
                        </Badge>
                        {transfer.file_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(transfer.file_url!, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Progress */}
          {stats.totalSize > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>
                  Track your file storage and transfer limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Files Storage</span>
                      <span>{formatFileSize(stats.totalSize)} / 1 GB</span>
                    </div>
                    <Progress value={(stats.totalSize / (1024 * 1024 * 1024)) * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-lg">{stats.totalTransfers}</div>
                      <div className="text-muted-foreground">Total Transfers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">{stats.totalFiles}</div>
                      <div className="text-muted-foreground">Files Uploaded</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">{stats.activeSessions}</div>
                      <div className="text-muted-foreground">Active Sessions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}