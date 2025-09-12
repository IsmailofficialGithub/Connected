'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import Link from 'next/link'
import { 
  Clock, QrCode, Smartphone, Wifi, Zap 
} from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: QrCode,
      title: "Generate QR Code",
      description: "One click creates a secure connection code",
      highlight: "1 click",
      color: "from-blue-500 to-blue-600",
      badgeColor: "from-blue-600 to-purple-600"
    },
    {
      number: 2, 
      icon: Smartphone,
      title: "Scan & Connect",
      description: "Point camera, tap notification - instant connection",
      highlight: "2 seconds",
      color: "from-green-500 to-green-600", 
      badgeColor: "from-green-600 to-blue-600"
    },
    {
      number: 3,
      icon: Wifi,
      title: "Devices Linked", 
      description: "All devices now sync in real-time",
      highlight: "Auto-sync",
      color: "from-purple-500 to-purple-600",
      badgeColor: "from-purple-600 to-pink-600"
    },
    {
      number: 4,
      icon: Zap,
      title: "Transfer Anything",
      description: "Files appear instantly on all connected devices", 
      highlight: "Instant",
      color: "from-pink-500 to-red-500",
      badgeColor: "from-pink-600 to-red-600"
    }
  ]

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <AnimatedElement direction="down" delay={0}>
            <Badge variant="outline" className="mb-4 bg-white/80 dark:bg-gray-800/80 animate-bounce text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
              <Clock className="w-3 h-3 mr-1" />
              ⚡ Setup in 10 seconds
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={200}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Connect any devices instantly and start sharing data at <span className="text-green-500 font-bold">lightning speed</span>
            </p>
          </AnimatedElement>
        </div>

        {/* Enhanced Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, index) => {
              const direction = index % 2 === 0 ? 'left' : 'right'
              const Icon = step.icon
              
              return (
                <AnimatedElement key={step.number} direction={direction} delay={index * 200}>
                  <div className="text-center group">
                    <div className="relative mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow animate-pulse`} style={{animationDelay: `${index * 200}ms`}}>
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${step.badgeColor} rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm animate-bounce`} style={{animationDelay: `${index * 200}ms`}}>
                        {step.number}
                      </div>
                      <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {step.highlight}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-2">{step.description}</p>
                  </div>
                </AnimatedElement>
              )
            })}
          </div>

          {/* CTA in How It Works */}
          <AnimatedElement direction="up" delay={800}>
            <div className="text-center mt-10 sm:mt-12">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all shadow-lg animate-pulse text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Try It Now - Takes 10 Seconds
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}