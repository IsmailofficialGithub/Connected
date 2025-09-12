'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import { 
  Zap, Shield, Users, Star 
} from 'lucide-react'

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="py-12 px-4 bg-gray-900 text-white">
      <div className="container mx-auto">
        <div className="text-center">
          <AnimatedElement direction="up" delay={0}>
            <div className="flex items-center justify-center space-x-2 mb-4 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Connected
              </span>
            </div>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={200}>
            <p className="text-gray-400 mb-6">
              Universal data transfer for the modern world • Trusted by 50k+ users
            </p>
          </AnimatedElement>
          
          <AnimatedElement direction="left" delay={400}>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-6">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-white transition-colors hover:scale-105"
              >
                How It Works
              </button>
              <Link href="/auth/login" className="hover:text-white transition-colors hover:scale-105">
                Sign In
              </Link>
              <button className="hover:text-white transition-colors hover:scale-105">Privacy Policy</button>
              <button className="hover:text-white transition-colors hover:scale-105">Terms of Service</button>
              <button className="hover:text-white transition-colors hover:scale-105">Support</button>
            </div>
          </AnimatedElement>
          
          <AnimatedElement direction="right" delay={600}>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:scale-105 transition-transform">
                <Shield className="w-3 h-3 mr-1" />
                99.9% Uptime
              </Badge>
              <Badge variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:scale-105 transition-transform">
                <Users className="w-3 h-3 mr-1" />
                50k+ Users
              </Badge>
              <Badge variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:scale-105 transition-transform">
                <Star className="w-3 h-3 mr-1" />
                4.9/5 Rating
              </Badge>
            </div>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={800}>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
              © 2024 Connected. Built with ❤️ for seamless data transfer. • Made by developers, for everyone.
            </div>
          </AnimatedElement>
        </div>
      </div>
    </footer>
  )
}