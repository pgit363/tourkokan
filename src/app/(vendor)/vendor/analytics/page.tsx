'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, ProductAnalytics, VendorProduct, vendorApi } from '@/lib/api'
import { useCallback, useEffect, useState } from 'react'
import DailyBars from '../../DailyBars'

/**
 * `/vendor/analytics` — one listing at a time.
 *
 * `productAnalytics` takes an id, so this is per-listing by contract; the
 * account-wide totals already live on the overview and are not repeated here.
 *
 * Leads lead and views support them: leads are what the vendor is actually being
 * delivered. The channel breakdown is direct-labelled bars rather than four
 * coloured series — the label is next to its own number, so identity never rests
 * on colour and no categorical palette is needed at all.
 */
export default function VendorAnalyticsPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [products, setProducts] = useState<VendorProduct[] | null>(null)
  const [productId, setProductId] = useState<number | ''>('')
  const [stats, setStats] = useState<ProductAnalytics | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    vendorApi
      .myProducts({ per_page: 100 })
      .then((res) => {
        setProducts(res.data.data)
        if (res.data.data.length === 1) setProductId(res.data.data[0].id)
      })
      .catch(() => setProducts([]))
  }, [])

  const load = useCallback(
    async (id: number) => {
      setBusy(true)
      setError('')
      try {
        const res = await vendorApi.productAnalytics(id)
        setStats(res.data)
      } catch (err) {
        setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
        setStats(null)
      } finally {
        setBusy(false)
      }
    },
    [t.vendor.errorGeneric]
  )

  useEffect(() => {
    if (productId) load(productId)
  }, [productId, load])

  if (!products) return <p className="text-sm text-neutral-500">{t.common.loading}</p>

  const channels = stats?.leads
    ? [
        { label: d.leadCall, value: stats.leads.call },
        { label: d.leadWhatsapp, value: stats.leads.whatsapp },
        { label: d.leadDirections, value: stats.leads.directions },
        { label: d.leadEnquiry, value: stats.leads.enquiry },
      ]
    : []
  const channelPeak = Math.max(1, ...channels.map((c) => c.value))

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">{d.navAnalytics}</h1>

      {!products.length ? (
        <p className="text-sm text-neutral-500">{d.noProducts}</p>
      ) : (
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : '')}
          className="max-w-sm rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        >
          <option value="">{d.pickProduct}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {busy && <p className="text-sm text-neutral-500">{t.common.loading}</p>}

      {stats && !busy && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label={d.navLeads} value={stats.leads?.total ?? 0} />
            <Stat label={d.statViews} value={stats.views?.total ?? 0} />
            <Stat label={d.statUniqueViews} value={stats.views?.unique ?? 0} />
            <Stat label={d.conversion} value={stats.conversion_rate ?? 0} />
          </div>

          <DailyBars daily={stats.daily ?? []} from={stats.from} to={stats.to} />

          <section>
            <h2 className="mb-4 text-base font-medium">{d.leadsByChannel}</h2>
            {channels.every((c) => !c.value) ? (
              <p className="text-sm text-neutral-500">{d.noActivity}</p>
            ) : (
              <ul className="space-y-3">
                {channels.map((c) => (
                  <li key={c.label} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-neutral-500">{c.label}</span>
                    <span
                      className="h-2.5 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
                      style={{ width: `${Math.max(c.value ? 2 : 0, (c.value / channelPeak) * 100)}%` }}
                    />
                    <span className="tabular-nums text-neutral-600 dark:text-neutral-300">{c.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-neutral-500">{label}</div>
    </div>
  )
}
