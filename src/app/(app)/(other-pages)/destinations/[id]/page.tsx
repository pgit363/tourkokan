import DestinationDetail from './DestinationDetail'

/**
 * Static shell for the destination detail page.
 *
 * The page body is a client component that reads the id from the URL and
 * fetches the destination itself, so the server-rendered output is the same
 * loading shell for every id. Prerendering that shell turns this route into a
 * static asset: it is served straight from the ASSETS binding and costs the
 * Worker no CPU time, which matters on the Cloudflare free plan (10ms/request).
 *
 * The data stays live because it is still fetched in the browser on every view.
 */
export const dynamic = 'force-static'
export const dynamicParams = true

export function generateStaticParams() {
  // The detail API requires auth, so ids cannot be enumerated at build time.
  // An empty list still prerenders the shell and lets any id resolve to it.
  return []
}

export default function DestinationDetailPage() {
  return <DestinationDetail />
}
