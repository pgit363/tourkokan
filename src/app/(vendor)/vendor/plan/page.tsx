'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, PlanOption, VendorSubscriptionInfo, vendorApi } from '@/lib/api'
import { Badge } from '@/shared/Badge'
import { PanelSkeleton } from '../../Loaders'
import { useEffect, useState } from 'react'

/**
 * `/vendor/plan` — the current plan, what is left of each quota, and what else exists.
 *
 * `limit: null` means unlimited and is rendered as such; rendering it as zero would
 * tell a vendor on an unmetered plan that they may list nothing.
 *
 * Quota refusals do not come from here — they arrive on `addProduct`, `addSite` and
 * `uploadProductMedia` with a message that already names the plan and the number.
 * Those screens show that message; this one is the standing picture.
 */
export default function VendorPlanPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [info, setInfo] = useState<VendorSubscriptionInfo | null>(null)
  const [plans, setPlans] = useState<PlanOption[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    vendorApi
      .mySubscription()
      .then((res) => setInfo(res.data))
      .catch((err) => setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric))
    vendorApi
      .listPlans()
      .then((res) => setPlans(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPlans([]))
  }, [t.vendor.errorGeneric])

  if (error && !info) return <p className="text-sm text-red-600">{error}</p>
  if (!info) {
    return (
      <div className="max-w-2xl space-y-10">
        <h1 className="text-2xl font-semibold">{d.planAndLimits}</h1>
        <PanelSkeleton lines={2} />
        <PanelSkeleton lines={4} />
      </div>
    )
  }

  const quotaLabel: Record<string, string> = {
    max_sites: d.quotaMaxSites,
    max_products: d.quotaMaxProducts,
    max_images_per_product: d.quotaMaxImagesPerProduct,
    featured_slots: d.quotaFeaturedSlots,
  }

  const days = info.subscription?.days_remaining

  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="text-2xl font-semibold">{d.planAndLimits}</h1>

      <section className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-medium">{d.currentPlan}</h2>
          {info.plan && <Badge color="blue">{info.plan.name}</Badge>}
          {info.subscription?.early_adopter && <Badge color="amber">{d.earlyAdopter}</Badge>}
          {typeof days === 'number' && (
            <span className="text-sm text-neutral-500">
              {days} {d.daysLeft}
            </span>
          )}
        </div>
        {info.plan?.description && (
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{info.plan.description}</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-base font-medium">{d.yourUsage}</h2>
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {Object.entries(info.usage ?? {}).map(([key, quota]) => (
            <li key={key} className="flex items-center justify-between py-3 text-sm">
              <span>{quotaLabel[key] ?? key}</span>
              <span className="tabular-nums text-neutral-600 dark:text-neutral-300">
                {quota.limit === null ? (
                  d.unmetered
                ) : quota.used === undefined ? (
                  quota.limit
                ) : (
                  <>
                    {quota.used} / {quota.limit}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {plans.length > 1 && (
        <section>
          <h2 className="mb-4 text-base font-medium">{d.availablePlans}</h2>
          <ul className="space-y-3">
            {plans.map((plan) => (
              <li
                key={plan.code}
                className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700"
              >
                <span className="font-medium">{plan.name}</span>
                <span className="text-neutral-500">
                  {plan.price} {plan.currency ?? ''} · {plan.billing_period ?? ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
