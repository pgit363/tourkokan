'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, VendorSubscriptionInfo, VendorUsageStats, vendorApi } from '@/lib/api'
import { Badge } from '@/shared/Badge'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import LeadRows from '../LeadRows'
import { PanelSkeleton, StatsSkeleton } from '../Loaders'

/** The last N days, and the N days before that, as the server wants them. */
function windows(days = 30) {
  const day = 86_400_000
  const iso = (d: number) => new Date(d).toISOString().slice(0, 10)
  const today = Date.now()

  return {
    current: { from: iso(today - (days - 1) * day), to: iso(today) },
    previous: { from: iso(today - (days * 2 - 1) * day), to: iso(today - days * day) },
  }
}

/**
 * `/vendor` — is anyone looking, has anyone asked, and how much of the plan is left.
 *
 * Leads lead. The API contract is explicit that leads are what a vendor is being
 * delivered and views are the supporting context, so enquiries get the hero
 * treatment and everything else sits beside it.
 *
 * Each figure carries its change against the previous thirty days, which the
 * reference designs put under the headline number: a count alone cannot tell a
 * vendor whether listing here is working. `myUsageStats` takes a date range, so
 * the comparison is a second call for the preceding window rather than anything
 * the server had to add.
 */
export default function VendorOverviewPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [stats, setStats] = useState<VendorUsageStats | null>(null)
  const [previous, setPrevious] = useState<VendorUsageStats | null>(null)
  const [sub, setSub] = useState<VendorSubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const w = windows()

    const [now, before, subRes] = await Promise.allSettled([
      vendorApi.myUsageStats(w.current),
      vendorApi.myUsageStats(w.previous),
      vendorApi.mySubscription(),
    ])

    if (now.status === 'fulfilled') setStats(now.value.data)
    // A missing comparison costs the delta line, not the page.
    if (before.status === 'fulfilled') setPrevious(before.value.data)
    if (subRes.status === 'fulfilled') setSub(subRes.value.data)

    if (now.status === 'rejected' && subRes.status === 'rejected') {
      const err = now.reason
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    }
    setLoading(false)
  }, [t.vendor.errorGeneric])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="space-y-10">
        <h1 className="text-2xl font-semibold">{d.title}</h1>
        <StatsSkeleton count={4} />
        <PanelSkeleton lines={2} />
      </div>
    )
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>

  const products = sub?.usage?.max_products
  const days = sub?.subscription?.days_remaining

  const delta = (current?: number, before?: number) => {
    if (current === undefined || before === undefined) return null
    return current - before
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">{d.title}</h1>

      {stats && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* The headline: enquiries are the thing being delivered. */}
          <div className="rounded-2xl border border-neutral-200 p-6 lg:row-span-2 dark:border-neutral-700">
            <div className="text-xs tracking-wide text-neutral-500 uppercase">{d.navLeads}</div>
            <div className="mt-2 text-5xl leading-none font-semibold tabular-nums">{stats.leads.total}</div>
            <Delta value={delta(stats.leads.total, previous?.leads.total)} />
            <dl className="mt-6 space-y-2 text-sm">
              <Channel label={d.leadCall} value={stats.leads.call} />
              <Channel label={d.leadWhatsapp} value={stats.leads.whatsapp} />
              <Channel label={d.leadDirections} value={stats.leads.directions} />
              <Channel label={d.leadEnquiry} value={stats.leads.enquiry} />
            </dl>
          </div>

          <Stat
            label={d.statViews}
            value={stats.views.total}
            delta={delta(stats.views.total, previous?.views.total)}
          />
          <Stat
            label={d.statUniqueViews}
            value={stats.views.unique}
            delta={delta(stats.views.unique, previous?.views.unique)}
          />
          <Stat label={d.statLive} value={stats.listings.live} hint={`${stats.listings.pending} ${d.statPending}`} />
          <Stat
            label={d.conversion}
            value={stats.conversion_rate}
            delta={delta(stats.conversion_rate, previous?.conversion_rate)}
          />
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
            <Link href="/vendor/plan" className="ml-auto text-sm text-primary-600 hover:underline dark:text-primary-400">
              {d.planAndLimits}
            </Link>
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
        <LeadRows limit={5} />
      </section>
    </div>
  )
}

/** The change line under a figure — direction in words, never colour alone. */
function Delta({ value }: { value: number | null }) {
  const { t } = useLang()
  const d = t.vendorDash

  if (value === null) return null

  const rounded = Math.round(value * 100) / 100
  const word = rounded > 0 ? d.up : rounded < 0 ? d.down : d.noChange
  const tone =
    rounded > 0 ? 'text-green-700 dark:text-green-400' : rounded < 0 ? 'text-red-600 dark:text-red-400' : 'text-neutral-500'

  return (
    <p className={`mt-2 text-xs ${tone}`}>
      {rounded === 0 ? word : `${word} ${Math.abs(rounded)}`} {d.vsPrevious}
    </p>
  )
}

function Channel({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  delta,
}: {
  label: string
  value: number
  hint?: string
  delta?: number | null
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
      <div className="text-xs tracking-wide text-neutral-500 uppercase">{label}</div>
      <div className="mt-2 text-3xl leading-none font-semibold tabular-nums">{value}</div>
      {delta !== undefined && <Delta value={delta ?? null} />}
      {hint && <div className="mt-2 text-xs text-neutral-400">{hint}</div>}
    </div>
  )
}
