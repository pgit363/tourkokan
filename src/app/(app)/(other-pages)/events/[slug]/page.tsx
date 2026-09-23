import EventDetail from './EventDetail'

/**
 * Static shell for the event detail page. See destinations/[id]/page.tsx — the
 * body is a client component that reads the slug from the URL and fetches the
 * event, so the prerendered shell is identical for every slug and the route
 * can be served as a static asset instead of rendering on the Worker.
 */
export const dynamic = 'force-static'
export const dynamicParams = true

export function generateStaticParams() {
  // The events API requires auth, so slugs cannot be enumerated at build time.
  return []
}

export default function EventDetailPage() {
  return <EventDetail />
}
