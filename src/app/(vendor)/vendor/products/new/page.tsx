'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, ProductCategoryOption, ProductWriteFields, VendorSite, vendorApi } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import ProductBasicsForm, { BasicsValue, basicsFrom } from '../../../ProductBasicsForm'

/**
 * `/vendor/products/new` — the basics only.
 *
 * `addProduct` returns a DRAFT, and photos, price points and submit-for-review are
 * all separate calls against an existing id. So this page stops at the draft and
 * hands over to the editor rather than pretending to be one long form — which also
 * means a vendor cannot lose the text they typed to a failed image upload.
 */
function NewProduct() {
  const { t } = useLang()
  const d = t.vendorDash
  const router = useRouter()
  const params = useSearchParams()

  const [sites, setSites] = useState<VendorSite[]>([])
  const [categories, setCategories] = useState<ProductCategoryOption[]>([])
  const [siteId, setSiteId] = useState<number | ''>('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [value, setValue] = useState<BasicsValue>(basicsFrom(null))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Outlets a product may be added to: anything not rejected, including `pending`
  // — a vendor builds their catalog while the business is under review.
  useEffect(() => {
    vendorApi
      .mySubmissions()
      .then((res) => {
        const usable = res.data.data.filter((s) => s.submission_status !== 'rejected')
        setSites(usable)

        const asked = Number(params.get('site'))
        if (asked && usable.some((s) => s.id === asked)) setSiteId(asked)
        else if (usable.length === 1) setSiteId(usable[0].id)
      })
      .catch(() => setSites([]))
  }, [params])

  // What this outlet may sell is resolved from the site's own business categories.
  useEffect(() => {
    setCategoryId('')
    setCategories([])
    if (!siteId) return
    vendorApi
      .allowedProductCategoriesForSite(siteId)
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]))
  }, [siteId])

  const schema = categories.find((c) => c.id === categoryId)?.attribute_schema

  const submit = async (payload: ProductWriteFields) => {
    if (!siteId || !categoryId) return
    setBusy(true)
    setError('')
    try {
      const res = await vendorApi.addProduct({
        ...payload,
        site_id: siteId,
        product_category_id: categoryId,
        name: payload.name ?? '',
      })
      router.push(`/vendor/products/${res.data.id}`)
    } catch (err) {
      // A quota refusal lands here with a message that already names the plan and
      // the number, so it is shown verbatim rather than reworded.
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">{d.addProductTitle}</h1>
      <ProductBasicsForm
        sites={sites}
        categories={categories}
        siteId={siteId}
        categoryId={categoryId}
        onSiteChange={setSiteId}
        onCategoryChange={setCategoryId}
        schema={schema}
        value={value}
        onChange={setValue}
        onSubmit={submit}
        submitLabel={t.common.next}
        busy={busy}
        error={error}
      />
    </div>
  )
}

export default function NewProductPage() {
  return (
    <Suspense fallback={null}>
      <NewProduct />
    </Suspense>
  )
}
