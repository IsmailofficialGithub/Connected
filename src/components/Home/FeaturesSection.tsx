'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import Link from 'next/link'
import { 
  Heart, Zap, Globe, Shield, Code, Video, Users, Sparkles 
} from 'lucide-react'

export default function FeaturesSection() {
 const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "10x faster than email. Data appears instantly with zero lag.",
      highlight: "Average transfer: 2.3 seconds",
      color: "blue"
    },
    {
      icon: Globe,
      title: "Universal Compatibility", 
      description: "Works between any devices: iPhone ↔ Windows, Android ↔ Mac, any browser.",
      highlight: "Supports all platforms",
      color: "green"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "End-to-end encryption + auto-delete. We never see your data.",
      highlight: "256-bit encryption",
      color: "purple"
    },
    {
      icon: Code,
      title: "Smart Code Detection",
      description: "Auto-detects 9+ languages with syntax highlighting and formatting.",
      highlight: "Perfect for developers",
      color: "orange"
    },
    {
      icon: Video,
      title: "Instant Video Streaming",
      description: "Start watching while uploading. No waiting for large files.",
      highlight: "Stream while uploading",
      color: "red"
    },
    {
      icon: Users,
      title: "Multi-Device Sessions",
      description: "Connect unlimited devices simultaneously. Perfect for teams.",
      highlight: "Unlimited connections",
      color: "indigo"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string, icon: string, highlight: string } } = {
      blue: { bg: "from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50", icon: "text-blue-600 dark:text-blue-400", highlight: "text-blue-500 dark:text-blue-400" },
      green: { bg: "from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50", icon: "text-green-600 dark:text-green-400", highlight: "text-green-500 dark:text-green-400" },
      purple: { bg: "from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50", icon: "text-purple-600 dark:text-purple-400", highlight: "text-purple-500 dark:text-purple-400" },
      orange: { bg: "from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50", icon: "text-orange-600 dark:text-orange-400", highlight: "text-orange-500 dark:text-orange-400" },
      red: { bg: "from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50", icon: "text-red-600 dark:text-red-400", highlight: "text-red-500 dark:text-red-400" },
      indigo: { bg: "from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50", icon: "text-indigo-600 dark:text-indigo-400", highlight: "text-indigo-500 dark:text-indigo-400" }
    }
    return colors[color] || colors.blue
  }

  return (
    <section id="features" className="w-full py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 px-2">
            <AnimatedElement direction="down" delay={0}>
              <Badge variant="outline" className="mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500 animate-pulse text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
                <Heart className="w-3 h-3 mr-1" />
                Loved by 50,000+ users worldwide
              </Badge>
            </AnimatedElement>
            
            <AnimatedElement direction="up" delay={200}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-2">
                Why Choose Connected?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                The most advanced cross-platform data transfer solution
              </p>
            </AnimatedElement>
          </div>

          {/* Features Grid - Fixed layout */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
              {features.map((feature, index) => {
                const colors = getColorClasses(feature.color)
                const direction = index % 2 === 0 ? 'left' : 'right'
                const Icon = feature.icon
                
                return (
                  <AnimatedElement key={feature.title} direction={direction} delay={index * 100}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 h-full">
                      <CardContent className="p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col justify-between">
                        <div>
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform animate-pulse`} style={{animationDelay: `${index * 100}ms`}}>
                            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${colors.icon}`} />
                          </div>
                          <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                        <div className={`text-xs sm:text-sm font-medium ${colors.highlight} mt-2`}>
                          ⚡ {feature.highlight}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedElement>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <AnimatedElement direction="up" delay={800}>
            <div className="text-center mt-12 sm:mt-16 px-4">
              <div className="inline-block w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Ready to Experience the Speed?
                </h3>
                <Link href="/auth/signup">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all shadow-lg animate-pulse text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start Free Trial - No Signup Required
                  </Button>
                </Link>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Join 50,000+ satisfied users
                </p>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}