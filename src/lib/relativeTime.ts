/**
 * "2h", "yesterday", "3d" — the way the dashboard designs show when something
 * happened.
 *
 * A vendor reading their enquiries cares how fresh each one is, and "05/11/2026"
 * makes them work that out. Anything older than a month falls back to the date,
 * where the exact day starts mattering more than the gap.
 *
 * Deliberately not `Intl.RelativeTimeFormat`: Marathi support varies by runtime,
 * and a silent English fallback inside a Marathi page is worse than the short
 * numeric forms, which read the same in both.
 */
export function relativeTime(
  iso: string | null | undefined,
  labels: { justNow: string; yesterday: string }
): string {
  if (!iso) return '—'

  // Safari refuses 'YYYY-MM-DD HH:MM:SS'; the T makes it parse everywhere.
  const then = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T'))
  if (Number.isNaN(then.getTime())) return '—'

  const minutes = Math.floor((Date.now() - then.getTime()) / 60000)

  if (minutes < 0) return then.toLocaleDateString()
  if (minutes < 2) return labels.justNow
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days === 1) return labels.yesterday
  if (days < 30) return `${days}d`

  return then.toLocaleDateString()
}
