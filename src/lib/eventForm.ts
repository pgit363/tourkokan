import { Event } from '@/lib/api'

/**
 * The event form's data layer, kept out of the component file.
 *
 * Not a style preference: a module that exports both a React component and plain
 * values is outside Fast Refresh's rendering tree, so editing it forces a full
 * reload — and in dev that left `/vendor/events/new` served but never hydrated,
 * frozen on "Checking your account…". Next says so in as many words in the console.
 * `lib/productAttributes.ts` is the same split for the same reason.
 */

/** The date half of an event's `YYYY-MM-DD HH:MM:SS`, safe on null and on a plain date. */
export function eventDate(value?: string | null): string {
  return (value ?? '').slice(0, 10)
}

export interface EventFormValue {
  title: string
  description: string
  event_type_id: number | ''
  venue_name: string
  address: string
  taluka: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  is_free: boolean
  entry_fee: string
  registration_required: boolean
  registration_link: string
  max_participants: string
  tags: string
  organizer_name: string
  organizer_phone: string
  contact_person_name: string
  contact_person_phone: string
  video_url: string
  banner: File | null
}

export function eventFormFrom(e?: Event | null): EventFormValue {
  return {
    title: e?.title ?? '',
    description: e?.description ?? '',
    event_type_id: e?.event_type_id ?? '',
    venue_name: e?.venue_name ?? '',
    address: e?.address ?? '',
    taluka: e?.taluka ?? '',
    // The server returns these as 'YYYY-MM-DD HH:MM:SS'. An <input type="date">
    // silently refuses anything but 'YYYY-MM-DD', so without the slice the editor
    // opened with both dates blank and saving would have cleared them.
    start_date: eventDate(e?.start_date),
    end_date: eventDate(e?.end_date),
    // The server stores HH:MM:SS; <input type="time"> wants HH:MM.
    start_time: (e?.start_time ?? '').slice(0, 5),
    end_time: (e?.end_time ?? '').slice(0, 5),
    is_free: e?.is_free ?? true,
    entry_fee: e?.entry_fee != null ? String(e.entry_fee) : '',
    registration_required: e?.registration_required ?? false,
    registration_link: e?.registration_link ?? '',
    max_participants: e?.max_participants != null ? String(e.max_participants) : '',
    tags: Array.isArray(e?.tags) ? e!.tags!.join(', ') : '',
    organizer_name: e?.organizer_name ?? '',
    organizer_phone: e?.organizer_phone ?? '',
    contact_person_name: e?.contact_person_name ?? '',
    contact_person_phone: e?.contact_person_phone ?? '',
    video_url: e?.video_url ?? '',
    banner: null,
  }
}

/**
 * Turns the form into the multipart body `createEvent`/`updateEvent` expect.
 *
 * Multipart rather than JSON because the banner is a file upload, and the contract
 * is multipart whenever one is attached. Booleans go as '1'/'0' and `tags[]` is
 * repeated, which is how Laravel reads an array out of a form body — the same
 * encoding the onboarding wizard already uses.
 *
 * `start_time` is padded back to HH:MM:SS, and blank optional fields are omitted
 * rather than sent empty: `ConvertEmptyStringsToNull` would turn '' into null and
 * a nullable-but-validated field (a URL, a date) would then fail on a value the
 * vendor never typed.
 */
export function eventFormData(v: EventFormValue, id?: number): FormData {
  const fd = new FormData()
  if (id) fd.append('id', String(id))

  const put = (key: string, value: string) => {
    if (value.trim() !== '') fd.append(key, value.trim())
  }

  put('title', v.title)
  put('description', v.description)
  put('address', v.address)
  put('taluka', v.taluka)
  put('start_date', v.start_date)
  put('end_date', v.end_date)
  put('venue_name', v.venue_name)
  put('video_url', v.video_url)
  put('organizer_name', v.organizer_name)
  put('organizer_phone', v.organizer_phone)
  put('contact_person_name', v.contact_person_name)
  put('contact_person_phone', v.contact_person_phone)
  put('max_participants', v.max_participants)

  if (v.event_type_id !== '') fd.append('event_type_id', String(v.event_type_id))
  if (v.start_time) fd.append('start_time', `${v.start_time}:00`)
  if (v.end_time) fd.append('end_time', `${v.end_time}:00`)

  fd.append('is_free', v.is_free ? '1' : '0')
  if (!v.is_free) put('entry_fee', v.entry_fee)

  fd.append('registration_required', v.registration_required ? '1' : '0')
  if (v.registration_required) put('registration_link', v.registration_link)

  v.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .forEach((tag) => fd.append('tags[]', tag))

  if (v.banner) fd.append('banner_image', v.banner)

  return fd
}

/** The required fields, checked here so the server is not asked to reject a blank. */
export function firstMissingEventField(v: EventFormValue, labels: Record<string, string>): string {
  if (!v.title.trim()) return labels.title
  if (!v.description.trim()) return labels.description
  if (!v.address.trim()) return labels.address
  if (!v.taluka) return labels.taluka
  if (!v.start_date) return labels.startDate
  if (!v.end_date) return labels.endDate
  if (v.end_date < v.start_date) return labels.endDate
  if (!v.is_free && !v.entry_fee.trim()) return labels.entryFee
  if (v.registration_required && !v.registration_link.trim()) return labels.registrationLink
  return ''
}
