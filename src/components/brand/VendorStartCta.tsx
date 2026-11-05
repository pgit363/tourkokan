'use client'

import { useAuth } from '@/context/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'

/**
 * The call to action on the public "list your business" page.
 *
 * It used to be a Play Store badge, because onboarding lived in the app. It does
 * not any more — `vendorOnboard` refuses any client that does not identify as web
 * — so sending someone to the store was sending them somewhere that cannot take
 * their registration.
 *
 * A client component so it can tell the three cases apart: an existing vendor is
 * offered their dashboard rather than a wizard that would refuse them (the server
 * admits `vendorOnboard` only for accounts with zero sites), and everyone else gets
 * the wizard, which handles its own sign-in.
 *
 * English to match the page it sits on, which is not yet translated.
 */
export default function VendorStartCta({ className, light }: { className?: string; light?: boolean }) {
  const { isVendor, isLoading } = useAuth()

  // Render the common case while auth settles rather than flashing a wrong label.
  const label = !isLoading && isVendor ? 'Go to my dashboard' : 'Register my business'
  const href = !isLoading && isVendor ? '/vendor' : '/vendor/register'

  if (light) {
    return (
      <a
        href={href}
        className={`inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-medium text-primary-700 transition hover:bg-primary-50 ${className ?? ''}`}
      >
        {label}
      </a>
    )
  }

  return (
    <ButtonPrimary href={href} className={className}>
      {label}
    </ButtonPrimary>
  )
}
