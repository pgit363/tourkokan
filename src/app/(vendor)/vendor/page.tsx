'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, VendorSubscriptionInfo, VendorUsageStats, vendorApi } from '@/lib/api'
import { Badge } from '@/shared/Badge'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import LeadRows from '../LeadRows'

/**
 * `/vendor` — what a vendor wants to know on opening the dashboard: is anyone
 * looking, has anyone asked, and how much of the plan is left.
 *
 * `myUsageStats` and `mySubscription` are fetched together because neither is
 * useful alone — "12 listings" means nothing without the limit it is counting
 * towards. A failure in one still renders the other rather than blanking the page.
 */
export default function VendorOverviewPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [stats, setStats] = useState<VendorUsageStats | null>(null)
  const [sub, setSub] = useState<VendorSubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const [statsRes, subRes] = await Promise.allSettled([vendorApi.myUsageStats(), vendorApi.mySubscription()])

    if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
    if (subRes.status === 'fulfilled') setSub(subRes.value.data)

    if (statsRes.status === 'rejected' && subRes.status === 'rejected') {
      const err = statsRes.reason
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    }
    setLoading(false)
  }, [t.vendor.errorGeneric])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <p className="text-sm text-neutral-500">{t.common.loading}</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  const products = sub?.usage?.max_products
  const days = sub?.subscription?.days_remaining

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">{d.title}</h1>

      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Stat label={d.statViews} value={stats.views.total} />
          <Stat label={d.statUniqueViews} value={stats.views.unique} />
          <Stat label={d.navLeads} value={stats.leads.total} />
          <Stat label={d.statConversion} value={stats.conversion_rate} />
          <Stat label={d.statLive} value={stats.listings.live} hint={`${stats.listings.pending} ${d.statPending}`} />
        </div>
      )}

      {sub && (
        <section className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-medium">{d.planLabel}</h2>
            {sub.plan && <Badge color="blue">{sub.plan.name}</Badge>}
            {sub.subscription?.early_adopter && <Badge color="amber">{d.earlyAdopter}</Badge>}
            {typeof days === 'number' && (
              <span className="text-sm text-neutral-500">
                {days} {d.daysLeft}
              </span>
            )}
          </div>
          {products && (
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
              {d.listingsUsed}: {products.used ?? 0} / {products.limit ?? d.unmetered}
            </p>
          )}
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium">{d.recentLeads}</h2>
          <Link href="/vendor/leads" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
            {d.viewAll}
          </Link>
        </div>
        {/* Five is enough to answer "did anything come in?" — the leads tab is for
            working through them. */}
        <LeadRows limit={5} />
      </section>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-neutral-500">{label}</div>
      {hint && <div className="mt-1 text-xs text-neutral-400">{hint}</div>}
    </div>
  )
}
