'use client'

import { useLang } from '@/context/LanguageContext'
import { EVENT_TALUKAS, EventType } from '@/lib/api'
import { EventFormValue, firstMissingEventField } from '@/lib/eventForm'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, FieldGroup, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { Spinner } from './Loaders'
import Textarea from '@/shared/Textarea'
import { useState } from 'react'

export default function EventForm({
  value,
  onChange,
  types,
  existingBannerUrl,
  onSubmit,
  submitLabel,
  busy,
  error,
  notice,
}: {
  value: EventFormValue
  onChange: (next: EventFormValue) => void
  types: EventType[]
  existingBannerUrl?: string | null
  onSubmit: () => void
  submitLabel: string
  busy?: boolean
  error?: string
  notice?: string
}) {
  const { t } = useLang()
  const d = t.vendorDash
  const [localError, setLocalError] = useState('')

  const set = <K extends keyof EventFormValue>(key: K, v: EventFormValue[K]) => onChange({ ...value, [key]: v })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const missing = firstMissingEventField(value, {
      title: d.eventTitle,
      description: d.descriptionLabel,
      address: d.address,
      taluka: d.taluka,
      startDate: d.startDate,
      endDate: d.endDate,
      entryFee: d.entryFee,
      registrationLink: d.registrationLink,
    })
    if (missing) {
      setLocalError(`${d.pleaseFill}: ${missing}`)
      return
    }
    setLocalError('')
    onSubmit()
  }

  const shown = localError || error
  const selectClass =
    'w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm dark:border-neutral-600 dark:bg-neutral-900'

  return (
    <form onSubmit={submit}>
      {notice && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          {notice}
        </p>
      )}

      <FieldGroup>
        <Field>
          <Label>{d.eventTitle}</Label>
          <Input value={value.title} onChange={(e) => set('title', e.target.value)} required />
        </Field>

        <Field>
          <Label>{d.descriptionLabel}</Label>
          <Textarea rows={4} value={value.description} onChange={(e) => set('description', e.target.value)} />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <Label>{d.eventType}</Label>
            <select
              value={value.event_type_id}
              onChange={(e) => set('event_type_id', e.target.value ? Number(e.target.value) : '')}
              className={selectClass}
            >
              <option value="">—</option>
              {types.map((ty) => (
                <option key={ty.id} value={ty.id}>
                  {ty.name}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <Label>{d.taluka}</Label>
            <select value={value.taluka} onChange={(e) => set('taluka', e.target.value)} className={selectClass}>
              <option value="">—</option>
              {EVENT_TALUKAS.map((tk) => (
                <option key={tk} value={tk}>
                  {tk}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <Label>{d.venue}</Label>
            <Input value={value.venue_name} onChange={(e) => set('venue_name', e.target.value)} />
          </Field>
          <Field>
            <Label>{d.address}</Label>
            <Input value={value.address} onChange={(e) => set('address', e.target.value)} required />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-4">
          <Field>
            <Label>{d.startDate}</Label>
            <Input type="date" value={value.start_date} onChange={(e) => set('start_date', e.target.value)} required />
          </Field>
          <Field>
            <Label>{d.endDate}</Label>
            <Input type="date" value={value.end_date} onChange={(e) => set('end_date', e.target.value)} required />
          </Field>
          <Field>
            <Label>{d.startTime}</Label>
            <Input type="time" value={value.start_time} onChange={(e) => set('start_time', e.target.value)} />
          </Field>
          <Field>
            <Label>{d.endTime}</Label>
            <Input type="time" value={value.end_time} onChange={(e) => set('end_time', e.target.value)} />
          </Field>
        </div>

        <Field>
          <Label>{d.banner}</Label>
          {existingBannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- S3 host is not in the Image loader allowlist
            <img src={existingBannerUrl} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" />
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => set('banner', e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm dark:file:bg-neutral-700"
          />
          <p className="mt-2 text-xs text-neutral-500">{d.bannerHint}</p>
        </Field>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={value.is_free} onChange={(e) => set('is_free', e.target.checked)} />
            {d.isFree}
          </label>
          {!value.is_free && (
            <Field>
              <Label>{d.entryFee}</Label>
              <Input
                inputMode="decimal"
                value={value.entry_fee}
                onChange={(e) => set('entry_fee', e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Field>
          )}

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={value.registration_required}
              onChange={(e) => set('registration_required', e.target.checked)}
            />
            {d.registrationRequired}
          </label>
          {value.registration_required && (
            <Field>
              <Label>{d.registrationLink}</Label>
              <Input
                type="url"
                value={value.registration_link}
                onChange={(e) => set('registration_link', e.target.value)}
              />
            </Field>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <Label>{d.maxParticipants}</Label>
            <Input
              inputMode="numeric"
              value={value.max_participants}
              onChange={(e) => set('max_participants', e.target.value.replace(/[^0-9]/g, ''))}
            />
          </Field>
          <Field>
            <Label>{d.tags}</Label>
            <Input value={value.tags} onChange={(e) => set('tags', e.target.value)} />
            <p className="mt-2 text-xs text-neutral-500">{d.tagsHint}</p>
          </Field>
        </div>

        <h2 className="pt-2 text-base font-medium">{d.organiser}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <Label>{d.organiserName}</Label>
            <Input value={value.organizer_name} onChange={(e) => set('organizer_name', e.target.value)} />
          </Field>
          <Field>
            <Label>{d.organiserPhone}</Label>
            <Input value={value.organizer_phone} onChange={(e) => set('organizer_phone', e.target.value)} />
          </Field>
          <Field>
            <Label>{d.contactPerson}</Label>
            <Input value={value.contact_person_name} onChange={(e) => set('contact_person_name', e.target.value)} />
          </Field>
          <Field>
            <Label>{d.contactPhone}</Label>
            <Input value={value.contact_person_phone} onChange={(e) => set('contact_person_phone', e.target.value)} />
          </Field>
        </div>
      </FieldGroup>

      {shown && <p className="mt-6 text-sm text-red-600 dark:text-red-400">{shown}</p>}

      <ButtonPrimary type="submit" disabled={busy} className="mt-8">
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="h-4 w-4 border-2" />
            {t.common.saving}
          </span>
        ) : (
          submitLabel
        )}
      </ButtonPrimary>
    </form>
  )
}
