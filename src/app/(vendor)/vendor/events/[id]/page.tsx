'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, Event, EventType, eventsApi } from '@/lib/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import EventForm from '../../../EventForm'
import { EventFormValue, eventFormData, eventFormFrom } from '@/lib/eventForm'
import StatusBadge from '../../../StatusBadge'
import { PanelSkeleton } from '../../../Loaders'

/**
 * `/vendor/events/[id]` — the editor.
 *
 * There is no `getEvent` for an owner: the public endpoint is keyed by slug, and a
 * pending event has no public page. So the event is picked out of `myEvents`, which
 * returns the organiser's own events whatever their status.
 */
export default function EditEventPage() {
  const { t } = useLang()
  const d = t.vendorDash
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)

  const [event, setEvent] = useState<Event | null>(null)
  const [types, setTypes] = useState<EventType[]>([])
  const [value, setValue] = useState<EventFormValue>(eventFormFrom(null))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const load = useCallback(
    async (resetForm: boolean) => {
      try {
        // Paged until the id turns up: an organiser with many events would not
        // otherwise find an older one on the first page.
        for (let page = 1; page <= 20; page++) {
          const res = await eventsApi.mine({ page })
          const found = res.data.data.find((e) => e.id === id)
          if (found) {
            setEvent(found)
            if (resetForm) setValue(eventFormFrom(found))
            return
          }
          if (page >= res.data.last_page) break
        }
        setError(t.events.notFound)
      } catch (err) {
        setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
      }
    },
    [id, t.events.notFound, t.vendor.errorGeneric]
  )

  useEffect(() => {
    if (Number.isFinite(id)) load(true)
    eventsApi
      .types()
      .then((res) => setTypes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTypes([]))
  }, [id, load])

  const save = async () => {
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      await eventsApi.update(eventFormData(value, id))
      await load(false)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : d.saveFailed)
    } finally {
      setBusy(false)
    }
  }

  if (!event) {
    return error ? (
      <p className="text-sm text-red-600">{error}</p>
    ) : (
      <div className="max-w-2xl space-y-6"><PanelSkeleton lines={4} /><PanelSkeleton lines={3} /></div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{d.editEvent}</h1>
          <StatusBadge status={String(event.status)} kind="site" />
        </div>
        <Link href="/vendor/events" className="text-sm text-neutral-500 hover:underline">
          {d.navEvents}
        </Link>
      </div>

      <EventForm
        value={value}
        onChange={setValue}
        types={types}
        existingBannerUrl={event.banner_image_url ?? null}
        onSubmit={save}
        submitLabel={d.saveChanges}
        busy={busy}
        error={error}
      />

      {saved && <p className="mt-4 text-sm text-green-700 dark:text-green-400">{d.savedToast}</p>}
    </div>
  )
}
