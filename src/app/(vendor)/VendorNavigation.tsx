'use client'

import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * The dashboard's tab bar. Modelled on `(account)/PageNavigation.tsx`, but the
 * labels come from `useLang` — the account one hardcodes English, which this app's
 * own rules do not allow for user-facing text.
 */
export default function VendorNavigation() {
  const { t } = useLang()
  const d = t.vendorDash
  const pathname = usePathname()

  const items = [
    { href: '/vendor', label: d.navOverview },
    { href: '/vendor/businesses', label: d.navBusinesses },
    { href: '/vendor/products', label: d.navProducts },
    { href: '/vendor/leads', label: d.navLeads },
    { href: '/vendor/analytics', label: d.navAnalytics },
    { href: '/vendor/plan', label: d.navPlan },
  ]

  return (
    <nav className="flex gap-2 overflow-x-auto whitespace-nowrap">
      {items.map((item) => {
        // Exact match for the overview, prefix match elsewhere, so a nested route
        // like /vendor/products/12 keeps its own tab lit — the account bar uses
        // strict equality and goes blank on any child route.
        const isActive = item.href === '/vendor' ? pathname === item.href : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium ${
              isActive
                ? 'border-primary-500 text-primary-700 dark:text-primary-300'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
