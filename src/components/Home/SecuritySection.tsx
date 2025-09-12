'use client'
import { Badge } from '@/components/ui/badge'
import { AnimatedElement } from '@/components/Home/AnimatedElement'
import { 
  Lock, RefreshCw, Shield 
} from 'lucide-react'

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedElement direction="down" delay={0}>
            <Badge variant="outline" className="mb-4 bg-green-50 text-green-700 border-green-200 animate-pulse">
              <Lock className="w-3 h-3 mr-1" />
              🏦 Bank-level security • SOC 2 certified
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement direction="up" delay={200}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Data is <span className="text-green-500">100% Safe</span> & Private
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              We take security seriously. Your data is encrypted, temporary, and <strong>never accessed by us</strong>.
            </p>
          </AnimatedElement>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <AnimatedElement direction="left" delay={400}>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">256-bit Encryption</h3>
                <p className="text-gray-600">Military-grade encryption protects all transfers</p>
              </div>
            </AnimatedElement>

            <AnimatedElement direction="up" delay={600}>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Auto-Delete</h3>
                <p className="text-gray-600">Files expire after 7 days, sessions after 24 hours</p>
              </div>
            </AnimatedElement>

            <AnimatedElement direction="right" delay={800}>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Zero Knowledge</h3>
                <p className="text-gray-600">We never see, store, or access your data</p>
              </div>
            </AnimatedElement>
          </div>

          <AnimatedElement direction="up" delay={1000}>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600 mr-2" />
                <span className="text-lg font-semibold text-green-700">Enterprise Certified</span>
              </div>
              <p className="text-gray-700 mb-4">
                Trusted by Fortune 500 companies. GDPR compliant, SOC 2 Type II certified, 
                and regular third-party security audits.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Badge variant="outline" className="bg-white/50">🏆 SOC 2 Certified</Badge>
                <Badge variant="outline" className="bg-white/50">🛡️ GDPR Compliant</Badge>
                <Badge variant="outline" className="bg-white/50">🔒 ISO 27001</Badge>
                <Badge variant="outline" className="bg-white/50">⚡ 99.9% Uptime</Badge>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
