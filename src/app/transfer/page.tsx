// src/app/transfer/page.tsx (Updated with file support)
"use client";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardHeader from "@/components/layout/DashboardHeader";
import TextTransfer from "@/components/transfer/TextTransfer";
const FileTransfer = dynamic(
  () => import("@/components/transfer/FileTransfer"),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading File Upload...</span>
          </div>,
  },
);
const QRCodeSync = dynamic(
  () => import("@/components/transfer/QRCodeSync"),
  {
    ssr: false,
    loading: () =>  <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading Qr Code...</span>
          </div>,
  },
);
const SimpleVideoUpload = dynamic(
  () => import("@/components/transfer/SimpleVideoUpload"),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading Video...</span>
          </div>,
  },
);
const ReceivedTransfers = dynamic(
  () => import("@/components/transfer/ReceivedTransfers"),
  {
    ssr: false,
    loading: () =>  <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading Received Transfer...</span>
          </div>,
  },
);
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Send,
  Inbox,
  Upload,
  Video,
  QrCode,
  Zap,
  Shield,
  FileText,
  Image,
} from "lucide-react";


export default function TransferPage() {
  const [activeSessionKey, setActiveSessionKey] = useState<string | null>(null);

  const handleSessionCreated = (sessionKey: string) => {
    setActiveSessionKey(sessionKey);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Data Transfer Hub
                </h1>
                <p className="text-gray-600">
                  Send text, code, files, images, and videos instantly across
                  your devices
                </p>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <Card className="border-0 bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-3 text-center">
                  <FileText className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-blue-700">
                    Text & Code
                  </div>
                  <div className="text-xs text-blue-600">Smart detection</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100">
                <CardContent className="p-3 text-center">
                  <Upload className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-green-700">
                    File Upload
                  </div>
                  <div className="text-xs text-green-600">Drag & drop</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="p-3 text-center">
                  <Video className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-purple-700">
                    Video Stream
                  </div>
                  <div className="text-xs text-purple-600">500KB packets</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100">
                <CardContent className="p-3 text-center">
                  <Image className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-orange-700">
                    Images
                  </div>
                  <div className="text-xs text-orange-600">Auto compress</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-pink-50 to-pink-100">
                <CardContent className="p-3 text-center">
                  <QrCode className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-pink-700">QR Sync</div>
                  <div className="text-xs text-pink-600">Mobile connect</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-r from-indigo-50 to-indigo-100">
                <CardContent className="p-3 text-center">
                  <Zap className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-indigo-700">
                    Real-time
                  </div>
                  <div className="text-xs text-indigo-600">Instant sync</div>
                </CardContent>
              </Card>
            </div>

            {/* Active Session Indicator */}
            {activeSessionKey && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">
                        QR Session Active
                      </p>
                      <p className="text-sm text-green-700">
                        Session: {activeSessionKey.slice(-8)} • Data will be
                        shared via QR code
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-300"
                  >
                    Connected
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Main Transfer Interface */}
          <Tabs defaultValue="text" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Files</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </TabsTrigger>
              <TabsTrigger value="receive" className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                <span className="hidden sm:inline">Receive</span>
              </TabsTrigger>
            </TabsList>

            {/* Text & Code Tab */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <TextTransfer sessionKey={activeSessionKey || undefined} />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Text & Code Features
                    </CardTitle>
                    <CardDescription>
                      Advanced text and code transfer capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">
                          AI
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Smart Code Detection
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Automatically detects 9+ programming languages with
                          confidence scores
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Real-time Sync</p>
                        <p className="text-xs text-muted-foreground">
                          Text appears on all your devices instantly via
                          WebSocket
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-3 h-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Syntax Highlighting
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Code is formatted with proper syntax highlighting and
                          indentation
                        </p>
                      </div>
                    </div>

                    {/* Supported Languages */}
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">
                        Supported Languages:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {[
                          "JavaScript",
                          "Python",
                          "Java",
                          "C++",
                          "HTML",
                          "CSS",
                          "SQL",
                          "JSON",
                          "TypeScript",
                        ].map((lang) => (
                          <Badge
                            key={lang}
                            variant="outline"
                            className="text-xs"
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-6">
              <FileTransfer sessionKey={activeSessionKey || undefined} />
            </TabsContent>

            {/* Video Tab */}
            <TabsContent value="video" className="space-y-6">
              <SimpleVideoUpload sessionKey={activeSessionKey || undefined} />
            </TabsContent>

            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-6">
              <QRCodeSync onSessionCreated={handleSessionCreated} />
            </TabsContent>

            {/* Receive Tab */}
            <TabsContent value="receive" className="space-y-6">
              <ReceivedTransfers sessionKey={activeSessionKey || undefined} />
            </TabsContent>
          </Tabs>

          {/* Global Features Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>End-to-end encryption for all transfers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Authentication required for access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Auto-deletion after 24 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No data stored on third-party servers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Performance Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Real-time WebSocket connections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Automatic image compression</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Video streaming in 500KB packets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Progressive file uploading</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Simple steps to transfer data between your devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Select text, code, files, or videos to transfer
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Auto-Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Smart algorithms detect content type and optimize transfer
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Instant Transfer</h3>
                  <p className="text-sm text-muted-foreground">
                    Data streams in real-time to all your connected devices
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Receive & Use</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy, download, or use the transferred content immediately
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
