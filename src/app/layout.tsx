import '@/styles/tailwind.css'
import { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import 'rc-slider/assets/index.css'
import Script from 'next/script'
import CustomizeControl from './customize-control'
import ThemeProvider from './theme-provider'
import WhatsAppButton from '@/components/brand/WhatsAppButton'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'

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
    template: '%s — Tourkokan',
    default: 'Tourkokan — Discover the Magic of Tourkokan',
  },
  description:
    "Your ultimate travel companion for exploring the pristine beaches, ancient forts, lush forests, and vibrant culture of Maharashtra's Tourkokan coast. Available on Google Play.",
  keywords: [
    'Tourkokan',
    'Tourkokan Tourism',
    'Tourkokan Travel App',
    'Maharashtra Travel',
    'Malvan',
    'Ratnagiri',
    'Sindhudurg',
    'Ganpatipule',
    'Tarkarli',
    'Devgad',
    'Alibag',
    'Tourkokan beaches',
    'Tourkokan forts',
    'Tourkokan food',
    'bus routes Tourkokan',
  ],
  authors: [{ name: 'Tourkokan', url: SITE_URL }],
  creator: 'Tourkokan',
  publisher: 'Tourkokan',
  category: 'travel',
  applicationName: 'Tourkokan',
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
    siteName: 'Tourkokan',
    title: 'Tourkokan — Discover the Magic of Tourkokan',
    description:
      "Explore pristine beaches, ancient forts, and the vibrant culture of Maharashtra's Tourkokan coast with Tourkokan.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tourkokan — Discover the Magic of Tourkokan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tourkokan — Discover the Magic of Tourkokan',
    description:
      "Explore beaches, forts, and hidden gems of Maharashtra's Tourkokan coast.",
    images: ['/og-image.png'],
    creator: '@Tourkokan',
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
  name: 'Tourkokan',
  url: SITE_URL,
  description:
    "Your ultimate travel companion for exploring the pristine beaches, ancient forts, and vibrant culture of Maharashtra's Tourkokan coast.",
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
    name: 'Tourkokan',
    url: SITE_URL,
    email: 'support@Tourkokan.com',
    sameAs: [
      'https://www.facebook.com/Tourkokan',
      'https://www.instagram.com/Tourkokan',
      'https://play.google.com/store/apps/details?id=com.Tourkokan',
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
          <LanguageProvider>
            <ThemeProvider>
              <div>
                {children}
                <CustomizeControl />
              </div>
            </ThemeProvider>
            <WhatsAppButton />
            {/* <ChatBot /> */}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
