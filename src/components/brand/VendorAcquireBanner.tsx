'use client'

/**
 * VendorAcquireBanner — home-page vendor acquisition slot (M7).
 *
 * The web counterpart of the app's Home VendorCTA: "be the first thing
 * travellers see" pitched at business owners, routing into the first-time
 * onboarding wizard at /vendor/register (M5).
 */

import { useLang } from '@/context/LanguageContext'
import { BuildingStorefrontIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Pages that already lead the vendor into registration — showing the banner there is redundant.
const HIDE_ON = ['/vendor/register', '/subscription']

const VendorAcquireBanner = () => {
  const { t } = useLang()
  const v = t.vendor
  const pathname = usePathname()

  if (HIDE_ON.some((p) => pathname?.startsWith(p))) return null

  return (
    <section className="container py-14 lg:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 px-6 py-12 sm:px-12 lg:px-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-purple-200">
              <BuildingStorefrontIcon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">{v.landingTitle}</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{v.landingSub}</h2>
            <ul className="mt-6 space-y-2">
              {[v.perkListing, v.perkEnquiries].map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-purple-100">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/vendor/register"
            className="shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-purple-800 shadow-lg transition-transform hover:scale-105"
          >
            {v.startCta}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default VendorAcquireBanner
