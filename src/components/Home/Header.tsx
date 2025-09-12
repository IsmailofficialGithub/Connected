'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Moon, Sun, Menu, X, Shield, Users, Star 
} from 'lucide-react'

export default function ResponsiveHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visitorCount, setVisitorCount] = useState(9847)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Connected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Sun className="w-5 h-5" />
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Start Free
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`border-b transition-all duration-300 sticky top-0 z-50 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm' 
        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden xs:block">
              Connected
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent xs:hidden">
              C
            </span>
          </Link>

          {/* Live Counter - Hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-4">
            <Badge className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {visitorCount.toLocaleString()} online
            </Badge>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 text-sm lg:text-base"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 text-sm lg:text-base"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('security')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 text-sm lg:text-base"
            >
              Security
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hover:scale-110 transition-transform p-2"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
            
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform text-xs sm:text-sm">
                Sign In
              </Button>
            </Link>
            
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm px-3 sm:px-4">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Start Free</span>
                <span className="xs:hidden">Free</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Live Counter */}
              <div className="flex justify-center lg:hidden">
                <Badge className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {visitorCount.toLocaleString()} online
                </Badge>
              </div>
              
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 transition-transform"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 transition-transform"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('security')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 transition-transform"
              >
                Security
              </button>
              
              {/* Mobile Sign In */}
              <div className="pt-3 border-t dark:border-gray-700">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}