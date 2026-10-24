'use client'

import { ProductAttributeSpec } from '@/lib/api'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import React from 'react'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  )
}

/**
 * Renders one input per entry of a product category's attribute_schema.
 *
 * The backend validates submitted attributes against this schema and rejects
 * unknown keys, so the form is generated from it rather than hard-coded — every
 * category brings its own set, and twelve of them have required attributes.
 */
export default function ProductAttributeFields({
  schema,
  values,
  onChange,
}: {
  schema: Record<string, ProductAttributeSpec> | null
  values: Record<string, string | string[] | boolean>
  onChange: (key: string, value: string | string[] | boolean) => void
}) {
  if (!schema || Object.keys(schema).length === 0) return null

  return (
    <>
      {Object.entries(schema).map(([key, spec]) => {
        const value = values[key]
        const label = spec.required ? `${spec.label} *` : spec.label

        if (spec.type === 'bool') {
          return (
            <label key={key} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input type="checkbox" checked={value === true} onChange={(e) => onChange(key, e.target.checked)} />
              {spec.label}
            </label>
          )
        }

        if (spec.type === 'enum') {
          return (
            <Field key={key} label={label}>
              <select
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => onChange(key, e.target.value)}
                // Matches Input. color-scheme matters: the dropdown list is drawn
                // by the OS, so without it a light page shows a dark list on a
                // machine set to dark mode.
                className="block h-11 w-full rounded-2xl border-neutral-200 bg-white px-4 text-sm font-normal text-neutral-900 [color-scheme:light] focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:[color-scheme:dark] dark:focus:ring-primary-600/25"
              >
                <option value="">—</option>
                {(spec.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
          )
        }

        if (spec.type === 'multi') {
          const picked = Array.isArray(value) ? value : []
          return (
            <Field key={key} label={label}>
              <div className="flex flex-wrap gap-2">
                {(spec.options ?? []).map((opt) => {
                  const on = picked.includes(opt)
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChange(key, on ? picked.filter((o) => o !== opt) : [...picked, opt])}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        on
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </Field>
          )
        }

        const hint = [
          spec.min !== undefined ? `min ${spec.min}` : null,
          spec.max !== undefined ? `max ${spec.max}` : null,
        ]
          .filter(Boolean)
          .join(' · ')

        if (spec.type === 'text') {
          return (
            <Field key={key} label={label} hint={hint || undefined}>
              <Textarea
                rows={3}
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </Field>
          )
        }

        const numeric = spec.type === 'int' || spec.type === 'decimal'
        return (
          <Field key={key} label={label} hint={hint || undefined}>
            <Input
              type={spec.type === 'date' ? 'date' : spec.type === 'time' ? 'time' : 'text'}
              inputMode={numeric ? (spec.type === 'int' ? 'numeric' : 'decimal') : undefined}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) =>
                onChange(
                  key,
                  spec.type === 'int'
                    ? e.target.value.replace(/[^0-9]/g, '')
                    : spec.type === 'decimal'
                      ? e.target.value.replace(/[^0-9.]/g, '')
                      : e.target.value
                )
              }
            />
          </Field>
        )
      })}
    </>
  )
}

