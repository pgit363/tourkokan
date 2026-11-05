'use client'

import ProductAttributeFields from '@/components/brand/ProductAttributeFields'
import { useLang } from '@/context/LanguageContext'
import { ProductCategoryOption, ProductWriteFields, VendorProductDetail, VendorSite } from '@/lib/api'
import { AttributeValues, attributesAsJson, firstMissingAttribute, normalizeAttributes } from '@/lib/productAttributes'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, FieldGroup, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { useState } from 'react'

/** The server's own list — a value outside it is rejected. */
const UNITS = ['per_night', 'per_person', 'per_plate', 'per_kg', 'per_hour', 'per_piece', 'per_package'] as const

export interface BasicsValue {
  name: string
  description: string
  base_price: string
  sale_price: string
  unit: string
  attributes: AttributeValues
}

export function basicsFrom(product?: VendorProductDetail | null): BasicsValue {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    base_price: product?.base_price != null ? String(product.base_price) : '',
    sale_price: product?.sale_price != null ? String(product.sale_price) : '',
    unit: product?.unit ?? '',
    attributes: normalizeAttributes(product?.attributes),
  }
}

/**
 * The fields a listing shares between being created and being edited.
 *
 * The category's `attribute_schema` drives the lower half of the form, so a new
 * product vertical never needs a release here either — same contract the app was
 * built against. Required attributes and the payload shape both come from
 * `lib/productAttributes`, which is the one copy of those rules.
 *
 * `status`, `is_featured`, `is_bookable` and `fulfilment_type` are deliberately
 * absent: the server ignores them from a vendor, so offering a control would be a
 * lie.
 */
export default function ProductBasicsForm({
  sites,
  categories,
  siteId,
  categoryId,
  onSiteChange,
  onCategoryChange,
  schema,
  value,
  onChange,
  onSubmit,
  submitLabel,
  busy,
  error,
  notice,
  locked,
}: {
  sites?: VendorSite[]
  categories?: ProductCategoryOption[]
  siteId?: number | ''
  categoryId?: number | ''
  onSiteChange?: (id: number | '') => void
  onCategoryChange?: (id: number | '') => void
  schema: Record<string, import('@/lib/api').ProductAttributeSpec> | null | undefined
  value: BasicsValue
  onChange: (next: BasicsValue) => void
  onSubmit: (payload: ProductWriteFields) => void
  submitLabel: string
  busy?: boolean
  error?: string
  notice?: string
  /**
   * Outlet and category are fixed once a listing exists — moving one is not an
   * edit, and the server does not accept it as one. The editor passes the two
   * names and gets read-only text, rather than a disabled select that has to be
   * fed a one-element list to have anything to show.
   */
  locked?: { outlet: string; category: string }
}) {
  const { t } = useLang()
  const d = t.vendorDash
  const [localError, setLocalError] = useState('')

  const set = <K extends keyof BasicsValue>(key: K, v: BasicsValue[K]) => onChange({ ...value, [key]: v })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!locked) {
      if (!siteId) return setLocalError(d.pickOutlet)
      if (!categoryId) return setLocalError(`${d.pleaseFill}: ${d.category}`)
    }
    if (!value.name.trim()) return setLocalError(`${d.pleaseFill}: ${d.productName}`)

    const missing = firstMissingAttribute(schema, value.attributes)
    if (missing) return setLocalError(`${d.pleaseFill}: ${missing}`)

    onSubmit({
      name: value.name.trim(),
      description: value.description.trim() || null,
      base_price: value.base_price.trim() || null,
      sale_price: value.sale_price.trim() || null,
      unit: value.unit || null,
      attributes: attributesAsJson(schema, value.attributes),
    })
  }

  const shown = localError || error

  return (
    <form onSubmit={submit}>
      {notice && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          {notice}
        </p>
      )}

      <FieldGroup>
        {locked ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <Label>{d.outlet}</Label>
              <p className="pt-2 text-sm text-neutral-600 dark:text-neutral-300">{locked.outlet}</p>
            </Field>
            <Field>
              <Label>{d.category}</Label>
              <p className="pt-2 text-sm text-neutral-600 dark:text-neutral-300">{locked.category}</p>
            </Field>
          </div>
        ) : (
          <>
            <Field>
              <Label>{d.outlet}</Label>
              <select
                value={siteId ?? ''}
                onChange={(e) => onSiteChange?.(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              >
                <option value="">—</option>
                {(sites ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.submission_status === 'pending' ? ` · ${d.statusPending}` : ''}
                  </option>
                ))}
              </select>
              {!(sites ?? []).length && <p className="mt-2 text-sm text-neutral-500">{d.noOutlets}</p>}
            </Field>

            <Field>
              <Label>{d.category}</Label>
              <select
                disabled={!siteId}
                value={categoryId ?? ''}
                onChange={(e) => onCategoryChange?.(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm disabled:opacity-60 dark:border-neutral-600 dark:bg-neutral-900"
              >
                <option value="">—</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {!!siteId && !(categories ?? []).length && (
                <p className="mt-2 text-sm text-neutral-500">{d.noCategories}</p>
              )}
            </Field>
          </>
        )}

        <Field>
          <Label>{d.productName}</Label>
          <Input
            value={value.name}
            placeholder={d.productNamePh}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </Field>

        <Field>
          <Label>{d.descriptionLabel}</Label>
          <Textarea
            rows={4}
            value={value.description}
            placeholder={d.descriptionPh}
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field>
            <Label>{d.basePrice}</Label>
            <Input
              inputMode="decimal"
              value={value.base_price}
              onChange={(e) => set('base_price', e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </Field>
          <Field>
            <Label>{d.salePrice}</Label>
            <Input
              inputMode="decimal"
              value={value.sale_price}
              onChange={(e) => set('sale_price', e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </Field>
          <Field>
            <Label>{d.unitLabel}</Label>
            <select
              value={value.unit}
              onChange={(e) => set('unit', e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              <option value="">—</option>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u.replace('per_', 'per ')}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </FieldGroup>

      <h2 className="mt-10 mb-4 text-base font-medium">{d.detailsTitle}</h2>
      {schema && Object.keys(schema).length ? (
        <FieldGroup>
          <ProductAttributeFields
            schema={schema}
            values={value.attributes}
            onChange={(key, v) => set('attributes', { ...value.attributes, [key]: v })}
          />
        </FieldGroup>
      ) : (
        <p className="text-sm text-neutral-500">{d.noExtraDetails}</p>
      )}

      {shown && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">{shown}</p>
      )}

      <ButtonPrimary type="submit" disabled={busy} className="mt-8">
        {busy ? t.common.saving : submitLabel}
      </ButtonPrimary>
    </form>
  )
}
