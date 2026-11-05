'use client'

import { useLang } from '@/context/LanguageContext'
import { ApiError, ProductMedia, ftpUrl, vendorApi } from '@/lib/api'
import { useRef, useState } from 'react'

/**
 * A listing's photos: upload, choose the cover, reorder, remove.
 *
 * Every rule here is the server's, not an invention:
 *   - one image per call, so several files picked at once upload in sequence;
 *   - the first image uploaded becomes the cover automatically;
 *   - deleting the cover promotes the next image server-side, so the list is
 *     refetched rather than patched locally;
 *   - `reorderProductMedia` needs EVERY id in the new order — a partial list is
 *     rejected, which is why the arrows send the whole array.
 *
 * Quota refusals arrive here too (`max_images_per_product`) as `success: false`
 * with a message that already names the plan and the number, so it is shown as-is.
 */
export default function ProductMediaManager({
  productId,
  media,
  onChanged,
}: {
  productId: number
  media: ProductMedia[]
  onChanged: () => void | Promise<void>
}) {
  const { t } = useLang()
  const d = t.vendorDash
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      await onChanged()
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    } finally {
      setBusy(false)
    }
  }

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    setError('')
    try {
      // Sequential on purpose: the endpoint takes one image and carries an upload
      // throttle, so firing them in parallel earns a 429 instead of being faster.
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append('id', String(productId))
        form.append('image', file)
        await vendorApi.uploadProductMedia(form)
      }
      await onChanged()
    } catch (err) {
      setError(err instanceof ApiError && err.message ? err.message : t.vendor.errorGeneric)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const move = (index: number, delta: number) => {
    const next = [...media]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    return run(() => vendorApi.reorderProductMedia(productId, next.map((m) => m.id)))
  }

  return (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-medium">{d.photos}</h2>
        {busy && <span className="text-sm text-neutral-500">{d.uploading}</span>}
      </div>
      <p className="mb-4 text-xs text-neutral-500">{d.photosHint}</p>

      {!!media.length && (
        <ul className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {media.map((m, i) => {
            const src = ftpUrl(m.path ?? m.image)
            return (
              <li key={m.id} className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- S3 host is not in the Image loader allowlist
                  <img src={src} alt={m.title ?? ''} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="aspect-square w-full bg-neutral-100 dark:bg-neutral-800" />
                )}
                <div className="space-y-1 p-2 text-xs">
                  {m.is_cover ? (
                    <span className="font-medium text-green-700 dark:text-green-400">{d.cover}</span>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => vendorApi.setProductCover(productId, m.id))}
                      className="text-primary-600 hover:underline disabled:opacity-40 dark:text-primary-400"
                    >
                      {d.setCover}
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={busy || i === 0} onClick={() => move(i, -1)} className="disabled:opacity-30">
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={busy || i === media.length - 1}
                      onClick={() => move(i, 1)}
                      className="disabled:opacity-30"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => vendorApi.deleteProductMedia(productId, m.id))}
                      className="ml-auto text-red-600 hover:underline disabled:opacity-40"
                    >
                      {d.removeLabel}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <label className="inline-flex cursor-pointer items-center rounded-full border border-neutral-300 px-5 py-2 text-sm dark:border-neutral-600">
        {d.addPhoto}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  )
}
