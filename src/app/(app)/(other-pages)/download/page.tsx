import { PlayStoreBadge } from '@/components/brand/AppBadges'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Download the App — Tourkokan',
  description: 'Download the Tourkokan app to explore destinations, add places, comment, rate, and get the full experience.',
}

export default async function DownloadPage({ searchParams }: { searchParams?: Promise<{ reason?: string }> }) {
  const reason = (await searchParams)?.reason

  const messages: Record<string, { heading: string; sub: string }> = {
    'submit-place': {
      heading: 'List Your Place on Tourkokan',
      sub: 'Want to submit a business or tourist spot? Download the Tourkokan app to add and manage your listing.',
    },
    comment: {
      heading: 'Join the Conversation',
      sub: 'Comments can only be posted through the Tourkokan app. Download it to share your experience.',
    },
    rate: {
      heading: 'Rate This Place',
      sub: 'Download the Tourkokan app to rate places and help other travellers.',
    },
  }

  const content = (reason && messages[reason]) || {
    heading: 'Get the Full Experience',
    sub: 'Download the Tourkokan app to explore beaches, forts, routes, and hidden gems of the Konkan coast.',
  }

  const features = ['📍 Add places', '⭐ Rate & review', '💬 Comment', '🚌 Bus routes', '🎉 Events', '❤️ Favourites']

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-8 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">

        {/* Icon + heading */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-600 shadow-md">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{content.heading}</h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{content.sub}</p>
          </div>
        </div>

        {/* Features — compact inline pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {features.map((f) => (
            <span key={f} className="rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-300">
              {f}
            </span>
          ))}
        </div>

        {/* Badge + iOS note */}
        <div className="mt-6 flex items-center gap-4">
          <PlayStoreBadge width={160} />
          <p className="text-xs text-neutral-400">iOS — Coming Soon</p>
        </div>

        {/* Back link */}
        <Link href="/" className="mt-5 inline-block text-xs text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
