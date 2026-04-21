import { Metadata } from 'next'
import { ApplicationLayout } from '../application-layout'

export const metadata: Metadata = {
  title: 'TourKokan — Discover the Magic of Konkan',
  description:
    "Your ultimate travel companion for exploring the pristine beaches, ancient forts, lush forests, and vibrant culture of Maharashtra's Konkan coast.",
  keywords: ['TourKokan', 'Konkan Tourism', 'Maharashtra Travel', 'Malvan', 'Ratnagiri', 'Sindhudurg', 'Konkan App'],
}

export default function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}
