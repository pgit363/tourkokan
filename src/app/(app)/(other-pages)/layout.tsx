import Header from '@/components/Header/Header'
import { Metadata } from 'next'
import { ApplicationLayout } from '../application-layout'
import VendorAcquireBanner from '@/components/brand/VendorAcquireBanner'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Chisfis is a modern and elegant template for Next.js, Tailwind CSS, and TypeScript. It is designed to be simple and easy to use, with a focus on performance and accessibility.',
  keywords: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Chisfis', 'Travel', 'E-commerce', 'Booking', 'Cars'],
}

export default function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return (
    <ApplicationLayout header={<Header hasBorderBottom={true} />}>
      {children}
      {/* Persistent "register your business" CTA across content pages — hides itself on
          /vendor/register and /subscription. */}
      <VendorAcquireBanner />
    </ApplicationLayout>
  )
}
