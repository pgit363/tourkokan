'use client'

import { ApiError, sitesApi, categoriesApi, ftpUrl, Site, Category } from '@/lib/api'
import DownloadAppModal from '@/components/brand/DownloadAppModal'
import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// ── LimitedSelect ──────────────────────────────────────────────────────────────
// Shows first `limit` options freely; remaining options are blurred and
// clicking them fires onLimitReached (show download modal).

type SelectOption = { value: string; label: string }

function LimitedSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  limit = 3,
  onLimitReached,
}: {
  options: SelectOption[]
  value: string
  onChange: (v: string) => void
  placeholder: string
  disabled?: boolean
  limit?: number
  onLimitReached: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div ref={ref} className="relative min-w-[180px]">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border-2 border-primary-400 bg-white px-4 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-primary-600 dark:bg-neutral-800 dark:text-white"
      >
        <span className={selectedLabel ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}>
          {selectedLabel ?? placeholder}
        </span>
        <svg className="h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {/* "All" reset option — always free */}
          <button
            type="button"
            onMouseDown={() => { onChange(''); setOpen(false) }}
            className="w-full px-4 py-2.5 text-left text-sm text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            {placeholder}
          </button>
          {options.map((opt, i) =>
            i < limit ? (
              <button
                key={opt.value}
                type="button"
                onMouseDown={() => { onChange(opt.value); setOpen(false) }}
                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                {opt.label}
              </button>
            ) : (
              <div key={opt.value} className="relative">
                <div className="pointer-events-none select-none px-4 py-2.5 text-sm text-neutral-700 blur-sm dark:text-neutral-200">
                  {opt.label}
                </div>
                <div
                  className="absolute inset-0 cursor-pointer"
                  onMouseDown={() => { onLimitReached(); setOpen(false) }}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

// ── DestinationCard ────────────────────────────────────────────────────────────

const DestinationCard = ({ site }: { site: Site }) => {
  const { lang } = useLang()
  const imgUrl = ftpUrl(site.image)
  const displayName = lang === 'mr' && site.mr_name ? site.mr_name : site.name
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
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white">{displayName}</h3>
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

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DestinationsPage() {
  const { t, lang } = useLang()
  const [sites, setSites] = useState<Site[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedParent, setSelectedParent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  const subCategories =
    categories.find((c) => String(c.id) === selectedParent)?.sub_categories ?? []

  const parentOptions: SelectOption[] = categories.map((c) => ({ value: String(c.id), label: c.name }))
  const subOptions: SelectOption[] = subCategories.map((s) => ({ value: s.name, label: s.name }))

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
        global: 1,
      })
      const pagination = res.data
      setSites(reset ? pagination.data : (prev) => [...prev, ...pagination.data])
      setLastPage(pagination.last_page)
      if (reset) setPage(1)
    } catch (err) {
      if (!(err instanceof ApiError && err.isServerError)) {
        setError(err instanceof ApiError ? err.message : 'Failed to load destinations.')
      }
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

  const handleParentChange = (parentId: string) => {
    setSelectedParent(parentId)
    setSelectedCategory('')
  }

  const handleLoadMore = async () => {
    const next = page + 1
    if (next >= 3) { setShowDownloadModal(true); return }
    setPage(next)
    setLoading(true)
    try {
      const res = await sitesApi.list({
        search: search || undefined,
        category: selectedCategory || undefined,
        per_page: 12,
        page: next,
        global: 1,
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
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{t.destinations.pageTitle}</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{t.destinations.pageSubtitle}</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder={t.destinations.searchPlaceholder}
          value={search}
          onChange={(e) => {
            if (e.target.value.length >= 3) { setShowDownloadModal(true); return }
            setSearch(e.target.value)
          }}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:max-w-xs"
        />

        <LimitedSelect
          options={parentOptions}
          value={selectedParent}
          onChange={handleParentChange}
          placeholder={t.destinations.allCategories}
          limit={3}
          onLimitReached={() => setShowDownloadModal(true)}
        />

        <LimitedSelect
          options={subOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder={t.destinations.subCategory}
          disabled={!selectedParent || subOptions.length === 0}
          limit={3}
          onLimitReached={() => setShowDownloadModal(true)}
        />
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Grid */}
      {sites.length === 0 && !loading ? (
        <div className="py-20 text-center text-neutral-400">{t.destinations.noDestinations}</div>
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
            {t.common.loadMore}
          </button>
        </div>
      )}
      <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="Download App to See More" />
    </div>
  )
}
