'use client'

import { ApiError, sitesApi, categoriesApi, Site, Category } from '@/lib/api'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://probytesolution.in'

function siteImageUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}/storage/${path}`
}

const DestinationCard = ({ site }: { site: Site }) => {
  const imgUrl = siteImageUrl(site.image)
  return (
    <Link
      href={`/destinations/${site.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
    >
      <div className="relative h-52 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={site.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🏖️</div>
        )}
        {site.is_favorite && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            ♥ Saved
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white">{site.name}</h3>
        {site.categories && site.categories.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {site.categories.slice(0, 2).map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {site.rating_avg_rate != null ? (
            <span className="flex items-center gap-1 text-sm text-amber-500">
              ★ <span className="font-medium">{Number(site.rating_avg_rate).toFixed(1)}</span>
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs text-neutral-400">
            {site.gallery_count ? `${site.gallery_count} photos` : ''}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function DestinationsPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSites = async (reset = false) => {
    setLoading(true)
    setError('')
    const currentPage = reset ? 1 : page
    try {
      const res = await sitesApi.list({
        search: search || undefined,
        category: selectedCategory || undefined,
        per_page: 12,
        page: currentPage,
      })
      const pagination = res.data
      setSites(reset ? pagination.data : (prev) => [...prev, ...pagination.data])
      setLastPage(pagination.last_page)
      if (reset) setPage(1)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load destinations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    fetchSites(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory])

  const handleLoadMore = async () => {
    const next = page + 1
    setPage(next)
    setLoading(true)
    try {
      const res = await sitesApi.list({
        search: search || undefined,
        category: selectedCategory || undefined,
        per_page: 12,
        page: next,
      })
      setSites((prev) => [...prev, ...res.data.data])
      setLastPage(res.data.last_page)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-16 lg:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Explore Kokan Destinations</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Discover beaches, forts, and hidden gems along the Kokan coast.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search destinations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:max-w-xs"
        />
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.code}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Grid */}
      {sites.length === 0 && !loading ? (
        <div className="py-20 text-center text-neutral-400">No destinations found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sites.map((site) => (
            <DestinationCard key={site.id} site={site} />
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
    </div>
  )
}
