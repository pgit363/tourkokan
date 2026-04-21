/**
 * Central API client for Tourkokan backend.
 * All requests go through the Next.js proxy rewrite:
 *   /api/proxy/:path* → ${NEXT_PUBLIC_API_URL}/api/:path*
 */

export const API_BASE = '/api/proxy'
export const FTP_PATH = process.env.NEXT_PUBLIC_FTP_PATH ?? 'https://ftp.dev.tourkokan.com/'

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
    const error = new ApiError(message, res.status, err?.errors)
    throw error
  }

  return data as T
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

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
  role_id?: number
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
  code: string
  icon?: string
  parent_id?: number
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

  register: async (data: {
    name: string
    email?: string
    mobile?: string
    password?: string
    language?: 'en' | 'mr'
  }) => {
    const res = await apiFetch<{ data: AuthResponse }>('/v2/auth/register', {
      method: 'POST',
      body: JSON.stringify({ language: 'en', ...data }),
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
  list: (params: { search?: string; category?: string; per_page?: number; page?: number } = {}) =>
    apiFetch<{ data: Pagination<Site> }>('/v2/sites', {
      method: 'POST',
      body: JSON.stringify({ apitype: 'list', ...params }),
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
