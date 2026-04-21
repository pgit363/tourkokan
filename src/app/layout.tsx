import '@/styles/tailwind.css'
import { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import 'rc-slider/assets/index.css'
import Script from 'next/script'
import CustomizeControl from './customize-control'
import ThemeProvider from './theme-provider'
import WhatsAppButton from '@/components/brand/WhatsAppButton'
import { AuthProvider } from '@/context/AuthContext'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tourkokan.com'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s — TourKokan',
    default: 'TourKokan — Discover the Magic of Konkan',
  },
  description:
    "Your ultimate travel companion for exploring the pristine beaches, ancient forts, lush forests, and vibrant culture of Maharashtra's Konkan coast. Available on Google Play.",
  keywords: [
    'TourKokan',
    'Konkan Tourism',
    'Konkan Travel App',
    'Maharashtra Travel',
    'Malvan',
    'Ratnagiri',
    'Sindhudurg',
    'Ganpatipule',
    'Tarkarli',
    'Devgad',
    'Alibag',
    'Konkan beaches',
    'Konkan forts',
    'Konkan food',
    'bus routes Konkan',
  ],
  authors: [{ name: 'TourKokan', url: SITE_URL }],
  creator: 'TourKokan',
  publisher: 'TourKokan',
  category: 'travel',
  applicationName: 'TourKokan',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'TourKokan',
    title: 'TourKokan — Discover the Magic of Konkan',
    description:
      "Explore pristine beaches, ancient forts, and the vibrant culture of Maharashtra's Konkan coast with TourKokan.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TourKokan — Discover the Magic of Konkan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TourKokan — Discover the Magic of Konkan',
    description:
      "Explore beaches, forts, and hidden gems of Maharashtra's Konkan coast.",
    images: ['/og-image.png'],
    creator: '@tourkokan',
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: [{ url: '/logo.png', sizes: '512x512', type: 'image/png' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'TourKokan',
  url: SITE_URL,
  description:
    "Your ultimate travel companion for exploring the pristine beaches, ancient forts, and vibrant culture of Maharashtra's Konkan coast.",
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
    bestRating: '5',
  },
  author: {
    '@type': 'Organization',
    name: 'TourKokan',
    url: SITE_URL,
    email: 'support@tourkokan.com',
    sameAs: [
      'https://www.facebook.com/tourkokan',
      'https://www.instagram.com/tourkokan',
      'https://play.google.com/store/apps/details?id=com.tourkokan',
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <AuthProvider>
          <ThemeProvider>
            <div>
              {children}
              <CustomizeControl />
            </div>
          </ThemeProvider>
          <WhatsAppButton />
          {/* <ChatBot /> */}
        </AuthProvider>
      </body>
    </html>
  )
}
