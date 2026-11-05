'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, Event, EventStatus, eventsApi } from '@/lib/api'
import { eventDate } from '@/lib/eventForm'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import StatusBadge from '../../StatusBadge'

const STATUSES: EventStatus[] = ['draft', 'pending', 'approved', 'rejected', 'cancelled', 'completed']

/**
 * `/vendor/events` — the events this vendor has put up.
 *
 * Which action a row offers is the server's rule, not a guess: `cancelEvent` is
 * refused on anything already cancelled or completed, and `deleteEvent` only works
 * while an event is draft, rejected or cancelled. So an approved event can be
 * cancelled but not deleted, and a cancelled one can be deleted but not cancelled
 * again — offering either button otherwise would just earn an error.
 */
export default function VendorEventsPage() {
  const { t } = useLang()
  const d = t.vendorDash

  const [events, setEvents] = useState<Event[] | null>(null)
  const [status, setStatus] = useState<EventStatus | ''>('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState<{ id: number; kind: 'cancel' | 'delete' } | null>(null)

  const load = useCallback(
    async (p: number) => {
      setBusy(true)
      setError('')
      try {
        const res = await eventsApi.mine({ page: p, ...(status ? { status } : {}) })
        setEvents((prev) => (p === 1 || !prev ? res.data.data : [...prev, ...res.data.data]))
        setLastPage(res.data.last_page)
      } catch (err) {
        setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
        setEvents([])
      } finally {
        setBusy(false)
      }
    },
    [status, t.vendor.errorGeneric]
  )

  useEffect(() => {
    setPage(1)
    load(1)
  }, [load])

  const statusLabel = useMemo<Record<string, string>>(
    () => ({
      draft: d.statusDraft,
      pending: d.statusPending,
      approved: d.statusApproved,
      rejected: d.statusRejected,
      cancelled: d.statusCancelled,
      completed: d.statusCompleted,
    }),
    [d]
  )

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      setPage(1)
      await load(1)
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    } finally {
      setBusy(false)
    }
  }

  if (!events) return <p className="text-sm text-neutral-500">{t.common.loading}</p>

  // Dates arrive as datetimes; a vendor does not need to read 00:00:00 twice.
  const when = (e: Event) => {
    const from = eventDate(e.start_date)
    const to = eventDate(e.end_date)
    if (!from && !to) return '—'
    return from === to ? from : `${from || '?'} → ${to || '?'}`
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{d.navEvents}</h1>
        <ButtonPrimary href="/vendor/events/new">{d.newEvent}</ButtonPrimary>
      </div>

      <div className="mb-5">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as EventStatus | '')}
          className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        >
          <option value="">{d.allStatuses}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!events.length ? (
        <p className="text-sm text-neutral-500">{d.noEvents}</p>
      ) : (
        <div className="[--gutter:0px]">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{d.eventTitle}</TableHeader>
                <TableHeader>{d.whenLabel}</TableHeader>
                <TableHeader>{d.taluka}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((e) => {
                const s = String(e.status)
                const canCancel = s !== 'cancelled' && s !== 'completed'
                const canDelete = s === 'draft' || s === 'rejected' || s === 'cancelled'

                return (
                  <TableRow key={e.id}>
                    <TableCell>
                      <Link href={`/vendor/events/${e.id}`} className="font-medium hover:underline">
                        {e.title}
                      </Link>
                      <div className="mt-1">
                        <StatusBadge status={s} kind="site" />
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-500">{when(e)}</TableCell>
                    <TableCell className="text-neutral-500">{e.taluka ?? '—'}</TableCell>
                    <TableCell className="space-x-3 text-right whitespace-nowrap">
                      {canCancel && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setConfirm({ id: e.id, kind: 'cancel' })}
                          className="text-sm text-amber-700 hover:underline disabled:opacity-40 dark:text-amber-400"
                        >
                          {d.cancelEvent}
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setConfirm({ id: e.id, kind: 'delete' })}
                          className="text-sm text-red-600 hover:underline disabled:opacity-40"
                        >
                          {d.deleteLabel}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {!busy && page < lastPage && (
        <button
          type="button"
          onClick={() => {
            const n = page + 1
            setPage(n)
            load(n)
          }}
          className="mt-6 rounded-full border border-neutral-300 px-5 py-2 text-sm dark:border-neutral-600"
        >
          {t.common.loadMore}
        </button>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-neutral-800">
            <h2 className="text-lg font-medium">
              {confirm.kind === 'cancel' ? d.cancelEventTitle : d.deleteTitle}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {confirm.kind === 'cancel' ? d.cancelEventBody : d.deleteBody}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirm(null)} className="px-4 py-2 text-sm">
                {t.common.cancel}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  const { id, kind } = confirm
                  setConfirm(null)
                  act(() => (kind === 'cancel' ? eventsApi.cancel(id) : eventsApi.remove(id)))
                }}
                className="rounded-full bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
