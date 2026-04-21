'use client'

import { ApiError, Favourite, favouritesApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Divider } from '@/shared/divider'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://probytesolution.in'

function mediaUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}/storage/${path}`
}

export default function Page() {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState<Favourite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    if (!user) return
    fetchFavourites(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchFavourites = async (p: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await favouritesApi.list(p)
      if (p === 1) {
        setFavourites(res.data.data)
      } else {
        setFavourites((prev) => [...prev, ...res.data.data])
      }
      setLastPage(res.data.last_page)
      setPage(p)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load saved items.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (fav: Favourite) => {
    try {
      await favouritesApi.toggle(fav.favouritable_type, fav.favouritable_id)
      setFavourites((prev) => prev.filter((f) => f.id !== fav.id))
    } catch {}
  }

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-semibold">Saved listings</h1>
        <Divider className="my-8 w-14!" />
        <div className="py-12 text-center text-neutral-500">
          <p>Please <Link href="/login" className="font-medium text-primary-600 underline">sign in</Link> to view saved items.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Saved listings</h1>
      <Divider className="my-8 w-14!" />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && favourites.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : favourites.length === 0 ? (
        <div className="py-12 text-center text-neutral-400">
          <p className="text-5xl mb-4">♥</p>
          <p>No saved items yet.</p>
          <Link href="/destinations" className="mt-4 inline-block font-medium text-primary-600 underline">Explore destinations</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favourites.map((fav) => {
              const item = fav.favouritable as any
              const isEvent = fav.favouritable_type?.toLowerCase().includes('event')
              const imgUrl = mediaUrl(item?.image)
              const name = item?.name ?? item?.title ?? 'Saved item'
              const href = isEvent
                ? `/events/${item?.slug ?? item?.id}`
                : `/destinations/${item?.id ?? fav.favouritable_id}`

              return (
                <div key={fav.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                  <Link href={href}>
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          {isEvent ? '🎉' : '🏖️'}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{name}</h3>
                      <p className="mt-1 text-xs text-neutral-400">
                        {isEvent ? 'Event' : 'Destination'}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(fav)}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow transition hover:bg-red-500 hover:text-white dark:bg-neutral-800/90"
                    title="Remove from saved"
                  >
                    ♥
                  </button>
                </div>
              )
            })}
          </div>

          {!loading && page < lastPage && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => fetchFavourites(page + 1)}
                className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                Load more
              </button>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
