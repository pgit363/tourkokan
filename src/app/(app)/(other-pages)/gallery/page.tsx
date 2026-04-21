'use client'

import { ApiError, categoriesApi, Category, galleryApi, GalleryItem } from '@/lib/api'
import DownloadAppModal from '@/components/brand/DownloadAppModal'
import { useEffect, useState } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://probytesolution.in'

function mediaUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}/storage/${path}`
}

const GalleryCard = ({ item, onClick }: { item: GalleryItem; onClick: () => void }) => {
  const imgUrl = mediaUrl(item.path)
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-700"
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={item.title ?? 'Gallery photo'}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl">🖼️</div>
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
        {item.title && <p className="text-sm font-medium text-white">{item.title}</p>}
      </div>
      {item.galleryable?.name && (
        <div className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
          {item.galleryable.name}
        </div>
      )}
    </button>
  )
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data.data)).catch(() => {})
  }, [])

  const fetchItems = async (reset = false) => {
    setLoading(true)
    setError('')
    const currentPage = reset ? 1 : page
    try {
      const res = await galleryApi.list({
        search: search || undefined,
        category: selectedCategory || undefined,
        per_page: 20,
        page: currentPage,
      })
      const pagination = res.data
      setItems(reset ? pagination.data : (prev) => [...prev, ...pagination.data])
      setLastPage(pagination.last_page)
      if (reset) setPage(1)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load gallery.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory])

  const handleLoadMore = async () => {
    const next = page + 1
    if (next >= 3) { setShowDownloadModal(true); return }
    setPage(next)
    setLoading(true)
    try {
      const res = await galleryApi.list({
        search: search || undefined,
        category: selectedCategory || undefined,
        per_page: 20,
        page: next,
      })
      setItems((prev) => [...prev, ...res.data.data])
      setLastPage(res.data.last_page)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-16 lg:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Photo Gallery</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Stunning visuals from across the Kokan coast.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search photos…"
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

      {items.length === 0 && !loading ? (
        <div className="py-20 text-center text-neutral-400">No photos found.</div>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
          {items.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <GalleryCard item={item} onClick={() => setLightbox(item)} />
            </div>
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {mediaUrl(lightbox.path) && (
              <img
                src={mediaUrl(lightbox.path)!}
                alt={lightbox.title ?? 'Gallery photo'}
                className="max-h-[80vh] rounded-2xl object-contain"
              />
            )}
            {(lightbox.title || lightbox.galleryable?.name) && (
              <div className="mt-3 text-center">
                {lightbox.title && <p className="font-medium text-white">{lightbox.title}</p>}
                {lightbox.galleryable?.name && (
                  <p className="text-sm text-neutral-400">{lightbox.galleryable.name}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="See More Photos" />
    </div>
  )
}
