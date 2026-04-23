'use client'

import { categoriesApi, Category } from '@/lib/api'
import { ArrowRightIcon, ArrowLeftIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ImageAdd02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'

const TOTAL_STEPS = 4

const stepTitles = [
  'Basic Information',
  'Location Details',
  'Description',
  'Photos & Submit',
]

// ── Reusable field wrapper ────────────────────────────────────────────────────

const FieldWrap = ({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
  </div>
)

const inputCls =
  'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-700 dark:text-white'

// ── Steps ─────────────────────────────────────────────────────────────────────

const Step1 = ({
  data,
  onChange,
  categories,
}: {
  data: Record<string, string>
  onChange: (key: string, val: string) => void
  categories: Category[]
}) => {
  const [parentId, setParentId] = useState('')

  const selectedParent = categories.find((c) => String(c.id) === parentId)
  const subCategories = selectedParent?.sub_categories ?? []

  const handleParentChange = (val: string) => {
    setParentId(val)
    onChange('category_id', '')
    // if parent has no sub-categories, use parent id directly
    const parent = categories.find((c) => String(c.id) === val)
    if (parent && (!parent.sub_categories || parent.sub_categories.length === 0)) {
      onChange('category_id', val)
    }
  }

  return (
    <div className="space-y-6">
      <FieldWrap label="Place Name (English)">
        <input
          className={inputCls}
          placeholder="e.g. Devgad Beach"
          value={data.name ?? ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap label="Place Name (Marathi)" hint="Optional — helps local travellers find the place">
        <input
          className={inputCls}
          placeholder="e.g. देवगड बीच"
          value={data.mr_name ?? ''}
          onChange={(e) => onChange('mr_name', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap label="Category">
        <select
          className={inputCls}
          value={parentId}
          onChange={(e) => handleParentChange(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </FieldWrap>

      <FieldWrap label="Sub-category">
        <select
          className={inputCls}
          value={data.category_id ?? ''}
          onChange={(e) => onChange('category_id', e.target.value)}
          disabled={subCategories.length === 0}
        >
          <option value="">{subCategories.length === 0 ? 'Select a category first' : 'Select a sub-category'}</option>
          {subCategories.map((sub) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
      </FieldWrap>
    </div>
  )
}

// ── Map Picker Modal ──────────────────────────────────────────────────────────

type LatLng = { lat: number; lng: number }
const KOKAN_CENTER: LatLng = { lat: 16.7, lng: 73.3 }

const MapPickerModal = ({
  isOpen,
  onClose,
  initialPos,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  initialPos: LatLng | null
  onConfirm: (pos: LatLng) => void
}) => {
  const [pos, setPos] = useState<LatLng>(initialPos ?? KOKAN_CENTER)

  useEffect(() => {
    if (isOpen) setPos(initialPos ?? KOKAN_CENTER)
  }, [isOpen, initialPos])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">Choose Location on Map</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="px-5 py-2 text-xs text-neutral-500 dark:text-neutral-400">
          Click anywhere on the map or drag the pin to set the exact location.
        </p>

        {/* Map */}
        <div className="h-80 w-full">
          <Map
            defaultCenter={initialPos ?? KOKAN_CENTER}
            defaultZoom={11}
            mapId="tourkokan-picker"
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={(e) => {
              if (e.detail.latLng) setPos({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng })
            }}
          >
            <AdvancedMarker
              position={pos}
              draggable
              onDragEnd={(e) => {
                if (e.latLng) setPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
              }}
            />
          </Map>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4 dark:border-neutral-700">
          <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
            {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}
          </p>
          <button
            type="button"
            onClick={() => { onConfirm(pos); onClose() }}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Use this location
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

const Step2 = ({
  data,
  onChange,
}: {
  data: Record<string, string>
  onChange: (key: string, val: string) => void
}) => {
  const [mapOpen, setMapOpen] = useState(false)

  const initialPos: LatLng | null =
    data.latitude && data.longitude
      ? { lat: Number(data.latitude), lng: Number(data.longitude) }
      : null

  const handleConfirm = (pos: LatLng) => {
    onChange('latitude', pos.lat.toFixed(6))
    onChange('longitude', pos.lng.toFixed(6))
  }

  return (
    <div className="space-y-6">
      <FieldWrap label="Taluka / Town">
        <input
          className={inputCls}
          placeholder="e.g. Devgad"
          value={data.taluka ?? ''}
          onChange={(e) => onChange('taluka', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap label="District">
        <input
          className={inputCls}
          placeholder="e.g. Sindhudurg"
          value={data.district ?? ''}
          onChange={(e) => onChange('district', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap label="Coordinates">
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700 transition hover:border-primary-400 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
        >
          <MapPinIcon className="h-5 w-5 shrink-0" />
          {initialPos
            ? `${data.latitude}, ${data.longitude}`
            : 'Choose location on map'}
        </button>
        {initialPos && (
          <p className="mt-1.5 text-xs text-neutral-400">
            Tap the button to adjust the pin position.
          </p>
        )}
      </FieldWrap>

      <MapPickerModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        initialPos={initialPos}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

const Step3 = ({
  data,
  onChange,
}: {
  data: Record<string, string>
  onChange: (key: string, val: string) => void
}) => (
  <div className="space-y-6">
    <FieldWrap
      label="Description"
      hint="Describe what makes this place special — best season to visit, nearby attractions, accessibility, etc."
    >
      <textarea
        className={`${inputCls} resize-none`}
        rows={8}
        placeholder="Tell travellers about this place…"
        value={data.description ?? ''}
        onChange={(e) => onChange('description', e.target.value)}
      />
    </FieldWrap>
  </div>
)

const ImageUploadBox = ({
  label,
  hint,
  file,
  onFile,
}: {
  label: string
  hint: string
  file: File | null
  onFile: (f: File | null) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
      <div
        className="flex cursor-pointer justify-center rounded-2xl border-2 border-dashed border-neutral-300 px-6 py-8 transition hover:border-primary-400 dark:border-neutral-600"
        onClick={() => inputRef.current?.click()}
      >
        <div className="space-y-2 text-center">
          <HugeiconsIcon className="mx-auto text-neutral-400" icon={ImageAdd02Icon} size={40} strokeWidth={1} />
          {file ? (
            <p className="text-sm font-medium text-primary-600">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-primary-600">Click to upload</p>
              <p className="text-xs text-neutral-400">{hint}</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AddPlacePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // TODO: wire up submission
  // const [submitting, setSubmitting] = useState(false)
  // const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  // const [error, setError] = useState('')
  // const [success, setSuccess] = useState(false)

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data.data)).catch(() => {})
  }, [])

  const update = (key: string, val: string) => setFormData((prev) => ({ ...prev, [key]: val }))

  // TODO: validation
  // const validateStep = () => {
  //   if (step === 1 && (!formData.name || !formData.category_id)) {
  //     setError('Place name and category are required.')
  //     return false
  //   }
  //   if (step === 2 && !formData.taluka) {
  //     setError('Taluka / Town is required.')
  //     return false
  //   }
  //   if (step === 3 && !formData.description) {
  //     setError('Description is required.')
  //     return false
  //   }
  //   setError('')
  //   return true
  // }

  const handleNext = () => {
    // if (!validateStep()) return
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  // TODO: API submission
  // const handleSubmit = async () => {
  //   setSubmitting(true)
  //   setError('')
  //   setFieldErrors({})
  //   try {
  //     const form = new FormData()
  //     form.append('name', formData.name ?? '')
  //     if (formData.mr_name) form.append('mr_name', formData.mr_name)
  //     if (formData.category_id) form.append('category_id', formData.category_id)
  //     if (formData.taluka) form.append('taluka', formData.taluka)
  //     if (formData.district) form.append('district', formData.district)
  //     if (formData.latitude) form.append('latitude', formData.latitude)
  //     if (formData.longitude) form.append('longitude', formData.longitude)
  //     form.append('description', formData.description ?? '')
  //     if (coverImage) form.append('image', coverImage)
  //     await sitesApi.addSite(form)
  //     setSuccess(true)
  //   } catch (err) {
  //     if (err instanceof ApiError && err.errors) {
  //       setFieldErrors(err.errors)
  //     } else {
  //       setError(err instanceof ApiError ? err.message : 'Submission failed. Please try again.')
  //     }
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }

  // TODO: success screen
  // if (success) { ... }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 sm:pt-16 lg:pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-semibold text-neutral-900 dark:text-white">{step}</span>
          <span className="text-lg text-neutral-400">/ {TOTAL_STEPS}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">{stepTitles[step - 1]}</h1>
        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-700">
          <div
            className="h-1.5 rounded-full bg-primary-600 transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        {step === 1 && <Step1 data={formData} onChange={update} categories={categories} />}
        {step === 2 && <Step2 data={formData} onChange={update} />}
        {step === 3 && <Step3 data={formData} onChange={update} />}
        {step === 4 && (
          <div className="space-y-6">
            <ImageUploadBox
              label="Cover Photo"
              hint="Main photo shown on the destination card — JPG or PNG, up to 10 MB"
              file={coverImage}
              onFile={setCoverImage}
            />

            {/* Summary */}
            <div className="rounded-xl bg-neutral-50 p-4 text-sm dark:bg-neutral-700/50">
              <p className="font-medium text-neutral-700 dark:text-neutral-300">Review your submission</p>
              <ul className="mt-2 space-y-1 text-neutral-500 dark:text-neutral-400">
                <li><strong>Name:</strong> {formData.name}</li>
                {formData.mr_name && <li><strong>Marathi:</strong> {formData.mr_name}</li>}
                <li><strong>Location:</strong> {[formData.taluka, formData.district].filter(Boolean).join(', ')}</li>
                {(formData.latitude || formData.longitude) && (
                  <li><strong>Coordinates:</strong> {formData.latitude}, {formData.longitude}</li>
                )}
              </ul>
            </div>

            {/* TODO: field-level API errors */}
            {/* {Object.entries(fieldErrors).length > 0 && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {Object.entries(fieldErrors).map(([field, msgs]) => (
                  <p key={field}><strong>{field}:</strong> {msgs[0]}</p>
                ))}
              </div>
            )} */}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 1))}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {step === 1 ? 'Back' : 'Previous'}
        </button>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Next Step {step + 1}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { /* TODO: handleSubmit() */ }}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Submit Place
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
