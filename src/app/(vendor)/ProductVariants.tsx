'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, ProductVariant, vendorApi } from '@/lib/api'
import Input from '@/shared/Input'
import { useState } from 'react'

/**
 * Price points — "Deluxe AC Room", "1 kg box", "Half plate".
 *
 * Every product has at least one: enter a single price and the server creates a
 * `Standard` variant for it, which is why this list is never empty on a saved
 * listing. It is also why `data.price` in the catalog comes from the default
 * variant and not from `base_price`.
 *
 * Deleting the last one is refused with a 422 — the server's message says so, so it
 * is shown rather than pre-empted with a disabled button that explains nothing.
 */
export default function ProductVariants({
  productId,
  variants,
  onChanged,
}: {
  productId: number
  variants: ProductVariant[]
  onChanged: () => void | Promise<void>
}) {
  const { t } = useLang()
  const d = t.vendorDash

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      await onChanged()
      return true
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
      return false
    } finally {
      setBusy(false)
    }
  }

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price.trim()) {
      setError(`${d.pleaseFill}: ${d.variantName}, ${d.price}`)
      return
    }
    const ok = await run(() => vendorApi.saveProductVariant({ id: productId, name: name.trim(), price: price.trim() }))
    if (ok) {
      setName('')
      setPrice('')
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-base font-medium">{d.variants}</h2>

      {!!variants.length && (
        <ul className="mb-5 divide-y divide-neutral-200 dark:divide-neutral-700">
          {variants.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <span className="font-medium">{v.name}</span>
              <span className="tabular-nums text-neutral-500">{v.price}</span>
              {!!v.is_default && <span className="text-xs text-neutral-400">· {d.defaultVariant}</span>}
              <div className="ml-auto flex items-center gap-4">
                {!v.is_default && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      run(() =>
                        vendorApi.saveProductVariant({
                          id: productId,
                          variant_id: v.id,
                          name: v.name,
                          price: v.price,
                          is_default: true,
                        })
                      )
                    }
                    className="text-primary-600 hover:underline disabled:opacity-40 dark:text-primary-400"
                  >
                    {d.makeDefault}
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => vendorApi.deleteProductVariant(productId, v.id))}
                  className="text-red-600 hover:underline disabled:opacity-40"
                >
                  {d.removeLabel}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="flex flex-wrap items-end gap-3">
        <Input
          placeholder={d.variantName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder={d.price}
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
          className="max-w-[10rem]"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full border border-neutral-300 px-5 py-2 text-sm disabled:opacity-50 dark:border-neutral-600"
        >
          {d.addVariant}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  )
}
