import { ApplicationLayout } from '../(app)/application-layout'
import VendorGuard from './VendorGuard'
import VendorNavigation from './VendorNavigation'

/**
 * `/vendor/*` — the vendor's own dashboard.
 *
 * Its own route group rather than a page under `(app)/(other-pages)`, which would
 * drag `VendorAcquireBanner` along: a "register your business" strip underneath the
 * dashboard of someone who already has one. `/vendor/register` stays where it is —
 * it is acquisition, and the banner correctly hides itself there.
 */
export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ApplicationLayout>
      <div className="bg-neutral-50 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="container">
            <VendorNavigation />
          </div>
        </div>
        <div className="container pt-10 pb-24">
          <VendorGuard>{children}</VendorGuard>
        </div>
      </div>
    </ApplicationLayout>
  )
}
