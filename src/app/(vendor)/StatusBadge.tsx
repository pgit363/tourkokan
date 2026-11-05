'use client'

import { useLang } from '@/context/LanguageContext'
import { Badge } from '@/shared/Badge'

type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'paused' | string

/**
 * One status chip for both listings and outlets — they share the lifecycle
 * (`draft → pending → approved`, with `rejected` and the vendor-controlled
 * `paused`), so they should not drift into two colour schemes.
 *
 * `approved` reads as "Live" for a listing, because that is what approval means to
 * a vendor, and as "Approved" for an outlet, which is not itself visible to buyers.
 */
export default function StatusBadge({ status, kind = 'listing' }: { status?: Status; kind?: 'listing' | 'site' }) {
  const { t } = useLang()
  const d = t.vendorDash

  if (!status) return null

  const map: Record<string, { label: string; color: 'green' | 'amber' | 'red' | 'zinc' }> = {
    approved: {
      label: kind === 'listing' ? d.statusLive : d.statusApproved,
      color: 'green',
    },
    pending: { label: d.statusPending, color: 'amber' },
    rejected: { label: d.statusRejected, color: 'red' },
    draft: { label: d.statusDraft, color: 'zinc' },
    paused: { label: d.statusPaused, color: 'zinc' },
  }

  const entry = map[status]
  if (!entry) return <Badge color="zinc">{status}</Badge>

  return <Badge color={entry.color}>{entry.label}</Badge>
}
