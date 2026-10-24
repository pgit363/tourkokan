'use client'

import ProductAttributeFields from '@/components/brand/ProductAttributeFields'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import {
  ApiError,
  ProductCategoryOption,
  Site,
  VendorProduct,
  vendorApi,
} from '@/lib/api'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

/**
 * /account-business — the vendor's own businesses and what they sell.
 *
 * mySites / myProducts / addProduct all sit behind the backend's `vendor`
 * middleware, so a signed-in user who has not onboarded gets an error rather
 * than an empty list. That is how this page tells "no businesses yet" apart
 * from "not a vendor", and sends the latter to the onboarding wizard.
 */
export default function AccountBusinessPage() {
  const { t } = useLang()
  const v = t.vendor
  const { isLoggedIn, user } = useAuth()
  const isRealUser = isLoggedIn && !user?.isGuest

  const [sites, setSites] = useState<Site[] | null>(null)
  const [products, setProducts] = useState<VendorProduct[]>([])
  const [notVendor, setNotVendor] = useState(false)
  const [error, setError] = useState('')
  const [addingFor, setAddingFor] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!isRealUser) return
    setError('')
    try {
      const [siteRes, productRes] = await Promise.all([vendorApi.mySites(), vendorApi.myProducts()])
      setSites(siteRes.data.data ?? [])
      setProducts(productRes.data.data ?? [])
    } catch (e) {
      // The vendor gate rejects anyone who has not onboarded — not an error worth
      // showing, it just means they have no business yet.
      const status = (e as ApiError)?.status
      if (status === 401 || status === 403) {
        setNotVendor(true)
        setSites([])
      } else {
        setError((e as ApiError)?.message || v.errorGeneric)
        setSites([])
      }
    }
  }, [isRealUser, v.errorGeneric])

  useEffect(() => {
    load()
  }, [load])

  if (!isRealUser) {
    return (
      <Shell title={v.myBusinessTitle}>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{v.myBusinessSignIn}</p>
        <ButtonPrimary href="/vendor/register" className="mt-5">
          {v.registerCta}
        </ButtonPrimary>
      </Shell>
    )
  }

  if (sites === null) {
    return (
      <Shell title={v.myBusinessTitle}>
        <p className="text-sm text-neutral-500">{t.common.loading}</p>
      </Shell>
    )
  }

  if (notVendor || sites.length === 0) {
    return (
      <Shell title={v.myBusinessTitle}>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{v.myBusinessNone}</p>
        <ButtonPrimary href="/vendor/register" className="mt-5">
          {v.registerCta}
        </ButtonPrimary>
      </Shell>
    )
  }

  return (
    <Shell title={v.myBusinessTitle}>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="space-y-8">
        {sites.map((site) => {
          const mine = products.filter((p) => p.site?.id === site.id)
          return (
            <section
              key={site.id}
              className="rounded-3xl border border-neutral-200 p-6 dark:border-neutral-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{site.name}</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    {(site.categories ?? []).map((c) => c.name).join(' · ') || v.reviewNone}
                  </p>
                </div>
                <ButtonSecondary
                  onClick={() => setAddingFor(addingFor === site.id ? null : site.id)}
                  className="!px-4 !py-2 text-sm"
                >
                  {addingFor === site.id ? t.common.cancel : v.addProduct}
                </ButtonSecondary>
              </div>

              {addingFor === site.id && (
                <AddProductForm
                  site={site}
                  onDone={() => {
                    setAddingFor(null)
                    load()
                  }}
                />
              )}

              <h3 className="mt-6 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {v.myProducts} ({mine.length})
              </h3>
              {mine.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">{v.myProductsNone}</p>
              ) : (
                <ul className="mt-2 divide-y divide-neutral-200 dark:divide-neutral-700">
                  {mine.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-neutral-500">
                          {p.product_category?.name ?? ''}
                        </p>
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {p.base_price ? `₹${p.base_price}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </Shell>
  )
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="mt-6">{children}</div>
      <p className="mt-10 text-xs text-neutral-500">
        <Link href="/" className="hover:underline">
          ← {t.vendor.successHome}
        </Link>
      </p>
    </div>
  )
}

/** Add a product to an existing site, with the category's own attribute fields. */
function AddProductForm({ site, onDone }: { site: Site; onDone: () => void }) {
  const { t } = useLang()
  const v = t.vendor

  const [cats, setCats] = useState<ProductCategoryOption[] | null>(null)
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const [attributes, setAttributes] = useState<Record<string, string | string[] | boolean>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ids = (site.categories ?? []).map((c) => c.id)
    if (ids.length === 0) {
      setCats([])
      return
    }
    vendorApi
      .allowedProductCategories(ids)
      .then((res) => setCats(res.data ?? []))
      .catch(() => setCats([]))
  }, [site])

  const schema = cats?.find((c) => c.id === categoryId)?.attribute_schema ?? null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !name.trim()) {
      setError(v.productName)
      return
    }
    // Required attributes are caught here so the server is not asked to reject
    // the whole product over a field we could see was empty.
    for (const [key, spec] of Object.entries(schema ?? {})) {
      if (!spec.required) continue
      const value = attributes[key]
      const empty =
        spec.type === 'bool'
          ? false
          : spec.type === 'multi'
            ? !Array.isArray(value) || value.length === 0
            : typeof value !== 'string' || !value.trim()
      if (empty) {
        setError(spec.label)
        return
      }
    }

    setBusy(true)
    setError('')
    try {
      // Only keys the schema declares — the backend rejects unknown ones.
      const payload: Record<string, unknown> = {}
      for (const [key, spec] of Object.entries(schema ?? {})) {
        const value = attributes[key]
        if (spec.type === 'bool') payload[key] = value === true
        else if (spec.type === 'multi') {
          const picked = Array.isArray(value) ? value : []
          if (picked.length) payload[key] = picked
        } else if (typeof value === 'string' && value.trim()) payload[key] = value.trim()
      }

      await vendorApi.addProduct({
        site_id: site.id,
        product_category_id: Number(categoryId),
        name: name.trim(),
        description: desc.trim() || undefined,
        base_price: price.trim() || undefined,
        attributes: Object.keys(payload).length ? payload : undefined,
      })
      onDone()
    } catch (err) {
      setError((err as ApiError)?.message || v.errorGeneric)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl bg-neutral-50 p-5 dark:bg-neutral-800/50">
      {cats === null ? (
        <p className="text-sm text-neutral-500">{t.common.loading}</p>
      ) : cats.length === 0 ? (
        <p className="text-sm text-neutral-500">{v.productNone}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  // Attributes belong to a category, so drop values from the last pick.
                  setCategoryId(categoryId === c.id ? '' : c.id)
                  setAttributes({})
                }}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  categoryId === c.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={v.productNamePh} maxLength={150} />
          <Input
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder={v.productPrice}
          />
          <Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={v.productDesc} />

          <ProductAttributeFields
            schema={schema}
            values={attributes}
            onChange={(key, value) => setAttributes((a) => ({ ...a, [key]: value }))}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <ButtonPrimary type="submit" disabled={busy}>
            {busy ? t.common.loading : v.addProduct}
          </ButtonPrimary>
        </>
      )}
    </form>
  )
}
