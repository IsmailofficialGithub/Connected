// components/layout/DashboardHeader.tsx (Updated with theme toggle)
'use client'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogOut, User, Send, History, QrCode, Zap, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">DataSync</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/dashboard" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/transfer" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
            <span>Transfer</span>
          </Link>
          <Link 
            href="/guide" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
          >
            <History className="w-4 h-4" />
            <span>Guide</span>
          </Link>
        </nav>

        {/* Right side - Theme Toggle + User Menu */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {getInitials(user?.user_metadata?.full_name || user?.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/transfer?tab=qr" className="flex items-center">
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Sync
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/guide" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Help & Guide
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t px-4 py-2">
        <nav className="flex items-center justify-around">
          <Link 
            href="/dashboard" 
            className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link 
            href="/transfer" 
            className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="text-xs">Transfer</span>
          </Link>
          <Link 
            href="/guide" 
            className="flex flex-col items-center space-y-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span className="text-xs">Guide</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}