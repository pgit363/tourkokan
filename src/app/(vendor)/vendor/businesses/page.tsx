'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, VendorSite, vendorApi } from '@/lib/api'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useCallback, useEffect, useState } from 'react'
import StatusBadge from '../../StatusBadge'

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

  if (!sites) return <p className="text-sm text-neutral-500">{t.common.loading}</p>

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{d.navBusinesses}</h1>
        <ButtonPrimary href="/vendor/register">{d.addBusiness}</ButtonPrimary>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!sites.length ? (
        <p className="text-sm text-neutral-500">{d.noBusinesses}</p>
      ) : (
        <ul className="space-y-4">
          {sites.map((site) => (
            <li key={site.id} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{site.name}</h2>
                    <StatusBadge status={site.submission_status} kind="site" />
                    {!!site.is_primary && <span className="text-xs text-neutral-500">· {d.primary}</span>}
                  </div>
                  {site.submission_status === 'rejected' && site.rejection_reason && (
                    <p className="mt-2 text-sm text-red-600">
                      {d.reasonLabel}: {site.rejection_reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {!site.is_primary && site.submission_status === 'approved' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => makePrimary(site.id)}
                      className="text-sm text-primary-600 hover:underline disabled:opacity-50 dark:text-primary-400"
                    >
                      {d.makePrimary}
                    </button>
                  )}
                  {site.submission_status !== 'rejected' && (
                    <a
                      href={`/vendor/products/new?site=${site.id}`}
                      className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {d.newProduct}
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
