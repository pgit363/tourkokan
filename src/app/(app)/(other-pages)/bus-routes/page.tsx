'use client'

import { ApiError, Route, routesApi, sitesApi, Site } from '@/lib/api'
import DownloadAppModal from '@/components/brand/DownloadAppModal'
import { useEffect, useState } from 'react'

const RouteCard = ({ route }: { route: Route }) => (
  <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Route name & endpoints */}
      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900 dark:text-white">{route.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
          <span className="rounded-lg bg-green-50 px-2 py-1 font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {route.sourcePlace?.name ?? `Place #${route.source_place_id}`}
          </span>
          <svg className="h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="rounded-lg bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            {route.destinationPlace?.name ?? `Place #${route.destination_place_id}`}
          </span>
        </div>
      </div>

      {/* Time/Distance info */}
      <div className="flex flex-wrap gap-4 text-sm text-neutral-500 sm:text-right">
        {route.start_time && (
          <div>
            <p className="text-xs text-neutral-400">Departure</p>
            <p className="font-medium text-neutral-900 dark:text-white">{route.start_time}</p>
          </div>
        )}
        {route.end_time && (
          <div>
            <p className="text-xs text-neutral-400">Arrival</p>
            <p className="font-medium text-neutral-900 dark:text-white">{route.end_time}</p>
          </div>
        )}
        {route.total_time && (
          <div>
            <p className="text-xs text-neutral-400">Duration</p>
            <p className="font-medium text-neutral-900 dark:text-white">{route.total_time}</p>
          </div>
        )}
        {route.distance && (
          <div>
            <p className="text-xs text-neutral-400">Distance</p>
            <p className="font-medium text-neutral-900 dark:text-white">{route.distance}</p>
          </div>
        )}
      </div>
    </div>

    {/* Stops */}
    {route.routeStops && route.routeStops.length > 0 && (
      <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-700">
        <p className="mb-2 text-xs font-medium text-neutral-400 uppercase tracking-wide">Stops</p>
        <div className="flex flex-wrap gap-2">
          {route.routeStops.map((stop, i) => (
            <span key={stop.id} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
              {stop.place?.name ?? `Stop ${i + 1}`}
              {stop.arrival_time ? ` · ${stop.arrival_time}` : ''}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)

export default function BusRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [allSites, setAllSites] = useState<Site[]>([])
  const [sourceSite, setSourceSite] = useState('')
  const [destSite, setDestSite] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  // Load site dropdown (for source/dest search)
  useEffect(() => {
    sitesApi
      .list({ per_page: 200 })
      .then((res) => setAllSites(res.data.data))
      .catch(() => {})
  }, [])

  // Initial load
  useEffect(() => {
    fetchRoutes(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchRoutes = async (p: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await routesApi.list(p)
      if (p === 1) {
        setRoutes(res.data.data)
      } else {
        setRoutes((prev) => [...prev, ...res.data.data])
      }
      setLastPage(res.data.last_page)
      setPage(p)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load routes.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sourceSite && !destSite) {
      fetchRoutes(1)
      return
    }
    setSearching(true)
    setError('')
    try {
      const params: Record<string, number> = {}
      if (sourceSite) params.source_place_id = Number(sourceSite)
      if (destSite) params.destination_place_id = Number(destSite)
      const res = await routesApi.search(params)
      setRoutes(res.data.data)
      setLastPage(res.data.last_page)
      setPage(1)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Search failed.')
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSourceSite('')
    setDestSite('')
    fetchRoutes(1)
  }

  return (
    <div className="container py-16 lg:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Bus Routes</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Find bus routes connecting Kokan destinations.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-4 font-semibold text-neutral-900 dark:text-white">Search Routes</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-400">From</label>
            <select
              value={sourceSite}
              onChange={(e) => setSourceSite(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-700 dark:text-white"
            >
              <option value="">Select source</option>
              {allSites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-neutral-600 dark:text-neutral-400">To</label>
            <select
              value={destSite}
              onChange={(e) => setDestSite(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-700 dark:text-white"
            >
              <option value="">Select destination</option>
              {allSites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={searching}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
            {(sourceSite || destSite) && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Routes list */}
      {routes.length === 0 && !loading ? (
        <div className="py-20 text-center text-neutral-400">No routes found.</div>
      ) : (
        <div className="space-y-4">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
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
            onClick={() => page + 1 >= 3 ? setShowDownloadModal(true) : fetchRoutes(page + 1)}
            className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Load more
          </button>
        </div>
      )}
      <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="See More Bus Routes" />
    </div>
  )
}
