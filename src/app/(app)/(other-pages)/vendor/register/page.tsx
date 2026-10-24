'use client'

/**
 * /vendor/register — first-time vendor onboarding wizard (M5).
 *
 * Google sign-in (when NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID is set) or email
 * sign-in/sign-up, then one combined submission: business details + optional
 * government verification + optional first listing. Everything posts to
 * POST /v2/vendorOnboard, which the backend only admits for accounts with zero
 * existing sites and an X-App-Source: web header — established vendors are
 * pointed at the app.
 *
 * The vendor contact gate (403 missing_profile_fields) is handled inline: the
 * wizard asks for exactly the missing fields and retries, mirroring the app's
 * ContactDetailsSheet (M2).
 */

import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import {
  ApiError,
  BusinessCategory,
  ProductCategoryOption,
  setStoredUser,
  setToken,
  vendorApi,
} from '@/lib/api'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID

type Phase = 'landing' | 'auth' | 'wizard' | 'success'
type RegType = '' | 'udyam' | 'gstin' | 'shop_act'

interface WizardForm {
  name: string
  description: string
  tagLine: string
  categoryIds: number[]
  mapsUrl: string
  latitude: string
  longitude: string
  pinCode: string
  phone: string
  whatsapp: string
  website: string
  image: File | null
  logo: File | null
  regType: RegType
  regNumber: string
  regDoc: File | null
  consent: boolean
  productCategoryId: number | ''
  productName: string
  productPrice: string
  productDesc: string
}

const EMPTY_FORM: WizardForm = {
  name: '', description: '', tagLine: '', categoryIds: [],
  mapsUrl: '', latitude: '', longitude: '', pinCode: '',
  phone: '', whatsapp: '', website: '',
  image: null, logo: null,
  regType: '', regNumber: '', regDoc: null, consent: false,
  productCategoryId: '', productName: '', productPrice: '', productDesc: '',
}

export default function VendorRegisterPage() {
  const { t } = useLang()
  const v = t.vendor
  const { user, isLoggedIn, refreshUser } = useAuth()
  const isRealUser = isLoggedIn && !user?.isGuest

  const [phase, setPhase] = useState<Phase>('landing')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<WizardForm>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [categories, setCategories] = useState<BusinessCategory[]>([])
  const [productCats, setProductCats] = useState<ProductCategoryOption[] | null>(null)

  // contact gate (mirrors app M2)
  const [gateFields, setGateFields] = useState<string[] | null>(null)
  const [gateEmail, setGateEmail] = useState('')
  const [gateMobile, setGateMobile] = useState('')

  const set = <K extends keyof WizardForm>(key: K, value: WizardForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const start = () => {
    setError('')
    setPhase(isRealUser ? 'wizard' : 'auth')
  }

  // Business categories load once the wizard is entered
  useEffect(() => {
    if (phase !== 'wizard' || categories.length) return
    vendorApi.businessCategories().then(
      (res) => setCategories(res.data ?? []),
      () => setCategories([])
    )
  }, [phase, categories.length])

  // Product categories follow the chosen business categories
  useEffect(() => {
    if (phase !== 'wizard' || step !== 4) return
    setProductCats(null)
    vendorApi.allowedProductCategories(form.categoryIds).then(
      (res) => setProductCats(res.data ?? []),
      () => setProductCats([])
    )
  }, [phase, step, form.categoryIds])

  const validateStep = (): string => {
    if (step === 0) {
      if (form.name.trim().length < 2) return v.bizName
      if (form.description.trim().length < 20) return v.bizDescPh
      if (form.categoryIds.length === 0) return v.bizCategories
    }
    if (step === 1) {
      if (!form.latitude.trim() || !form.longitude.trim()) return `${v.latitude} / ${v.longitude}`
    }
    if (step === 3 && form.regType) {
      if (!form.regNumber.trim()) return v.regNumber
      if (!form.consent) return v.consentRequired
    }
    if (step === 4 && (form.productName.trim() || form.productCategoryId)) {
      if (!form.productName.trim()) return v.productName
      if (!form.productCategoryId) return v.productCategory
    }
    return ''
  }

  const next = () => {
    const problem = validateStep()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setStep((s) => Math.min(s + 1, 5))
  }

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('description', form.description.trim())
      fd.append('latitude', form.latitude.trim())
      fd.append('longitude', form.longitude.trim())
      if (form.tagLine.trim()) fd.append('tag_line', form.tagLine.trim())
      if (form.pinCode.trim()) fd.append('pin_code', form.pinCode.trim())
      if (form.phone.trim()) fd.append('phone', form.phone.trim())
      if (form.whatsapp.trim()) fd.append('whatsapp', form.whatsapp.trim())
      if (form.website.trim()) fd.append('domain_name', form.website.trim())
      form.categoryIds.forEach((id) => fd.append('categories[]', String(id)))
      if (form.image) fd.append('image', form.image)
      if (form.logo) fd.append('logo', form.logo)
      if (form.regType && form.regNumber.trim()) {
        fd.append('reg_type', form.regType)
        fd.append('reg_number', form.regNumber.trim())
        fd.append('consent', '1')
        if (form.regDoc) fd.append('reg_doc', form.regDoc)
      }
      if (form.productName.trim() && form.productCategoryId) {
        fd.append('product[name]', form.productName.trim())
        fd.append('product[product_category_id]', String(form.productCategoryId))
        if (form.productPrice.trim()) fd.append('product[base_price]', form.productPrice.trim())
        if (form.productDesc.trim()) fd.append('product[description]', form.productDesc.trim())
      }

      await vendorApi.onboard(fd)
      setPhase('success')
    } catch (e) {
      const err = e as ApiError
      const body = err.body as { data?: { missing_profile_fields?: string[] }; message?: unknown } | undefined
      const missing = body?.data?.missing_profile_fields
      if (err.status === 403 && missing?.length) {
        setGateFields(missing)
      } else {
        const msg = body?.message
        setError(
          typeof msg === 'object' && msg !== null
            ? Object.values(msg as Record<string, string[]>).flat().join(' ')
            : (typeof msg === 'string' && msg) || err.message || v.errorGeneric
        )
      }
    } finally {
      setBusy(false)
    }
  }

  const saveGate = async () => {
    setBusy(true)
    setError('')
    try {
      const payload: { email?: string; mobile?: string } = {}
      if (gateFields?.includes('email')) payload.email = gateEmail.trim()
      if (gateFields?.includes('mobile')) payload.mobile = gateMobile.trim()
      const res = await vendorApi.updateProfile(payload)
      if (!res.success) {
        const msg = res.message
        setError(
          typeof msg === 'object' && msg !== null
            ? Object.values(msg as Record<string, string[]>).flat().join(' ')
            : (typeof msg === 'string' && msg) || v.errorGeneric
        )
        return
      }
      await refreshUser()
      setGateFields(null)
      await submit()
    } finally {
      setBusy(false)
    }
  }

  // ── landing ────────────────────────────────────────────────────────────────
  if (phase === 'landing') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 lg:py-24">
        <ShieldCheckIcon className="h-12 w-12 text-primary-600" />
        <h1 className="mt-5 text-4xl font-semibold">{v.landingTitle}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">{v.landingSub}</p>
        <ul className="mt-8 space-y-3">
          {[v.perkListing, v.perkEnquiries, v.perkEarly, v.perkVerified].map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span className="text-neutral-700 dark:text-neutral-200">{perk}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonPrimary onClick={start}>{v.startCta}</ButtonPrimary>
          <span className="text-sm text-neutral-500">{v.alreadyListed}</span>
        </div>
      </div>
    )
  }

  // ── auth ───────────────────────────────────────────────────────────────────
  if (phase === 'auth' && !isRealUser) {
    return (
      <AuthCard
        onDone={() => {
          setPhase('wizard')
        }}
      />
    )
  }

  // ── success ────────────────────────────────────────────────────────────────
  if (phase === 'success') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircleIcon className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-semibold">{v.successTitle}</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">{v.successBody}</p>
        <div className="mt-8 flex justify-center gap-4">
          <ButtonPrimary href="/download">{v.successCta}</ButtonPrimary>
          <ButtonSecondary href="/">{v.successHome}</ButtonSecondary>
        </div>
      </div>
    )
  }

  // ── contact gate ───────────────────────────────────────────────────────────
  if (gateFields) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold">{v.gateTitle}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{v.gateDesc}</p>
        <div className="mt-6 space-y-4">
          {gateFields.includes('email') && (
            <Field label={v.email}>
              <Input type="email" value={gateEmail} onChange={(e) => setGateEmail(e.target.value)} />
            </Field>
          )}
          {gateFields.includes('mobile') && (
            <Field label={v.mobile} hint={v.mobileHint}>
              <Input
                inputMode="numeric"
                maxLength={10}
                value={gateMobile}
                onChange={(e) => setGateMobile(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </Field>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <ButtonPrimary onClick={saveGate} disabled={busy}>
            {busy ? t.common.saving : v.gateSave}
          </ButtonPrimary>
        </div>
      </div>
    )
  }

  // ── wizard ─────────────────────────────────────────────────────────────────
  const stepLabels = [v.stepBusiness, v.stepLocation, v.stepContact, v.stepVerify, v.stepProduct, v.stepReview]

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 lg:pt-14">
      <div>
        <span className="text-5xl font-semibold">{step + 1}</span>
        <span className="text-lg text-neutral-500 dark:text-neutral-400"> /{stepLabels.length}</span>
        <h1 className="mt-2 text-2xl font-semibold">{stepLabels[step]}</h1>
      </div>

      <div className="listingSection__wrap mt-8 space-y-6">
        {step === 0 && (
          <>
            <Field label={v.bizName}>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={v.bizNamePh} maxLength={100} />
            </Field>
            <Field label={v.bizDesc}>
              <Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={v.bizDescPh} />
            </Field>
            <Field label={v.bizTagline}>
              <Input value={form.tagLine} onChange={(e) => set('tagLine', e.target.value)} maxLength={100} />
            </Field>
            <Field label={v.bizCategories} hint={v.bizCategoriesHint}>
              <div className="space-y-4">
                {categories.map((parent) => {
                  const subs = parent.sub_categories ?? parent.subCategories ?? []
                  const options = subs.length ? subs : [parent]
                  return (
                    <div key={parent.id}>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{parent.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {options.map((c) => {
                          const on = form.categoryIds.includes(c.id)
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() =>
                                set(
                                  'categoryIds',
                                  on ? form.categoryIds.filter((id) => id !== c.id) : [...form.categoryIds, c.id]
                                )
                              }
                              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                                on
                                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                              }`}
                            >
                              {c.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {categories.length === 0 && <p className="text-sm text-neutral-500">{t.common.loading}</p>}
              </div>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label={v.mapsUrl}>
              <div className="flex gap-2">
                <Input className="flex-1" value={form.mapsUrl} onChange={(e) => set('mapsUrl', e.target.value)} placeholder={v.mapsUrlPh} />
                <ButtonSecondary
                  type="button"
                  disabled={busy || !form.mapsUrl.trim()}
                  onClick={async () => {
                    setBusy(true)
                    setError('')
                    try {
                      const res = await vendorApi.parseMapUrl(form.mapsUrl.trim())
                      set('latitude', String(res.data.latitude))
                      setForm((f) => ({
                        ...f,
                        latitude: String(res.data.latitude),
                        longitude: String(res.data.longitude),
                      }))
                    } catch (e) {
                      setError((e as ApiError).message || v.errorGeneric)
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  {v.mapsParse}
                </ButtonSecondary>
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={v.latitude}>
                <Input inputMode="decimal" value={form.latitude} onChange={(e) => set('latitude', e.target.value)} />
              </Field>
              <Field label={v.longitude}>
                <Input inputMode="decimal" value={form.longitude} onChange={(e) => set('longitude', e.target.value)} />
              </Field>
            </div>
            <Field label={v.pinCode}>
              <Input inputMode="numeric" maxLength={6} value={form.pinCode} onChange={(e) => set('pinCode', e.target.value.replace(/[^0-9]/g, ''))} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label={v.phone}>
              <Input inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
            <Field label={v.whatsapp}>
              <Input inputMode="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
            </Field>
            <Field label={v.website}>
              <Input type="url" placeholder="https://" value={form.website} onChange={(e) => set('website', e.target.value)} />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 className="text-lg font-semibold">{v.verifTitle}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{v.verifSub}</p>
            </div>
            <Field label={v.regType}>
              <div className="flex flex-wrap gap-2">
                {([
                  ['', v.regTypeNone],
                  ['udyam', 'Udyam'],
                  ['gstin', 'GSTIN'],
                  ['shop_act', 'Shop Act'],
                ] as [RegType, string][]).map(([code, label]) => (
                  <button
                    key={code || 'none'}
                    type="button"
                    onClick={() => set('regType', code)}
                    className={`rounded-full border px-4 py-1.5 text-sm ${
                      form.regType === code
                        ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            {form.regType && (
              <>
                <Field label={v.regNumber}>
                  <Input
                    value={form.regNumber}
                    maxLength={30}
                    onChange={(e) => set('regNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9/-]/g, ''))}
                  />
                </Field>
                <Field label={v.regDoc}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => set('regDoc', e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 dark:text-neutral-300"
                  />
                </Field>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => set('consent', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded-sm border-neutral-300"
                  />
                  <span className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">{v.consentPlaceholder}</span>
                </label>
              </>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <div>
              <h2 className="text-lg font-semibold">{v.productTitle}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{v.productSub}</p>
            </div>
            {productCats === null ? (
              <p className="text-sm text-neutral-500">{t.common.loading}</p>
            ) : productCats.length === 0 ? (
              <p className="text-sm text-neutral-500">{v.productNone}</p>
            ) : (
              <>
                <Field label={v.productCategory}>
                  <div className="flex flex-wrap gap-2">
                    {productCats.map((pc) => (
                      <button
                        key={pc.id}
                        type="button"
                        onClick={() => set('productCategoryId', form.productCategoryId === pc.id ? '' : pc.id)}
                        className={`rounded-full border px-4 py-1.5 text-sm ${
                          form.productCategoryId === pc.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {pc.name}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={v.productName}>
                  <Input value={form.productName} onChange={(e) => set('productName', e.target.value)} placeholder={v.productNamePh} maxLength={150} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label={v.productPrice}>
                    <Input inputMode="decimal" value={form.productPrice} onChange={(e) => set('productPrice', e.target.value.replace(/[^0-9.]/g, ''))} />
                  </Field>
                </div>
                <Field label={v.productDesc}>
                  <Textarea rows={3} value={form.productDesc} onChange={(e) => set('productDesc', e.target.value)} />
                </Field>
              </>
            )}
          </>
        )}

        {step === 5 && (
          <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
            <ReviewRow label={v.reviewBusiness} value={`${form.name} · ${form.categoryIds.length} ${v.bizCategories}`} />
            <ReviewRow label={v.reviewLocation} value={form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : v.reviewNone} />
            <ReviewRow label={v.reviewContact} value={[form.phone, form.whatsapp, form.website].filter(Boolean).join(' · ') || v.reviewNone} />
            <ReviewRow label={v.reviewVerification} value={form.regType ? `${form.regType.toUpperCase()} · ${form.regNumber}` : v.reviewNone} />
            <ReviewRow label={v.reviewProduct} value={form.productName.trim() || v.reviewNone} />
          </dl>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <ButtonSecondary type="button" disabled={step === 0 || busy} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          {v.back}
        </ButtonSecondary>
        {step < 5 ? (
          <ButtonPrimary type="button" onClick={next}>
            {v.next}
          </ButtonPrimary>
        ) : (
          <ButtonPrimary type="button" disabled={busy} onClick={submit}>
            {busy ? v.submitting : v.submit}
          </ButtonPrimary>
        )}
      </div>
    </div>
  )
}

// ── small pieces ──────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-3 text-sm">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-800 dark:text-neutral-100">{value}</dd>
    </div>
  )
}

/**
 * Sign-in / sign-up card. Google Identity Services renders its button only
 * when NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID is configured; the email forms are the
 * always-available path (backend: /v2/auth/login, /v2/auth/register).
 */
function AuthCard({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const v = t.vendor
  const { refreshUser } = useAuth()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const googleRef = useRef<HTMLDivElement>(null)

  const adoptSession = useCallback(
    async (accessToken: string, sessionUser: unknown) => {
      setToken(accessToken)
      if (sessionUser) setStoredUser(sessionUser as Parameters<typeof setStoredUser>[0])
      await refreshUser()
      onDone()
    },
    [refreshUser, onDone]
  )

  // Google Identity Services — loaded on demand, silently absent without a client id
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleRef.current) return
    const scriptId = 'google-gsi'
    const init = () => {
      const g = (window as unknown as { google?: { accounts?: { id?: {
        initialize: (o: object) => void
        renderButton: (el: HTMLElement, o: object) => void
      } } } }).google
      if (!g?.accounts?.id || !googleRef.current) return
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp: { credential?: string }) => {
          if (!resp.credential) return
          setBusy(true)
          setError('')
          try {
            const res = await vendorApi.googleAuth(resp.credential)
            const data = res.data as { access_token?: string; user?: unknown } | undefined
            if (!data?.access_token) throw new Error(v.googleFailed)
            await adoptSession(data.access_token, data.user)
          } catch {
            setError(v.googleFailed)
          } finally {
            setBusy(false)
          }
        },
      })
      g.accounts.id.renderButton(googleRef.current, { theme: 'outline', size: 'large', width: 320 })
    }
    if (document.getElementById(scriptId)) {
      init()
      return
    }
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = init
    document.head.appendChild(script)
  }, [adoptSession, v.googleFailed])

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">{v.signInTitle}</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{v.signInSub}</p>

      {/* Google is the only way in here: a listing is tied to a real account,
          and guest sessions are deliberately not enough (see isRealUser). */}
      {GOOGLE_CLIENT_ID ? (
        <div ref={googleRef} className="mt-6" />
      ) : (
        <p className="mt-6 text-sm text-red-600">{v.googleFailed}</p>
      )}

      {busy && <p className="mt-4 text-sm text-neutral-500">{t.common.loading}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <p className="mt-6 text-xs text-neutral-500">
        <Link href="/" className="hover:underline">
          {t.vendor.successHome}
        </Link>
      </p>
    </div>
  )
}
