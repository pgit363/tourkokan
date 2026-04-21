import DownloadSection from '@/components/brand/DownloadSection'
import FeaturesSection from '@/components/brand/FeaturesSection'
import HeroSection from '@/components/brand/HeroSection'
import HowItWorks from '@/components/brand/HowItWorks'
import TestimonialsSection from '@/components/brand/TestimonialsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TourKokan — Discover the Magic of Konkan',
  description:
    "Your ultimate travel companion for exploring beaches, forts, culture, and hidden gems of Maharashtra's Konkan coast. Available on Google Play.",
  keywords: ['Konkan', 'Maharashtra', 'Tourism', 'Travel App', 'TourKokan', 'Malvan', 'Ratnagiri', 'Sindhudurg', 'Ganpatipule', 'Tarkarli'],
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
