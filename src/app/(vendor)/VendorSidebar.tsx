'use client'

import { useLang } from '@/context/LanguageContext'
import { VendorSite, vendorApi } from '@/lib/api'
import Logo from '@/shared/Logo'
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CreditCardIcon,
  InboxIcon,
  Squares2X2Icon,
  TagIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * The console's own navigation — a vertical rail, not a strip of tabs under the
 * public site's header.
 *
 * The dashboard previously inherited `BrandHeader`/`BrandFooter`, so a vendor
 * managing a catalog sat below Destinations / Events / Bus Routes and above a Play
 * Store badge. That reads as a page on tourkokan.com rather than a place of work,
 * which is exactly the complaint it earned.
 *
 * The outlet name is shown under the Vendor mark because "whose console is this"
 * is the one piece of context every screen here assumes.
 */
export default function VendorSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLang()
  const d = t.vendorDash
  const pathname = usePathname()
  const [business, setBusiness] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    vendorApi
      .mySubmissions()
      .then((res) => {
        if (!alive) return
        const rows: VendorSite[] = res.data.data
        const primary = rows.find((s) => s.is_primary) ?? rows[0]
        setBusiness(primary?.name ?? null)
      })
      // Silent: a missing name costs a line of context, and this is chrome — it must
      // never be what stops the dashboard rendering.
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const items = [
    { href: '/vendor', label: d.navOverview, Icon: Squares2X2Icon },
    { href: '/vendor/businesses', label: d.navBusinesses, Icon: BuildingStorefrontIcon },
    { href: '/vendor/products', label: d.navProducts, Icon: TagIcon },
    { href: '/vendor/leads', label: d.navLeads, Icon: InboxIcon },
    { href: '/vendor/analytics', label: d.navAnalytics, Icon: ChartBarIcon },
    { href: '/vendor/plan', label: d.navPlan, Icon: CreditCardIcon },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2">
          <Logo className="w-24" />
          <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary-700 uppercase dark:bg-primary-900/30 dark:text-primary-300">
            {d.vendorLabel}
          </span>
        </div>
        {business && <p className="mt-3 truncate text-sm text-neutral-500">{business}</p>}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ href, label, Icon }) => {
          // Exact for the overview, prefix elsewhere, so /vendor/products/12 keeps
          // the Products item lit.
          const active = href === '/vendor' ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-neutral-200 px-3 py-4 dark:border-neutral-800">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeftIcon className="h-5 w-5 shrink-0" />
          {d.backToSite}
        </Link>
      </div>
    </div>
  )
}
