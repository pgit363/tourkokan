import VendorGuard from './VendorGuard'
import VendorShell from './VendorShell'

/**
 * `/vendor/*` — the vendor's own console.
 *
 * Its own route group AND its own chrome. `ApplicationLayout` is deliberately not
 * used: the public header and footer belong to the tourist site, and wearing them
 * made the dashboard read as a page on tourkokan.com rather than somewhere a
 * business owner works. `/vendor/register` stays outside this group — that is
 * acquisition, and it should look like the website, because the person reading it
 * is still a visitor.
 */
export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <VendorShell>
      <VendorGuard>{children}</VendorGuard>
    </VendorShell>
  )
}
