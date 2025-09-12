'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import { 
  TrendingUp, Code, Video, FileText, CheckCircle 
} from 'lucide-react'

export default function UseCasesSection() {
  const useCases = [
    {
      icon: Code,
      title: "For Developers",
      subtitle: "Save 2+ hours daily",
      color: "blue",
      benefits: [
        "Share code snippets with syntax highlighting",
        "Test on real mobile devices instantly", 
        "Transfer API keys securely",
        "Debug across multiple platforms"
      ]
    },
    {
      icon: Video,
      title: "For Creators",
      subtitle: "10x faster workflow",
      color: "purple", 
      benefits: [
        "Transfer photos from phone to PC instantly",
        "Share large video files without compression",
        "Sync design assets across devices",
        "Real-time collaboration with team"
      ]
    },
    {
      icon: FileText,
      title: "For Business",
      subtitle: "Enterprise secure",
      color: "green",
      benefits: [
        "Share presentations securely",
        "Transfer documents during meetings",
        "Instant file distribution to team",
        "Cross-platform collaboration"
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string, icon: string } } = {
      blue: { bg: "bg-blue-100", icon: "text-blue-600" },
      purple: { bg: "bg-purple-100", icon: "text-purple-600" },
      green: { bg: "bg-green-100", icon: "text-green-600" }
    }
    return colors[color] || colors.blue
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <AnimatedElement direction="down" delay={0}>
            <Badge variant="outline" className="mb-4 bg-white animate-bounce">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular Use Cases
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfect For Every Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From developers to content creators, everyone loves Connected
            </p>
          </AnimatedElement>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const colors = getColorClasses(useCase.color)
            const direction = index % 2 === 0 ? 'left' : 'right'
            const Icon = useCase.icon
            
            return (
              <AnimatedElement key={useCase.title} direction={direction} delay={index * 200}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white hover:bg-gray-50">
                  <CardHeader>
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 animate-pulse`} style={{animationDelay: `${index * 100}ms`}}>
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                    <div className="text-sm text-green-500 font-bold">{useCase.subtitle}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {useCase.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedElement>
            )
          })}
        </div>
      </div>
    </section>
  )
}