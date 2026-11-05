'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, VendorSite, vendorApi } from '@/lib/api'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import StatusBadge from '../../StatusBadge'
import { SkeletonRows } from '../../Loaders'

/**
 * `/vendor/businesses` — the vendor's outlets.
 *
 * Reads `mySubmissions` rather than `mySites`: both list the vendor's sites, but
 * submissions carry `submission_status` and `rejection_reason`, which is the whole
 * point of this screen — a rejected outlet needs to show why.
 *
 * A pending outlet is not a blocked one. Products can be added while the business
 * is under review, so only `rejected` withholds the add-listing link.
 */
export default function VendorBusinessesPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [sites, setSites] = useState<VendorSite[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      const res = await vendorApi.mySubmissions()
      setSites(res.data.data)
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
      setSites([])
    }
  }, [t.vendor.errorGeneric])

  useEffect(() => {
    load()
  }, [load])

  const makePrimary = async (id: number) => {
    setBusy(true)
    try {
      await vendorApi.setPrimarySite(id)
      await load()
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    } finally {
      setBusy(false)
    }
  }

  const loading = sites === null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{d.navBusinesses}</h1>
        <ButtonPrimary href="/vendor/register">{d.addBusiness}</ButtonPrimary>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!loading && !(sites ?? []).length ? (
        <p className="text-sm text-neutral-500">{d.noBusinesses}</p>
      ) : (
        <Table dense striped className="text-sm">
          <TableHead>
            <TableRow>
              <TableHeader className="text-xs tracking-wide uppercase">{d.navBusinesses}</TableHeader>
              <TableHeader className="text-xs tracking-wide uppercase">{d.columnStatus}</TableHeader>
              <TableHeader className="text-xs tracking-wide uppercase">{d.primary}</TableHeader>
              <TableHeader className="text-right text-xs tracking-wide uppercase">{d.columnActions}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <SkeletonRows columns={4} />}
            {(sites ?? []).map((site) => (
              <TableRow key={site.id}>
                <TableCell className="max-w-sm font-medium">
                  {site.name}
                  {/* The reason sits under the name rather than in a column of its
                      own: only a rejected outlet has one, so a column would be empty
                      for everyone else. */}
                  {site.submission_status === 'rejected' && site.rejection_reason && (
                    <span className="mt-1 block whitespace-normal text-xs font-normal text-red-600">
                      {d.reasonLabel}: {site.rejection_reason}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={site.submission_status} kind="site" />
                </TableCell>
                <TableCell className="text-neutral-500">
                  {site.is_primary ? d.primary : '—'}
                </TableCell>
                <TableCell className="space-x-3 text-right whitespace-nowrap">
                  {!site.is_primary && site.submission_status === 'approved' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => makePrimary(site.id)}
                      className="text-primary-600 hover:underline disabled:opacity-50 dark:text-primary-400"
                    >
                      {d.makePrimary}
                    </button>
                  )}
                  {site.submission_status !== 'rejected' && (
                    <Link
                      href={`/vendor/products/new?site=${site.id}`}
                      className="text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {d.newProduct}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}