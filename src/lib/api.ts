/**
 * Central API client for Tourkokan backend.
 *
 * Requests go straight to the backend origin, NOT through the Next.js
 * /api/proxy rewrite. A rewrite with an external destination is executed by
 * the Cloudflare Worker, so every API call cost a Worker invocation (plus CPU
 * and a subrequest) just to forward the request. The backend already sends
 * permissive CORS headers, so the browser can call it directly and the Worker
 * stays out of the data path entirely.
 */

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

export const API_BASE = `${BACKEND_URL}/api`
export const FTP_PATH =
  process.env.NEXT_PUBLIC_FTP_PATH ?? 'https://tourkokan-412490161095-eu-north-1-an.s3.eu-north-1.amazonaws.com/'

/** Prefix a relative image path with the FTP base URL */
export function ftpUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${FTP_PATH}${path.startsWith('/') ? path.slice(1) : path}`
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function setToken(token: string) {
  localStorage.setItem('auth_token', token)
}

export function removeToken() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('auth_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStoredUser(user: User) {
  localStorage.setItem('auth_user', JSON.stringify(user))
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  /** If true, skip attaching Authorization header */
  skipAuth?: boolean
}

/**
 * The backend's `message` is either a sentence or a map of field → messages
 * (Laravel validation output). Flatten it into something displayable while
 * keeping the per-field detail for forms that highlight individual inputs.
 */
function readApiMessage(message: unknown): { message: string; fieldErrors?: Record<string, string[]> } {
  if (typeof message === 'string' && message.trim()) {
    return { message }
  }
  if (message && typeof message === 'object') {
    const fieldErrors = message as Record<string, string[]>
    const flat = Object.values(fieldErrors)
      .flat()
      .filter((m): m is string => typeof m === 'string' && m.trim().length > 0)
    if (flat.length) return { message: flat.join(' '), fieldErrors }
  }
  return { message: 'Request failed. Please try again.' }
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth, ...rest } = options
  const token = getToken()

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(rest.headers as Record<string, string>),
  }

  if (!skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (rest.body && !(rest.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers })

  let data: unknown
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const err = data as { message?: string; errors?: Record<string, string[]> }
    const message = err?.message ?? `Request failed (${res.status})`
    if (res.status === 401) {
      removeToken()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthenticated'))
      }
    }
    const error = new ApiError(message, res.status, err?.errors, data)
    throw error
  }

  // The backend reports validation and business failures as HTTP 200 with
  // { success: false, message }. Treat those as errors too — otherwise callers
  // get a body whose `data` is undefined and crash reading fields off it
  // (e.g. "Cannot read properties of undefined (reading 'access_token')")
  // instead of showing the server's actual message.
  const envelope = data as { success?: boolean; message?: unknown } | null
  if (envelope?.success === false) {
    const { message, fieldErrors } = readApiMessage(envelope.message)
    throw new ApiError(message, res.status, fieldErrors, data)
  }

  return data as T
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  isServerError: boolean
  /** Raw response body — some endpoints put machine-readable detail in data (e.g. missing_profile_fields) */
  body?: unknown

  constructor(message: string, status: number, errors?: Record<string, string[]>, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.isServerError = status >= 500 || message === 'Server Error'
    this.body = body
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * What a user is allowed to be, by code — `vendor`, `admin`, `superadmin`.
 *
 * `code` is the stable identifier; `name` is display text an admin can rename.
 * Gate on the code, never on the name or the id.
 */
export interface Role {
  id: number
  name: string
  code: string
}

export interface User {
  id: number
  name: string
  email: string
  mobile?: string
  profile_picture?: string
  gender?: string
  dob?: string
  isVerified?: boolean
  isGuest?: boolean
  /** Legacy single-role column. Meaningless to the UI without an id→code map — use `roles`. */
  role_id?: number
  /**
   * Present on `/v2/auth/login` (via the backend's `createNewToken`) and on
   * `/v2/user-profile`, where `PreMiddleware` eager-loads it. Optional because a
   * session cached by an older build of this site has no such key — see
   * `AuthContext`, which refreshes rather than treating that as "no roles".
   */
  roles?: Role[]
  uid?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  isGuest: boolean
  user: User
}

export interface Site {
  id: number
  name: string
  mr_name?: string
  parent_id?: number
  image?: string
  icon?: string
  status?: string
  is_favorite?: boolean
  rating_avg_rate?: number | null
  gallery_count?: number
  comment_count?: number
  description?: string
  latitude?: number
  longitude?: number
  categories?: Category[]
}

export interface Category {
  id: number
  name: string
  mr_name?: string
  code: string
  icon?: string
  parent_id?: number | null
  sub_categories?: Category[]
}

export interface Route {
  id: number
  name: string
  source_place_id: number
  destination_place_id: number
  start_time?: string
  end_time?: string
  total_time?: string
  distance?: string
  sourcePlace?: Site
  destinationPlace?: Site
  routeStops?: RouteStop[]
}

export interface RouteStop {
  id: number
  place_id: number
  arrival_time?: string
  departure_time?: string
  order?: number
  place?: Site
}

export interface Event {
  id: number
  title: string
  slug: string
  description?: string
  location?: string
  address?: string
  start_date?: string
  end_date?: string
  start_time?: string
  end_time?: string
  event_type_id?: number
  site_id?: number
  is_free?: boolean
  price?: number
  status?: string
  is_featured?: boolean
  image?: string
  view_count?: number
  like_count?: number
  going_count?: number
  interested_count?: number
  share_count?: number
  favourite_count?: number
  taluka?: string
  eventType?: { id: number; name: string }
  site?: Site
  user?: User
  user_interaction?: {
    has_liked: boolean
    is_going: boolean
    is_interested: boolean
    has_favourited: boolean
  }
}

export interface GalleryItem {
  id: number
  title?: string
  path: string
  status?: string
  galleryable?: Site
}

export interface Favourite {
  id: number
  user_id: number
  favouritable_id: number
  favouritable_type: string
  created_at: string
  favouritable?: Site | Event
}

export interface Comment {
  id: number
  parent_id?: number
  user_id: number
  comment: string
  users?: User
  comments?: Comment[]
  created_at?: string
}

export interface Pagination<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ── Vendor dashboard types ────────────────────────────────────────────────────

/** One plan limit and how much of it is spent. `limit: null` means unmetered. */
export interface VendorQuota {
  limit: number | null
  used?: number
  remaining?: number | null
  exceeded?: boolean
}

export interface VendorPlan {
  code: string
  name: string
  mr_name?: string | null
  description?: string | null
  price: number | string
  currency: string
  billing_period: string
}

export interface VendorSubscription {
  starts_at: string | null
  ends_at: string | null
  days_remaining: number | null
  status: string
  auto_renew: boolean
  early_adopter: boolean
}

export interface VendorSubscriptionInfo {
  plan: VendorPlan | null
  subscription: VendorSubscription | null
  /** Keyed by the backend's limit codes: `max_sites`, `max_products`, … */
  usage: Record<string, VendorQuota>
}

export interface VendorUsageStats {
  from: string
  to: string
  listings: { total: number; live: number; draft: number; pending: number; rejected: number; paused: number }
  views: { total: number; unique: number }
  leads: { total: number; call: number; whatsapp: number; directions: number; enquiry: number }
  /** Leads per hundred views, already rounded by the server. */
  conversion_rate: number
}

export type LeadType = 'call' | 'whatsapp' | 'directions' | 'enquiry'

export interface VendorLead {
  id: number
  product_id: number
  lead_type: LeadType
  message?: string | null
  platform?: string | null
  is_read: boolean
  created_at: string
  product?: { id: number; name: string; mr_name?: string | null; site_id?: number }
  user?: { id: number; name: string; mobile?: string }
}

/** A vendor's own outlet. `Site` plus the fields only its owner is shown. */
export interface VendorSite extends Site {
  submission_status?: 'draft' | 'pending' | 'approved' | 'rejected'
  rejection_reason?: string | null
  is_primary?: boolean | number
}

/** A price point. Every product has at least one; the last cannot be deleted. */
export interface ProductVariant {
  id: number
  name: string
  price: string | number
  sale_price?: string | number | null
  sku?: string | null
  stock?: number | null
  min_order_qty?: number | null
  max_order_qty?: number | null
  is_default?: boolean | number
  sort_order?: number | null
}

export interface ProductMedia {
  id: number
  path?: string | null
  image?: string | null
  title?: string | null
  is_cover?: boolean | number
  sort_order?: number | null
}

export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'paused'

/**
 * `getProduct` — everything the editor needs in one call, including the category's
 * own `attribute_schema`, so the form can render without a second round trip.
 */
export interface VendorProductDetail extends Omit<VendorProduct, 'status'> {
  mr_name?: string | null
  mr_description?: string | null
  sale_price?: string | number | null
  unit?: string | null
  hsn_code?: string | null
  tax_rate?: number | string | null
  price_includes_tax?: boolean | number
  available_from?: string | null
  available_to?: string | null
  sort_order?: number | null
  status?: ProductStatus
  rejection_reason?: string | null
  site_id?: number
  product_category_id?: number
  variants?: ProductVariant[]
  gallery?: ProductMedia[]
  media?: ProductMedia[]
}

/** One day of a listing's activity. Quiet days are absent, never zero-filled. */
export interface ProductDailyStat {
  date: string
  views: number
  unique_views: number
  leads: number
  leads_call: number
  leads_whatsapp: number
  leads_directions: number
  leads_enquiry: number
}

export interface ProductAnalytics {
  from: string
  to: string
  product?: { id: number; name: string }
  views?: { total: number; unique: number }
  leads?: { total: number; call: number; whatsapp: number; directions: number; enquiry: number }
  conversion_rate?: number
  daily: ProductDailyStat[]
}

/**
 * Everything a vendor may write on a product, shared by add and update.
 *
 * `attributes` is a JSON string, not an object: that is the form the server
 * validates against the category's `attribute_schema`.
 */
export interface ProductWriteFields {
  site_id?: number
  product_category_id?: number
  name?: string
  mr_name?: string | null
  description?: string | null
  mr_description?: string | null
  attributes?: string
  base_price?: string | number | null
  sale_price?: string | number | null
  unit?: string | null
  hsn_code?: string | null
  tax_rate?: number | null
  price_includes_tax?: boolean
  available_from?: string | null
  available_to?: string | null
  sort_order?: number | null
}

export interface PlanOption {
  id?: number
  code: string
  name: string
  mr_name?: string | null
  description?: string | null
  price: string | number
  currency?: string
  billing_period?: string
  limits?: Record<string, number | null>
  is_active?: boolean | number
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiFetch<{ data: AuthResponse }>('/v2/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    })
    return res.data
  },

  // Email/password registration is deliberately absent: sign-in is Google or
  // guest only. Guest registration below is a separate backend path.
  guestRegister: async (name: string) => {
    const form = new FormData()
    form.append('name', name)
    form.append('is_guest', 'true')
    const res = await apiFetch<{ data: AuthResponse }>('/v2/auth/register', {
      method: 'POST',
      body: form,
      skipAuth: true,
    })
    return res.data
  },

  sendOtp: (email: string) =>
    apiFetch('/v2/auth/sendOtp', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    }),

  verifyOtp: (email: string, otp: string, deleteAccount = false) =>
    apiFetch<AuthResponse | { success: boolean; message: string }>('/v2/auth/verifyOtp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, ...(deleteAccount ? { delete: true } : {}) }),
      skipAuth: true,
    }),

  logout: () =>
    apiFetch('/v2/logout', { method: 'POST' }),

  userProfile: () =>
    apiFetch<{ data: User }>('/v2/user-profile', { method: 'POST' }),

  updateProfile: (data: Partial<User> & { password?: string; password_confirmation?: string }) =>
    apiFetch<{ data: User }>('/v2/updateProfile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  isVerifiedEmail: (email: string) =>
    apiFetch<{ data: { isVerified: boolean } }>('/v2/auth/isVerifiedEmail', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    }),
}

// ── Sites API ─────────────────────────────────────────────────────────────────

export const sitesApi = {
  list: (params: { search?: string; category?: string; parent_id?: number; per_page?: number; page?: number; global?: number } = {}) =>
    apiFetch<{ data: Pagination<Site> }>('/v2/sites', {
      method: 'POST',
      body: JSON.stringify({ apitype: 'list', ...params }),
    }),

  addSite: (form: FormData) =>
    apiFetch<{ data: Site; message?: string }>('/v2/addSite', {
      method: 'POST',
      body: form,
    }),

  busDropdown: (params: { search?: string; page?: number } = {}) =>
    apiFetch<{ data: { data: { data: Site[]; next_page_url: string | null } } }>(`/v2/sites?page=${params.page ?? 1}`, {
      method: 'POST',
      body: JSON.stringify({ search: params.search ?? '', apitype: 'dropdown', type: 'bus' }),
    }),

  get: (id: number) =>
    apiFetch<{ data: Site }>('/v2/getSite', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
}

// ── Routes API ────────────────────────────────────────────────────────────────

export const routesApi = {
  list: (page = 1) =>
    apiFetch<{ data: Pagination<Route> }>('/v2/listroutes', {
      method: 'POST',
      body: JSON.stringify({ page }),
    }),

  search: (params: { source_place_id?: number; destination_place_id?: number }) =>
    apiFetch<{ data: Pagination<Route> }>('/v2/routes', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
}

// ── Events API ────────────────────────────────────────────────────────────────

export const eventsApi = {
  list: (params: {
    search?: string
    taluka?: string
    is_free?: boolean
    is_featured?: boolean
    per_page?: number
    page?: number
  } = {}) =>
    apiFetch<{ data: Pagination<Event> }>('/v2/listEvents', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  get: (slug: string) =>
    apiFetch<{ data: Event }>(`/v2/events/${slug}`, { method: 'GET' }),

  create: (data: Partial<Event>) =>
    apiFetch<{ data: Event }>('/v2/createEvent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  like: (id: number) =>
    apiFetch<{ data: { liked: boolean; like_count: number } }>('/v2/likeEvent', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  going: (id: number) =>
    apiFetch<{ data: { is_going: boolean; going_count: number } }>('/v2/goingEvent', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  interested: (id: number) =>
    apiFetch<{ data: { is_interested: boolean; interested_count: number } }>('/v2/interestedEvent', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
}

// ── Gallery API ───────────────────────────────────────────────────────────────

export const galleryApi = {
  list: (params: { search?: string; category?: string; site_id?: number; per_page?: number; page?: number } = {}) =>
    apiFetch<{ data: Pagination<GalleryItem> }>('/v2/getGallery', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
}

// ── Favourites API ────────────────────────────────────────────────────────────

export const favouritesApi = {
  list: (page = 1) =>
    apiFetch<{ data: Pagination<Favourite> }>('/v2/favourites', {
      method: 'POST',
      body: JSON.stringify({ page }),
    }),

  toggle: (type: string, id: number) =>
    apiFetch('/v2/addDeleteFavourite', {
      method: 'POST',
      body: JSON.stringify({ favouritable_type: type, favouritable_id: id }),
    }),
}

// ── Categories API ────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: (page = 1) =>
    apiFetch<{ data: Pagination<Category> }>('/v2/listcategories', {
      method: 'POST',
      body: JSON.stringify({ page }),
    }),
}

// ── Comments API ──────────────────────────────────────────────────────────────

export const commentsApi = {
  list: (type: string, id: number, page = 1) =>
    apiFetch<{ data: Pagination<Comment> }>('/v2/comments', {
      method: 'POST',
      body: JSON.stringify({ commentable_type: type, commentable_id: id, page }),
    }),

  add: (type: string, id: number, comment: string, parent_id?: number) =>
    apiFetch<{ data: Comment }>('/v2/comment', {
      method: 'POST',
      body: JSON.stringify({ commentable_type: type, commentable_id: id, comment, parent_id }),
    }),

  delete: (id: number) =>
    apiFetch('/v2/deleteComment', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
}

// ── Ratings API ───────────────────────────────────────────────────────────────

export const ratingsApi = {
  addUpdate: (type: string, id: number, rate: number) =>
    apiFetch('/v2/addUpdateRating', {
      method: 'POST',
      body: JSON.stringify({ rateable_type: type, rateable_id: id, rate }),
    }),
}

// ── Landing Page API ──────────────────────────────────────────────────────────

export const landingApi = {
  get: (site_id?: number) =>
    apiFetch<{ data: LandingPageData }>('/v2/landingpage', {
      method: 'POST',
      body: JSON.stringify(site_id ? { site_id } : {}),
    }),
}

export interface LandingPageData {
  version?: string
  user?: User
  banners?: GalleryItem[]
  categories?: Category[]
  cities?: Site[]
  trending?: Site[]
  gallery?: GalleryItem[]
  blogs?: unknown[]
}

// ── Vendor Onboarding API (M5) ────────────────────────────────────────────────
// The combined first-time wizard at /vendor/register. The backend guard admits
// the combined endpoint only for users with zero sites and an X-App-Source: web
// header — established vendors manage listings in the app.

export interface BusinessCategory {
  id: number
  name: string
  mr_name?: string | null
  code: string
  icon?: string | null
  sub_categories?: BusinessCategory[]
  subCategories?: BusinessCategory[]
}

/**
 * One entry of a product category's `attribute_schema` — the backend validates
 * submitted attributes against this, so the form has to be built from it.
 */
export interface ProductAttributeSpec {
  type: 'string' | 'text' | 'int' | 'decimal' | 'bool' | 'enum' | 'multi' | 'date' | 'time'
  label: string
  required?: boolean
  min?: number
  max?: number
  options?: string[]
}

/** A product on one of the signed-in vendor's own sites. */
export interface VendorProduct {
  id: number
  name: string
  description?: string | null
  base_price?: string | number | null
  status?: boolean | number
  attributes?: Record<string, unknown> | null
  // Laravel serialises the eager-loaded relations in snake_case
  product_category?: {
    id: number
    name: string
    code?: string
    booking_type?: string
    /**
     * The form schema lives HERE, on the category relation — not at the product
     * root, where the API contract's "full detail including attribute_schema"
     * reads as if it might. The editor renders from this.
     */
    attribute_schema?: Record<string, ProductAttributeSpec> | null
  } | null
  site?: { id: number; name: string } | null
  default_variant?: { price?: string | number | null } | null
}

export interface ProductCategoryOption {
  id: number
  name: string
  mr_name?: string | null
  code: string
  booking_type?: string
  has_attributes?: boolean
  /** Keyed by attribute name, e.g. { duration_min: { type: 'int', … } } */
  attribute_schema?: Record<string, ProductAttributeSpec> | null
}

export const vendorApi = {
  businessCategories: () =>
    apiFetch<{ data: BusinessCategory[] }>('/v2/businessCategories', { method: 'POST', body: JSON.stringify({}) }),

  /** Product categories reachable from chosen business categories — pre-site variant */
  allowedProductCategories: (categoryIds: number[]) =>
    apiFetch<{ data: ProductCategoryOption[] }>('/v2/allowedProductCategories', {
      method: 'POST',
      body: JSON.stringify({ category_ids: categoryIds }),
    }),

  parseMapUrl: (url: string) =>
    apiFetch<{ data: { latitude: number; longitude: number } }>('/v2/parseMapUrl', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),

  /** The combined submission. FormData because it may carry image/logo/reg_doc files. */
  onboard: (form: FormData) =>
    apiFetch<{ data: { site: Site; product?: unknown; role_request?: unknown } }>('/v2/vendorOnboard', {
      method: 'POST',
      headers: { 'X-App-Source': 'web' },
      body: form,
    }),

  /** Fill exactly the missing contact fields when the gate rejects the request */
  updateProfile: (payload: { email?: string; mobile?: string }) =>
    apiFetch<{ success: boolean; message?: unknown; data?: User }>('/v2/updateProfile', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Google Identity Services credential → backend session (JWT) */
  googleAuth: (idToken: string, email?: string) =>
    // Lives under the v2/auth group, same endpoint the Android app posts to.
    apiFetch<{ data: AuthResponse }>('/v2/auth/googleAuth', {
      method: 'POST',
      body: JSON.stringify({ token: idToken, userEmail: email, language: 'en' }),
      skipAuth: true,
    }),

  // ── Vendor's own businesses and catalogue ──────────────────────────────────
  // All three sit behind the backend's `vendor` middleware, so a signed-in user
  // who has not onboarded gets an error rather than an empty list — which is how
  // the UI tells "no businesses yet" from "not a vendor".

  mySites: (page = 1) =>
    apiFetch<{ data: Pagination<Site> }>('/v2/mySites', {
      method: 'POST',
      body: JSON.stringify({ page }),
    }),

  myProducts: (
    params: { site_id?: number; status?: ProductStatus; search?: string; page?: number; per_page?: number } = {}
  ) =>
    apiFetch<{ data: Pagination<VendorProduct> }>('/v2/myProducts', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  /** Returns a DRAFT — media, variants and submit-for-review follow separately. */
  addProduct: (data: ProductWriteFields & { site_id: number; product_category_id: number; name: string }) =>
    apiFetch<{ data: VendorProductDetail }>('/v2/addProduct', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ── Dashboard reads ─────────────────────────────────────────────────────────

  /** Views, leads and listing counts over a date range (default: the server's own). */
  myUsageStats: (params: { from?: string; to?: string } = {}) =>
    apiFetch<{ data: VendorUsageStats }>('/v2/myUsageStats', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  mySubscription: () =>
    apiFetch<{ data: VendorSubscriptionInfo }>('/v2/mySubscription', {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  /**
   * Enquiries. `unread_count` is merged into the paginator payload by the server
   * rather than sent alongside it, so the badge needs no second request.
   */
  myLeads: (params: { product_id?: number; lead_type?: LeadType; unread_only?: boolean; page?: number } = {}) =>
    apiFetch<{ data: Pagination<VendorLead> & { unread_count: number } }>('/v2/myLeads', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  /**
   * One enquiry, or every unread one. Both shapes are the server's — `{all: true}`
   * returns `{marked: n}` rather than the lead, so neither is worth typing beyond
   * "it worked"; the caller refetches.
   */
  markLeadRead: (target: { id: number } | { all: true }) =>
    apiFetch<{ success: boolean; data?: unknown }>('/v2/markLeadRead', {
      method: 'POST',
      body: JSON.stringify(target),
    }),

  // ── Outlets ─────────────────────────────────────────────────────────────────

  /**
   * The outlet picker. Includes `pending` sites — a vendor builds a catalog while
   * the business is under review, so only `rejected` blocks adding products.
   *
   * Paginated, like every list in this API: the rows are `res.data.data`. The
   * server pages it even though a vendor has a handful of outlets, so a caller
   * reading `res.data` as an array silently sees none at all.
   */
  mySubmissions: (page = 1) =>
    apiFetch<{ data: Pagination<VendorSite> }>('/v2/mySubmissions', {
      method: 'POST',
      body: JSON.stringify({ page }),
    }),

  setPrimarySite: (id: number) =>
    apiFetch<{ success: boolean }>('/v2/setPrimarySite', { method: 'POST', body: JSON.stringify({ id }) }),

  /** Multipart: it may carry a replacement image or logo. */
  updateMySubmission: (form: FormData) =>
    apiFetch<{ data: VendorSite }>('/v2/updateMySubmission', { method: 'POST', body: form }),

  deleteMySubmission: (id: number) =>
    apiFetch<{ success: boolean }>('/v2/deleteMySubmission', { method: 'POST', body: JSON.stringify({ id }) }),

  // ── Product taxonomy ────────────────────────────────────────────────────────

  /** What this outlet may sell, resolved from the site's own business categories. */
  allowedProductCategoriesForSite: (siteId: number) =>
    apiFetch<{ data: ProductCategoryOption[] }>('/v2/allowedProductCategories', {
      method: 'POST',
      body: JSON.stringify({ site_id: siteId }),
    }),

  categoryAttributeSchema: (productCategoryId: number) =>
    apiFetch<{ data: ProductCategoryOption }>('/v2/categoryAttributeSchema', {
      method: 'POST',
      body: JSON.stringify({ product_category_id: productCategoryId }),
    }),

  // ── Product editing ─────────────────────────────────────────────────────────

  getProduct: (id: number) =>
    apiFetch<{ data: VendorProductDetail }>('/v2/getProduct', { method: 'POST', body: JSON.stringify({ id }) }),

  /**
   * `attributes` goes up as a JSON string, which is what the server validates
   * against the category schema. `status`, `is_featured`, `is_bookable` and
   * `fulfilment_type` are not a vendor's to set — posting them is ignored, so the
   * editor renders no control for them.
   */
  updateProduct: (data: ProductWriteFields & { id: number }) =>
    apiFetch<{ data: VendorProductDetail }>('/v2/updateProduct', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: number) =>
    apiFetch<{ success: boolean }>('/v2/deleteProduct', { method: 'POST', body: JSON.stringify({ id }) }),

  submitProductForReview: (id: number) =>
    apiFetch<{ success: boolean }>('/v2/submitProductForReview', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  /** approved ⇄ paused. Anything else is not a vendor's switch to throw. */
  toggleProductStatus: (id: number) =>
    apiFetch<{ success: boolean }>('/v2/toggleProductStatus', { method: 'POST', body: JSON.stringify({ id }) }),

  bulkProductStatus: (ids: number[], status: 'approved' | 'paused') =>
    apiFetch<{ success: boolean }>('/v2/bulkProductStatus', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    }),

  // ── Variants ────────────────────────────────────────────────────────────────

  /** Omit `variant_id` to create. `is_default: true` clears the flag on the others. */
  saveProductVariant: (data: {
    id: number
    variant_id?: number
    name: string
    price: string | number
    sale_price?: string | number | null
    sku?: string | null
    stock?: number | null
    is_default?: boolean
    sort_order?: number
  }) => apiFetch<{ data: ProductVariant }>('/v2/saveProductVariant', { method: 'POST', body: JSON.stringify(data) }),

  /** The last variant cannot be deleted — the server answers 422. */
  deleteProductVariant: (id: number, variantId: number) =>
    apiFetch<{ success: boolean }>('/v2/deleteProductVariant', {
      method: 'POST',
      body: JSON.stringify({ id, variant_id: variantId }),
    }),

  // ── Media ───────────────────────────────────────────────────────────────────

  /** One image per call, and the first one uploaded becomes the cover. */
  uploadProductMedia: (form: FormData) =>
    apiFetch<{ data: ProductMedia }>('/v2/uploadProductMedia', { method: 'POST', body: form }),

  /** Deleting the cover promotes the next image server-side. */
  deleteProductMedia: (id: number, mediaId: number) =>
    apiFetch<{ success: boolean }>('/v2/deleteProductMedia', {
      method: 'POST',
      body: JSON.stringify({ id, media_id: mediaId }),
    }),

  setProductCover: (id: number, mediaId: number) =>
    apiFetch<{ success: boolean }>('/v2/setProductCover', {
      method: 'POST',
      body: JSON.stringify({ id, media_id: mediaId }),
    }),

  /** Every image id, in the new order — a partial list is rejected. */
  reorderProductMedia: (id: number, mediaIds: number[]) =>
    apiFetch<{ success: boolean }>('/v2/reorderProductMedia', {
      method: 'POST',
      body: JSON.stringify({ id, media_ids: mediaIds }),
    }),

  // ── Analytics and plan ──────────────────────────────────────────────────────

  productAnalytics: (id: number, params: { from?: string; to?: string } = {}) =>
    apiFetch<{ data: ProductAnalytics }>('/v2/productAnalytics', {
      method: 'POST',
      body: JSON.stringify({ id, ...params }),
    }),

  listPlans: () => apiFetch<{ data: PlanOption[] }>('/v2/listPlans', { method: 'POST', body: '{}' }),
}
