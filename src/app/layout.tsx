import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Connected - Universal Data Transfer Platform',
    template: '%s | Connected'
  },
  description: 'Share data between any devices instantly. iPhone, Android, Windows, Mac - AirDrop for everything. 10x faster than email.',
  keywords: ['data transfer', 'file sharing', 'cross-platform', 'universal', 'AirDrop alternative', 'instant transfer'],
  authors: [{ name: 'Connected Team' }],
  creator: 'Connected',
  publisher: 'Connected',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://connected.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://connected.app',
    title: 'Connected - Universal Data Transfer Platform',
    description: 'Share data between any devices instantly. 10x faster than email.',
    siteName: 'Connected',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Connected - Universal Data Transfer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connected - Universal Data Transfer Platform',
    description: 'Share data between any devices instantly. 10x faster than email.',
    images: ['/og-image.jpg'],
    creator: '@connected_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Analytics />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: '',
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}