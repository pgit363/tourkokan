'use client'

import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { usePathname, useRouter } from 'next/navigation'
import { Loading } from './Loaders'
import { useEffect } from 'react'

/**
 * Who may see `/vendor/*`.
 *
 * The gate has to be client-side: the JWT lives in `localStorage`, so there is no
 * `middleware.ts` that could read it, and a server component cannot know who is
 * asking. The one rule that matters is waiting for `isLoading` before deciding —
 * every account page in this app skips that and flashes its signed-out state on
 * first paint, which here would mean briefly telling a vendor they are not one.
 *
 * Roles come from `AuthContext`, which gets them from `/v2/user-profile` (the
 * backend's `PreMiddleware` eager-loads them). A guest is never a vendor, so a
 * guest session is sent to sign in properly rather than to the onboarding wizard.
 */
export default function VendorGuard({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  const d = t.vendorDash
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading, isRealUser, isVendor } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!isRealUser) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isRealUser, pathname, router])

  if (isLoading) {
    return <Loading label={d.checking} />
  }

  // The redirect above is in flight; render nothing rather than the dashboard.
  if (!isRealUser) return null

  // Signed in, but with no business yet. Not a redirect: being told why, with a way
  // forward, beats being bounced into a wizard with no explanation.
  if (!isVendor) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold">{d.notVendorTitle}</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{d.notVendorBody}</p>
        <ButtonPrimary href="/vendor/register" className="mt-6">
          {d.notVendorCta}
        </ButtonPrimary>
      </div>
    )
  }

  return <>{children}</>
}
