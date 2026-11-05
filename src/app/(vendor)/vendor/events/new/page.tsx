'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, EventType, eventsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import EventForm from '../../../EventForm'
import { EventFormValue, eventFormData, eventFormFrom } from '@/lib/eventForm'

/** `/vendor/events/new` — a submitted event is always `pending`, never live. */
export default function NewEventPage() {
  const { t } = useLang()
  const d = t.vendorDash
  const router = useRouter()

  const [types, setTypes] = useState<EventType[]>([])
  const [value, setValue] = useState<EventFormValue>(eventFormFrom(null))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    eventsApi
      .types()
      .then((res) => setTypes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTypes([]))
  }, [])

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      await eventsApi.create(eventFormData(value))
      router.push('/vendor/events')
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">{d.newEvent}</h1>
      <EventForm
        value={value}
        onChange={setValue}
        types={types}
        onSubmit={submit}
        submitLabel={d.submitForReview}
        busy={busy}
        error={error}
        notice={d.eventPending}
      />
    </div>
  )
}
