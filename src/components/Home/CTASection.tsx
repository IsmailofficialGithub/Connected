'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import { 
  Zap, Play, CheckCircle 
} from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-3xl mx-auto text-white">
          <AnimatedElement direction="down" delay={0}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30 animate-bounce">
              🚀 Limited Time: Free Forever Plan Available
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={200}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transfer at 
              <span className="block bg-white text-transparent bg-clip-text">Lightning Speed?</span>
            </h2>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={400}>
            <p className="text-xl mb-8 opacity-90">
              Join <strong>50,000+ users</strong> who transfer data seamlessly across all their devices. 
              <span className="block mt-2 text-yellow-300">⚡ Setup takes 10 seconds • No credit card required</span>
            </p>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4 h-14 bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Transferring Now - FREE
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-14 border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all">
                  <Play className="w-5 h-5 mr-2" />
                  Watch 2-Min Demo
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          <AnimatedElement direction="left" delay={800}>
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Setup in 10 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </AnimatedElement>

          <AnimatedElement direction="right" delay={1000}>
            <p className="text-sm opacity-75">
              🎉 <strong>Special Launch Offer:</strong> Get Pro features free for 30 days
            </p>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}