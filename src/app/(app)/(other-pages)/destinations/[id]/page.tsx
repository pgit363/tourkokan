'use client'

import { ApiError, commentsApi, Comment, ftpUrl, sitesApi, Site } from '@/lib/api'
import { useLang } from '@/context/LanguageContext'
import DownloadAppModal from '@/components/brand/DownloadAppModal'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useLang()

  const [site, setSite] = useState<Site | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    sitesApi
      .get(Number(id))
      .then((res) => setSite(res.data))
      .catch((err) => {
        if (!(err instanceof ApiError && err.isServerError))
          setError(err instanceof ApiError ? err.message : 'Failed to load destination.')
      })
      .finally(() => setLoading(false))

    commentsApi
      .list('Site', Number(id))
      .then((res) => setComments(res.data.data))
      .catch(() => {})
  }, [id])

if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="container py-20 text-center text-neutral-500">
        <p>{error || (lang === 'mr' ? 'ठिकाण सापडले नाही.' : 'Destination not found.')}</p>
        <Link href="/destinations" className="mt-4 inline-block text-primary-600 underline">{t.destinations.backToDestinations}</Link>
      </div>
    )
  }

  const imgUrl = ftpUrl(site.image)

  return (
    <div className="container py-12 lg:py-16">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-neutral-100 sm:h-80 lg:h-96 dark:bg-neutral-800">
        {imgUrl ? (
          <img src={imgUrl} alt={site.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">🏖️</div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{lang === 'mr' && site.mr_name ? site.mr_name : site.name}</h1>
              {site.categories && site.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {site.categories.map((c, i) => (
                    <span key={`${c.id}-${i}`} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                      {lang === 'mr' && c.mr_name ? c.mr_name : c.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {site.rating_avg_rate != null && (
              <div className="flex items-center gap-1 text-amber-500">
                <span className="text-2xl">★</span>
                <span className="text-xl font-bold">{Number(site.rating_avg_rate).toFixed(1)}</span>
              </div>
            )}
          </div>

          {site.description && (
            <p className="mt-6 leading-relaxed text-neutral-600 dark:text-neutral-400">{site.description}</p>
          )}

          {/* Gallery preview */}
          {(site as any).gallery && (site as any).gallery.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">{t.destinations.photosLabel}</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {(site as any).gallery.slice(0, 8).map((g: any, i: number) => (
                  <div key={g.id ?? i} className="aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-700">
                    {ftpUrl(g.path) && (
                      <img src={ftpUrl(g.path)!} alt={g.title ?? ''} className="h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rate this place — app only */}
          <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/50">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              ⭐ {lang === 'mr' ? 'रेटिंग देण्यासाठी' : 'To rate this place,'}{' '}
              <a href="https://play.google.com/store/apps/details?id=com.tourkokan" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                {lang === 'mr' ? 'ॲप डाउनलोड करा' : 'download the Tourkokan app'}
              </a>.
            </p>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h2 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
              {t.common.reviews} ({site.comment_count ?? comments.length})
            </h2>

            <div className="mb-6 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                💬 {lang === 'mr' ? 'टिप्पणी करण्यासाठी' : 'Comments can be posted via the'}{' '}
                <a href="https://play.google.com/store/apps/details?id=com.tourkokan" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  {lang === 'mr' ? 'ॲप डाउनलोड करा' : 'Tourkokan app'}
                </a>.
              </p>
            </div>

            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={c.id ?? i} className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30">
                      {c.users?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{c.users?.name ?? 'Anonymous'}</span>
                    {c.created_at && (
                      <span className="ml-auto text-xs text-neutral-400">{new Date(c.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{c.comment}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-neutral-400">{t.destinations.noReviews}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Stats */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">{t.destinations.quickInfo}</h3>
            <dl className="space-y-3 text-sm">
              {site.gallery_count != null && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">{t.destinations.photosLabel}</dt>
                  <dd className="font-medium text-neutral-900 dark:text-white">{site.gallery_count}</dd>
                </div>
              )}
              {site.comment_count != null && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">{t.common.reviews}</dt>
                  <dd className="font-medium text-neutral-900 dark:text-white">{site.comment_count}</dd>
                </div>
              )}
              {site.rating_avg_rate != null && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">{t.common.rating}</dt>
                  <dd className="font-medium text-amber-500">★ {Number(site.rating_avg_rate).toFixed(1)} / 5</dd>
                </div>
              )}
            </dl>
          </div>

          <Link
            href="/destinations"
            className="block rounded-2xl border border-neutral-100 bg-white px-6 py-4 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {t.destinations.backToDestinations}
          </Link>
        </div>
      </div>
      <DownloadAppModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} title="Download the App" />
    </div>
  )
}
