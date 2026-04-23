import DownloadSection from '@/components/brand/DownloadSection'
import FeaturesSection from '@/components/brand/FeaturesSection'
import HeroSection from '@/components/brand/HeroSection'
import HowItWorks from '@/components/brand/HowItWorks'
import TestimonialsSection from '@/components/brand/TestimonialsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tourkokan — Discover the Magic of Tourkokan',
  description:
    "Your ultimate travel companion for exploring beaches, forts, culture, and hidden gems of Maharashtra's Tourkokan coast. Available on Google Play.",
  keywords: ['Tourkokan', 'Maharashtra', 'Tourism', 'Travel App', 'Tourkokan', 'Malvan', 'Ratnagiri', 'Sindhudurg', 'Ganpatipule', 'Tarkarli'],
}

export default function Page() {
  return (
    <main>
      {/* Hero — Full screen app showcase */}
      <HeroSection />

      {/* Features — What the app offers */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* How It Works — 4 steps */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Testimonials — User reviews */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Download CTA */}
      <DownloadSection />
    </main>
  )
}
