'use client'

import { ApiError, Event, eventsApi, ftpUrl } from '@/lib/api'
import DownloadAppModal from '@/components/brand/DownloadAppModal'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EventCard = ({ event }: { event: Event }) => {
  const imgUrl = ftpUrl(event.image)
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🎉</div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {event.is_featured && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-900">Featured</span>
          )}
          {event.is_free ? (
            <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">Free</span>
          ) : event.price ? (
            <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">₹{event.price}</span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2">{event.title}</h3>
        {event.eventType && (
          <span className="mt-1 text-xs text-primary-600 dark:text-primary-400">{event.eventType.name}</span>
        )}
        {event.start_date && (
          <p className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.start_date)}
            {event.end_date && event.end_date !== event.start_date ? ` – ${formatDate(event.end_date)}` : ''}
          </p>
        )}
        {event.location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </p>
        )}

        {/* Interactions */}
        <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-neutral-400">
          {event.like_count != null && (
            <span className="flex items-center gap-1">♥ {event.like_count}</span>
          )}
          {event.going_count != null && (
            <span className="flex items-center gap-1">✓ {event.going_count} going</span>
          )}
          {event.view_count != null && (
            <span className="ml-auto flex items-center gap-1">👁 {event.view_count}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'free' | 'featured'>('all')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  const fetchEvents = async (reset = false) => {
    setLoading(true)
    setError('')
    const currentPage = reset ? 1 : page
    const params: Parameters<typeof eventsApi.list>[0] = {
      search: search || undefined,
      per_page: 12,
      page: currentPage,
    }
    if (filter === 'free') params.is_free = true
    if (filter === 'featured') params.is_featured = true

    try {
      const res = await eventsApi.list(params)
      const pagination = res.data
      setEvents(reset ? pagination.data : (prev) => [...prev, ...pagination.data])
      setLastPage(pagination.last_page)
      if (reset) setPage(1)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter])

  const handleLoadMore = async () => {
    const next = page + 1
    if (next >= 3) { setShowDownloadModal(true); return }
    setPage(next)
    setLoading(true)
    try {
      const params: Parameters<typeof eventsApi.list>[0] = {
        search: search || undefined,
        per_page: 12,
        page: next,
      }
      if (filter === 'free') params.is_free = true
      if (filter === 'featured') params.is_featured = true
      const res = await eventsApi.list(params)
      setEvents((prev) => [...prev, ...res.data.data])
      setLastPage(res.data.last_page)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-16 lg:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Events in Kokan</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Festivals, cultural events, and local happenings across the Kokan coast.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:max-w-xs"
        />
        <div className="flex gap-2">
          {(['all', 'free', 'featured'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {events.length === 0 && !loading ? (
        <div className="py-20 text-center text-neutral-400">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-10 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      )}

      {!loading && page < lastPage && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Load more
          </button>
        </div>
      )}
      <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="See More Events" />
    </div>
  )
}
