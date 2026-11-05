import { ProductAttributeSpec } from '@/lib/api'

export type AttributeValue = string | string[] | boolean
export type AttributeValues = Record<string, AttributeValue>
export type AttributeSchema = Record<string, ProductAttributeSpec> | null | undefined

/**
 * The two things every caller of `ProductAttributeFields` has to do with its values,
 * in one place.
 *
 * `ProductAttributeFields` renders all nine schema types but enforces nothing — it
 * owns no state and shows `min`/`max` only as a hint. So each caller re-implemented
 * the required check and the serialiser, and the vendor wizard and the account page
 * had drifted into two copies of both before the dashboard would have made three.
 *
 * The emptiness rule is the subtle part and is shared from here: an unchecked box is
 * a valid `false`, not a missing answer, and a `multi` is empty only when its array
 * is.
 */
function isEmpty(spec: ProductAttributeSpec, value: AttributeValue | undefined): boolean {
  if (spec.type === 'bool') return false
  if (spec.type === 'multi') return !Array.isArray(value) || value.length === 0
  return typeof value !== 'string' || !value.trim()
}

/**
 * The server's stored attributes, in the shape the fields and the serialiser use.
 *
 * `attributes` comes back from `getProduct` with native types — `occupancy: 3`, not
 * `"3"` — while `ProductAttributeFields` renders a text input only for a string
 * (`typeof value === 'string' ? value : ''`) and `serializeAttributes` only emits
 * one. Loading a saved listing without this pass therefore showed every numeric
 * field as empty AND dropped it on the next save: a vendor editing a room's bed
 * type would silently lose its occupancy.
 *
 * So numbers become strings here, at the one boundary where server data enters the
 * form, rather than each field learning to handle both.
 */
export function normalizeAttributes(raw: unknown): AttributeValues {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}

  const out: AttributeValues = {}

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (value === null || value === undefined) continue

    if (typeof value === 'boolean') out[key] = value
    else if (typeof value === 'number') out[key] = String(value)
    else if (typeof value === 'string') out[key] = value
    else if (Array.isArray(value)) out[key] = value.map((v) => String(v))
    // anything else (a nested object) has no field to render it, so it is left out
    // rather than stringified into something the server would reject on save.
  }

  return out
}

/**
 * The label of the first required attribute left blank, or '' when all are answered.
 *
 * Returns the label rather than the key because the label is what the vendor can
 * act on — it is the text next to the field they have to go back and fill.
 */
export function firstMissingAttribute(schema: AttributeSchema, values: AttributeValues): string {
  for (const [key, spec] of Object.entries(schema ?? {})) {
    if (!spec.required) continue
    if (isEmpty(spec, values[key])) return spec.label
  }
  return ''
}

/**
 * The attribute payload, keyed only by what the schema declares — the server
 * rejects attributes it has not heard of, so a stray key fails the whole write.
 * Blank optional fields are left out rather than sent as empty strings.
 */
export function serializeAttributes(schema: AttributeSchema, values: AttributeValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  for (const [key, spec] of Object.entries(schema ?? {})) {
    const value = values[key]

    if (spec.type === 'bool') {
      payload[key] = value === true
    } else if (spec.type === 'multi') {
      const picked = Array.isArray(value) ? value : []
      if (picked.length) payload[key] = picked
    } else if (typeof value === 'string' && value.trim()) {
      payload[key] = value.trim()
    }
  }

  return payload
}

/**
 * The same payload as a JSON string, which is the shape `addProduct` and
 * `updateProduct` validate against the schema.
 */
export function attributesAsJson(schema: AttributeSchema, values: AttributeValues): string {
  return JSON.stringify(serializeAttributes(schema, values))
}
