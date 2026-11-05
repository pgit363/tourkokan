'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, ProductWriteFields, VendorProductDetail, vendorApi } from '@/lib/api'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import ProductBasicsForm, { BasicsValue, basicsFrom } from '../../../ProductBasicsForm'
import ProductMediaManager from '../../../ProductMediaManager'
import ProductVariants from '../../../ProductVariants'
import StatusBadge from '../../../StatusBadge'
import { PanelSkeleton } from '../../../Loaders'

/**
 * `/vendor/products/[id]` — the editor.
 *
 * `getProduct` brings the category's own `attribute_schema` with it, so the dynamic
 * half of the form renders without a second call and without needing the outlet's
 * allowed-category list at all. Outlet and category are therefore read-only here:
 * moving a listing to another outlet is not an edit, and the server does not accept
 * it as one.
 *
 * Editing an approved listing sends it back to `pending`. That is the server's
 * behaviour, not ours, and a vendor who is not told loses a live listing without
 * knowing why — hence the notice above the form.
 */
export default function EditProductPage() {
  const { t } = useLang()
  const d = t.vendorDash
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)

  const [product, setProduct] = useState<VendorProductDetail | null>(null)
  const [value, setValue] = useState<BasicsValue>(basicsFrom(null))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const load = useCallback(
    async (resetForm: boolean) => {
      try {
        const res = await vendorApi.getProduct(id)
        setProduct(res.data)
        if (resetForm) setValue(basicsFrom(res.data))
      } catch (err) {
        setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
      }
    },
    [id, t.vendor.errorGeneric]
  )

  useEffect(() => {
    if (Number.isFinite(id)) load(true)
  }, [id, load])

  const save = async (payload: ProductWriteFields) => {
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      await vendorApi.updateProduct({ ...payload, id })
      // Refetch rather than trusting the response: saving an approved listing moves
      // it to `pending`, and the badge has to follow.
      await load(false)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : d.saveFailed)
    } finally {
      setBusy(false)
    }
  }

  const submitForReview = async () => {
    setBusy(true)
    setError('')
    try {
      await vendorApi.submitProductForReview(id)
      await load(false)
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    } finally {
      setBusy(false)
    }
  }

  if (!product) {
    return error ? <p className="text-sm text-red-600">{error}</p> : <div className="max-w-2xl space-y-6"><PanelSkeleton lines={4} /><PanelSkeleton lines={3} /></div>
  }

  const media = product.gallery ?? product.media ?? []
  const status = product.status ?? 'draft'

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{d.editProductTitle}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-neutral-500">
          {product.site?.name ?? '—'} · {product.product_category?.name ?? '—'} ·{' '}
          <Link href="/vendor/products" className="hover:underline">
            {d.navProducts}
          </Link>
        </p>
        {status === 'rejected' && product.rejection_reason && (
          <p className="mt-3 text-sm text-red-600">
            {d.reasonLabel}: {product.rejection_reason}
          </p>
        )}
      </div>

      <ProductBasicsForm
        locked={{ outlet: product.site?.name ?? '—', category: product.product_category?.name ?? '—' }}
        schema={product.product_category?.attribute_schema}
        value={value}
        onChange={setValue}
        onSubmit={save}
        submitLabel={d.saveChanges}
        busy={busy}
        error={error}
        notice={status === 'approved' ? d.reviewWarning : undefined}
      />

      {saved && <p className="text-sm text-green-700 dark:text-green-400">{d.savedToast}</p>}

      <ProductMediaManager productId={id} media={media} onChanged={() => load(false)} />

      <ProductVariants productId={id} variants={product.variants ?? []} onChanged={() => load(false)} />

      {(status === 'draft' || status === 'rejected') && (
        <div className="border-t border-neutral-200 pt-8 dark:border-neutral-700">
          <button
            type="button"
            disabled={busy}
            onClick={submitForReview}
            className="rounded-full bg-primary-600 px-6 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {d.submitForReview}
          </button>
        </div>
      )}
    </div>
  )
}
