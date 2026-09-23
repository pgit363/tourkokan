'use client'

import { ApiError, Event, eventsApi } from '@/lib/api'
import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://probytesolution.in'

function mediaUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}/storage/${path}`
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLang()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    eventsApi
      .get(slug)
      .then((res) => setEvent(res.data))
      .catch((err) => setError(err instanceof ApiError ? err.message : t.events.notFound))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container py-20 text-center text-neutral-500">
        <p>{error || t.events.notFound}</p>
        <Link href="/events" className="mt-4 inline-block text-primary-600 underline">{t.events.backToEvents}</Link>
      </div>
    )
  }

  const imgUrl = mediaUrl(event.image)

  return (
    <div className="container py-12 lg:py-16">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-neutral-100 sm:h-80 lg:h-96 dark:bg-neutral-800">
        {imgUrl ? (
          <img src={imgUrl} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">🎉</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
          {event.is_featured && (
            <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-bold text-amber-900">{t.events.featuredBadge}</span>
          )}
          {event.is_free ? (
            <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white">{t.events.freeEvent}</span>
          ) : event.price ? (
            <span className="rounded-full bg-primary-600 px-3 py-1 text-sm font-bold text-white">₹{event.price}</span>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{event.title}</h1>
          {event.eventType && (
            <span className="mt-2 inline-block rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {event.eventType.name}
            </span>
          )}

          {event.description && (
            <div className="mt-6">
              <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">{t.events.aboutThisEvent}</h2>
              <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">{event.description}</p>
            </div>
          )}

          {/* App-only actions */}
          <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/50">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              ♥ Like, ✓ Going, ⭐ Interested — available in the{' '}
              <a href="https://play.google.com/store/apps/details?id=com.tourkokan" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Tourkokan app
              </a>.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">{t.events.eventDetails}</h3>
            <dl className="space-y-4 text-sm">
              {event.start_date && (
                <div className="flex gap-3">
                  <dt className="mt-0.5">
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </dt>
                  <dd>
                    <p className="text-xs text-neutral-400">{t.events.dateLabel}</p>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {formatDate(event.start_date)}
                      {event.end_date && event.end_date !== event.start_date
                        ? ` – ${formatDate(event.end_date)}`
                        : ''}
                    </p>
                    {(event.start_time || event.end_time) && (
                      <p className="text-neutral-500">
                        {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
                      </p>
                    )}
                  </dd>
                </div>
              )}

              {event.location && (
                <div className="flex gap-3">
                  <dt className="mt-0.5">
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </dt>
                  <dd>
                    <p className="text-xs text-neutral-400">{t.events.locationLabel}</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{event.location}</p>
                    {event.address && <p className="text-neutral-500">{event.address}</p>}
                  </dd>
                </div>
              )}

              {event.site && (
                <div className="flex gap-3">
                  <dt className="mt-0.5">
                    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </dt>
                  <dd>
                    <p className="text-xs text-neutral-400">{t.events.venueLabel}</p>
                    <Link href={`/destinations/${event.site.id}`} className="font-medium text-primary-600 underline dark:text-primary-400">
                      {event.site.name}
                    </Link>
                  </dd>
                </div>
              )}

              <div className="border-t border-neutral-100 pt-3 dark:border-neutral-700">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>👁 {event.view_count ?? 0} {t.events.viewsLabel}</span>
                  <span>↗ {event.share_count ?? 0} {t.events.sharesLabel}</span>
                </div>
              </div>
            </dl>
          </div>

          <Link
            href="/events"
            className="block rounded-2xl border border-neutral-100 bg-white px-6 py-4 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {t.events.backToEvents}
          </Link>
        </div>
      </div>
    </div>
  )
}
