import { Metadata } from 'next'
import Header from '@/components/Home/Header'
import HeroSection from '@/components/Home/HeroSection'
import HowItWorksSection from '@/components/Home/HowItWorksSection'
import FeaturesSection from '@/components/Home/FeaturesSection'
import UseCasesSection from '@/components/Home/UseCasesSection'
import SecuritySection from '@/components/Home/SecuritySection'
import CTASection from '@/components/Home/CTASection'
import Footer from '@/components/Home/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <UseCasesSection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}