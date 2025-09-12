'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import { 
  Zap, Play, Timer, Star, Users, Shield, Award, Target 
} from 'lucide-react'

export default function HeroSection() {
   const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    { name: "Sarah Chen", role: "Senior Developer", company: "TechCorp", text: "Saves me 2+ hours daily. No more email attachments!" },
    { name: "Mike Rodriguez", role: "Designer", company: "Creative Studio", text: "Finally, seamless file transfer between all my devices." },
    { name: "Lisa Thompson", role: "Product Manager", company: "StartupXYZ", text: "Game-changer for our remote team collaboration." }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full max-w-7xl mx-auto text-center">
          {/* Urgency Badge */}
          <AnimatedElement direction="down" delay={0}>
            <div className="mb-4 sm:mb-6 flex justify-center px-2">
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500 animate-bounce text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 max-w-full">
                <Timer className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">🔥 Limited Time: Free Forever Plan • No Credit Card Required</span>
              </Badge>
            </div>
          </AnimatedElement>

          {/* Main Heading */}
          <AnimatedElement direction="up" delay={200}>
            <div className="mb-4 sm:mb-6 px-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block mb-2">Share Data Between</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 block animate-pulse">
                  Any Devices
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl block mt-3 sm:mt-4">
                  In <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">2 Seconds</span>
                </span>
              </h1>
            </div>
          </AnimatedElement>

          {/* Enhanced Subtitle */}
          <AnimatedElement direction="up" delay={400}>
            <div className="mb-6 sm:mb-8 px-4">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                The <strong>world's fastest</strong> data transfer platform. Works like <strong>AirDrop for everything</strong> - 
                iPhone, Android, Windows, Mac. <span className="text-green-500 font-bold">10x faster</span> than email.
              </p>
            </div>
          </AnimatedElement>

          {/* Social Proof Numbers */}
          <AnimatedElement direction="left" delay={600}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 px-2">
              <div className="text-center min-w-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-500">2.3M+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Files Transferred</div>
              </div>
              <div className="text-center min-w-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500">50k+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Happy Users</div>
              </div>
              <div className="text-center min-w-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-500">99.9%</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </AnimatedElement>

          {/* Enhanced CTA Buttons */}
          <AnimatedElement direction="up" delay={800}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
              <Link href="/auth/signup" className="w-full sm:w-auto max-w-sm sm:max-w-none">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Start Transferring Now - FREE</span>
                </Button>
              </Link>
              <Link href="/demo" className="w-full sm:w-auto max-w-sm sm:max-w-none">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 h-11 sm:h-12 lg:h-14 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Watch 2-Min Demo</span>
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          {/* Testimonial Rotation */}
          <AnimatedElement direction="right" delay={1000}>
            <div className="max-w-2xl mx-auto px-4">
              <div className="p-4 sm:p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-500 shadow-lg">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-lg italic mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{testimonials[currentTestimonial].name}</span>
                  <span> • {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</span>
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Trust Indicators */}
          <AnimatedElement direction="up" delay={1200}>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                <span>99.9% Success Rate</span>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
