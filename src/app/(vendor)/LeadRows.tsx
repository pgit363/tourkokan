'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, LeadType, VendorLead, vendorApi } from '@/lib/api'
import { Badge } from '@/shared/Badge'
import { Table, TableBody, TableCell, TableRow } from '@/shared/table'
import { useCallback, useEffect, useState } from 'react'

/**
 * The enquiry list, shared by the overview (a short peek) and the leads tab (the
 * working view, with filters, paging and mark-as-read).
 *
 * One component for both so the row itself — what a lead looks like, how a type is
 * labelled, which ones read as unread — is defined once. The overview passes a
 * `limit` and gets a read-only slice.
 */
export default function LeadRows({ limit, filterable = false }: { limit?: number; filterable?: boolean }) {
  const { t } = useLang()
  const d = t.vendorDash

  const [leads, setLeads] = useState<VendorLead[] | null>(null)
  const [unread, setUnread] = useState(0)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(
    async (p: number) => {
      setBusy(true)
      setError('')
      try {
        const res = await vendorApi.myLeads({ page: p, ...(unreadOnly ? { unread_only: true } : {}) })
        const body = res.data
        setLeads((prev) => (p === 1 || !prev ? body.data : [...prev, ...body.data]))
        setLastPage(body.last_page)
        setUnread(body.unread_count)
      } catch (err) {
        setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
        setLeads([])
      } finally {
        setBusy(false)
      }
    },
    [unreadOnly, t.vendor.errorGeneric]
  )

  useEffect(() => {
    setPage(1)
    load(1)
  }, [load])

  const typeLabel = (type: LeadType) =>
    ({ call: d.leadCall, whatsapp: d.leadWhatsapp, directions: d.leadDirections, enquiry: d.leadEnquiry })[type] ??
    type

  const markRead = async (id: number) => {
    // Optimistic: the row is already in front of the vendor, and a failed write is
    // corrected by the next load rather than being worth a spinner.
    setLeads((prev) => prev?.map((l) => (l.id === id ? { ...l, is_read: true } : l)) ?? prev)
    setUnread((n) => Math.max(0, n - 1))
    try {
      await vendorApi.markLeadRead({ id })
    } catch {
      load(1)
    }
  }

  if (!leads) return <p className="text-sm text-neutral-500">{t.common.loading}</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  const rows = typeof limit === 'number' ? leads.slice(0, limit) : leads

  if (!rows.length) return <p className="text-sm text-neutral-500">{d.noLeads}</p>

  return (
    <div>
      {filterable && (
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setUnreadOnly((v) => !v)}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-600"
          >
            {unreadOnly ? d.filterAll : d.filterUnread}
          </button>
          {unread > 0 && (
            <span className="text-sm text-neutral-500">
              {unread} {d.unread}
            </span>
          )}
        </div>
      )}

      {/* `table.tsx` offsets itself against the container's --gutter. */}
      <div className="[--gutter:0px]">
        <Table dense>
          <TableBody>
            {rows.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Badge color={lead.is_read ? 'zinc' : 'blue'}>{typeLabel(lead.lead_type)}</Badge>
                </TableCell>
                <TableCell className="font-medium">{lead.product?.name ?? d.leadUnknownProduct}</TableCell>
                <TableCell className="text-neutral-500">{lead.user?.name ?? '—'}</TableCell>
                <TableCell className="max-w-xs truncate text-neutral-500">{lead.message ?? ''}</TableCell>
                <TableCell className="text-right text-neutral-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
                {filterable && (
                  <TableCell className="text-right">
                    {!lead.is_read && (
                      <button
                        type="button"
                        onClick={() => markRead(lead.id)}
                        className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                      >
                        {d.markRead}
                      </button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {typeof limit !== 'number' && !busy && page < lastPage && (
        <button
          type="button"
          onClick={() => {
            const nextPage = page + 1
            setPage(nextPage)
            load(nextPage)
          }}
          className="mt-6 rounded-full border border-neutral-300 px-5 py-2 text-sm dark:border-neutral-600"
        >
          {t.common.loadMore}
        </button>
      )}
    </div>
  )
}
