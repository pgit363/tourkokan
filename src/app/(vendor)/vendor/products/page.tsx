'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, ProductStatus, VendorProduct, VendorSite, vendorApi } from '@/lib/api'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import StatusBadge from '../../StatusBadge'
import { SkeletonRows } from '../../Loaders'

const STATUSES: ProductStatus[] = ['draft', 'pending', 'approved', 'paused', 'rejected']

/**
 * `/vendor/products` — the catalog, and the things a vendor does to it in bulk.
 *
 * `toggleProductStatus` is approved ⇄ paused only, so pause/resume is offered on
 * exactly those two states and nothing else; a draft needs submitting, not pausing.
 * The same rule governs the bulk action, which is why the checkbox column selects
 * across a filtered list rather than the whole catalog.
 */
export default function VendorProductsPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [products, setProducts] = useState<VendorProduct[] | null>(null)
  const [sites, setSites] = useState<VendorSite[]>([])
  const [siteId, setSiteId] = useState<number | ''>('')
  const [status, setStatus] = useState<ProductStatus | ''>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [picked, setPicked] = useState<number[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const load = useCallback(
    async (p: number) => {
      setBusy(true)
      setError('')
      try {
        const res = await vendorApi.myProducts({
          page: p,
          ...(siteId ? { site_id: siteId } : {}),
          ...(status ? { status } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        })
        setProducts((prev) => (p === 1 || !prev ? res.data.data : [...prev, ...res.data.data]))
        setLastPage(res.data.last_page)
      } catch (err) {
        setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
        setProducts([])
      } finally {
        setBusy(false)
      }
    },
    [siteId, status, search, t.vendor.errorGeneric]
  )

  useEffect(() => {
    setPage(1)
    setPicked([])
    load(1)
  }, [load])

  useEffect(() => {
    vendorApi
      .mySubmissions()
      .then((res) => setSites(res.data.data))
      .catch(() => setSites([]))
  }, [])

  const statusLabel = useMemo<Record<string, string>>(
    () => ({
      draft: d.statusDraft,
      pending: d.statusPending,
      approved: d.statusLive,
      paused: d.statusPaused,
      rejected: d.statusRejected,
    }),
    [d]
  )

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      setPicked([])
      setPage(1)
      await load(1)
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    } finally {
      setBusy(false)
    }
  }

  const loading = products === null

  // Only these two can be flipped, so a selection of anything else offers nothing.
  const toggleable = (products ?? []).filter((p) => picked.includes(p.id) && ['approved', 'paused'].includes(String(p.status)))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{d.navProducts}</h1>
        <ButtonPrimary href="/vendor/products/new">{d.newProduct}</ButtonPrimary>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Input
          placeholder={d.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProductStatus | '')}
          className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        >
          <option value="">{d.allStatuses}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
        <select
          value={siteId}
          onChange={(e) => setSiteId(e.target.value ? Number(e.target.value) : '')}
          className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        >
          <option value="">{d.allSites}</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {picked.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl bg-neutral-100 px-4 py-3 text-sm dark:bg-neutral-800">
          <span>
            {picked.length} {d.selected}
          </span>
          <button
            type="button"
            disabled={busy || !toggleable.length}
            onClick={() => act(() => vendorApi.bulkProductStatus(toggleable.map((p) => p.id), 'paused'))}
            className="text-primary-600 hover:underline disabled:opacity-40 dark:text-primary-400"
          >
            {d.pause}
          </button>
          <button
            type="button"
            disabled={busy || !toggleable.length}
            onClick={() => act(() => vendorApi.bulkProductStatus(toggleable.map((p) => p.id), 'approved'))}
            className="text-primary-600 hover:underline disabled:opacity-40 dark:text-primary-400"
          >
            {d.resume}
          </button>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!loading && !(products ?? []).length ? (
        <p className="text-sm text-neutral-500">{d.noProducts}</p>
      ) : (
        <Table dense striped className="text-sm">
          <TableHead>
            <TableRow>
              <TableHeader className="w-8" />
              <TableHeader className="text-xs tracking-wide uppercase">{d.productName}</TableHeader>
              <TableHeader className="text-xs tracking-wide uppercase">{d.columnStatus}</TableHeader>
              <TableHeader className="text-xs tracking-wide uppercase">{d.category}</TableHeader>
              <TableHeader className="text-right text-xs tracking-wide uppercase">{d.price}</TableHeader>
              <TableHeader className="text-xs tracking-wide uppercase">{d.outlet}</TableHeader>
              <TableHeader className="text-right text-xs tracking-wide uppercase">{d.columnActions}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <SkeletonRows columns={7} />}
            {(products ?? []).map((p) => {
              const s = String(p.status)
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={p.name}
                      checked={picked.includes(p.id)}
                      onChange={(e) =>
                        setPicked((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id)))
                      }
                    />
                  </TableCell>
                  <TableCell className="max-w-xs font-medium">
                    <Link href={`/vendor/products/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s} />
                  </TableCell>
                  <TableCell className="text-neutral-500">{p.product_category?.name ?? '—'}</TableCell>
                  <TableCell className="text-right text-neutral-500 tabular-nums">
                    {p.default_variant?.price ?? p.base_price ?? '—'}
                  </TableCell>
                  <TableCell className="text-neutral-500">{p.site?.name ?? '—'}</TableCell>
                  <TableCell className="space-x-3 text-right whitespace-nowrap">
                    {(s === 'approved' || s === 'paused') && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => act(() => vendorApi.toggleProductStatus(p.id))}
                        className="text-primary-600 hover:underline disabled:opacity-40 dark:text-primary-400"
                      >
                        {s === 'approved' ? d.pause : d.resume}
                      </button>
                    )}
                    {(s === 'draft' || s === 'rejected') && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => act(() => vendorApi.submitProductForReview(p.id))}
                        className="text-primary-600 hover:underline disabled:opacity-40 dark:text-primary-400"
                      >
                        {d.submitForReview}
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmId(p.id)}
                      className="text-red-600 hover:underline disabled:opacity-40"
                    >
                      {d.deleteLabel}
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      {!busy && page < lastPage && (
        <button
          type="button"
          onClick={() => {
            const n = page + 1
            setPage(n)
            load(n)
          }}
          className="mt-6 rounded-full border border-neutral-300 px-5 py-2 text-sm dark:border-neutral-600"
        >
          {t.common.loadMore}
        </button>
      )}

      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-neutral-800">
            <h2 className="text-lg font-medium">{d.deleteTitle}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{d.deleteBody}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmId(null)} className="px-4 py-2 text-sm">
                {t.common.cancel}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  const id = confirmId
                  setConfirmId(null)
                  act(() => vendorApi.deleteProduct(id))
                }}
                className="rounded-full bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {d.deleteLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
