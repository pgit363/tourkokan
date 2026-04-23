import { Metadata } from 'next'
import { ApplicationLayout } from '../application-layout'

export const metadata: Metadata = {
  title: 'Tourkokan — Discover the Magic of Tourkokan',
  description:
    "Your ultimate travel companion for exploring the pristine beaches, ancient forts, lush forests, and vibrant culture of Maharashtra's Tourkokan coast.",
  keywords: ['Tourkokan', 'Tourkokan Tourism', 'Maharashtra Travel', 'Malvan', 'Ratnagiri', 'Sindhudurg', 'Tourkokan App'],
}

export default function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}
