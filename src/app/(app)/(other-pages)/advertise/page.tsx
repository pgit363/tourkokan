'use client'

import { useLang } from '@/context/LanguageContext'
import { useEffect, useRef, useState } from 'react'

const API_BASE = '/api/proxy'

interface BannerPackage {
  id: number
  name: string
  description?: string
  price: number
  duration_days?: number
  allowed_placements?: string[]
}

// ─── Ad Placement Types & Data ──────────────────────────────────────────────

type SlotKey =
  | 'APP_SPLASH'
  | 'HOME_HERO'
  | 'HOME_MIDDLE'
  | 'HOME_FOOTER'
  | 'CITY_MIDDLE'
  | 'CITY_FOOTER'
  | 'ROUTE_LIST_MIDDLE'
  | 'ROUTE_LIST_FOOTER'
  | 'ROUTE_DETAIL_MIDDLE'
  | 'ROUTE_DETAIL_FOOTER'

type ScreenId = 'splash' | 'home' | 'routeList' | 'routeDetail' | 'city'

interface AdSlot {
  key: SlotKey
  label: string
  screen: string
  pos: string
  screenId: ScreenId
  emoji: string
}

const AD_SLOTS: AdSlot[] = [
  { key: 'APP_SPLASH',         label: 'App Splash',          screen: 'App Launch',              pos: 'Full-screen overlay when app opens',      screenId: 'splash',      emoji: '📱' },
  { key: 'HOME_HERO',          label: 'Home Hero',           screen: 'Home Screen',             pos: 'Top hero banner (above the fold)',         screenId: 'home',        emoji: '🏠' },
  { key: 'HOME_MIDDLE',        label: 'Home Middle',         screen: 'Home Screen',             pos: 'Between Bus Search & Categories',          screenId: 'home',        emoji: '🏠' },
  { key: 'HOME_FOOTER',        label: 'Home Footer',         screen: 'Home Screen',             pos: 'Bottom of the home feed',                  screenId: 'home',        emoji: '🏠' },
  { key: 'CITY_MIDDLE',        label: 'Destination Mid',     screen: 'Destination / Place',     pos: 'Mid-scroll between content sections',      screenId: 'city',        emoji: '📍' },
  { key: 'CITY_FOOTER',        label: 'Destination Footer',  screen: 'Destination / Place',     pos: 'Bottom of the detail page',                screenId: 'city',        emoji: '📍' },
  { key: 'ROUTE_LIST_MIDDLE',  label: 'Route List Mid',      screen: 'Bus Route List',          pos: 'After the 5th route card',                 screenId: 'routeList',   emoji: '🚌' },
  { key: 'ROUTE_LIST_FOOTER',  label: 'Route List Footer',   screen: 'Bus Route List',          pos: 'Below all route cards',                    screenId: 'routeList',   emoji: '🚌' },
  { key: 'ROUTE_DETAIL_MIDDLE',label: 'Route Detail Mid',    screen: 'Route Detail (Stops)',    pos: 'After ~50% of stop timeline',              screenId: 'routeDetail', emoji: '🗺️' },
  { key: 'ROUTE_DETAIL_FOOTER',label: 'Route Detail Footer', screen: 'Route Detail (Stops)',    pos: 'Below the last stop',                      screenId: 'routeDetail', emoji: '🗺️' },
]

const SCREEN_BADGE: Record<ScreenId, string> = {
  splash:      'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  home:        'bg-primary-100 text-primary-400 dark:bg-primary-900/30 dark:text-blue-300',
  city:        'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  routeList:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  routeDetail: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

// ─── Phone Mockup Building Blocks ───────────────────────────────────────────

// ─── Ad Banner — focal point when active, invisible skeleton when not ─────────

const AdBanner = ({ slotKey, label, activeSlots }: { slotKey: SlotKey; label: string; activeSlots: SlotKey[] }) => {
  const active = activeSlots.includes(slotKey)
  if (active) {
    return (
      <div className="mx-3 my-3 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 px-4 py-5 text-center shadow-[0_0_24px_rgba(245,158,11,0.45)] dark:bg-amber-900/25">
        <div className="text-sm font-bold uppercase tracking-widest text-amber-600">📢 Your Ad Here</div>
        <div className="mt-1 text-xs font-semibold text-amber-500">{label}</div>
        <div className="mt-2 inline-block rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-bold text-white">{slotKey}</div>
      </div>
    )
  }
  return <div className="mx-3 my-1.5 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
}

// ─── Phone Shell ─────────────────────────────────────────────────────────────

const PhoneShell = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-[260px] overflow-hidden rounded-[30px] border-[4px] border-neutral-800 bg-neutral-50 shadow-2xl sm:w-[290px] sm:rounded-[36px] dark:border-neutral-600 dark:bg-neutral-900">
    <div className="relative flex items-center justify-between bg-neutral-900 px-4 py-2 sm:px-5">
      <span className="text-[10px] font-semibold text-white/60">9:41</span>
      <div className="absolute left-1/2 top-0 h-4 w-14 -translate-x-1/2 rounded-b-full bg-black sm:w-16" />
      <span className="text-[10px] font-semibold text-white/60">100%</span>
    </div>
    <div className="max-h-[500px] overflow-y-auto overscroll-contain sm:max-h-[560px]">{children}</div>
  </div>
)

// ─── Skeleton building blocks (no real text) ──────────────────────────────────

const SkHdr = () => (
  <div className="bg-neutral-800 px-4 pb-5 pt-3">
    <div className="h-3 w-24 rounded-full bg-white/25" />
    <div className="mt-3 h-5 rounded-t-2xl bg-neutral-50 dark:bg-neutral-900" />
  </div>
)

const SkSearch = () => (
  <div className="mx-3 my-2 flex items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2.5 dark:bg-neutral-800">
    <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-600" />
    <div className="h-2.5 w-32 rounded-full bg-neutral-200 dark:bg-neutral-700" />
  </div>
)

const SkSecHdr = () => (
  <div className="mx-3 my-2 flex items-center justify-between">
    <div className="h-2.5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />
    <div className="h-2 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
  </div>
)

const SkChips = () => (
  <div className="mx-3 mb-2 flex gap-2">
    <div className="h-5 w-20 rounded-full bg-neutral-800 dark:bg-neutral-200" />
    <div className="h-5 w-14 rounded-full bg-neutral-200 dark:bg-neutral-700" />
    <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
  </div>
)

const SkCard = ({ tall = false }: { tall?: boolean }) => (
  <div className={`mx-3 my-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 ${tall ? 'h-14' : 'h-10'}`} />
)

const SkListItem = () => (
  <div className="mx-3 my-1 flex items-center gap-2">
    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
    <div className="h-2.5 w-40 rounded-full bg-neutral-200 dark:bg-neutral-700" />
  </div>
)

const SkRouteCard = () => (
  <div className="mx-3 my-1.5 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
    <div className="h-5 bg-neutral-700 dark:bg-neutral-600" />
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="h-8 w-8 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-700" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-32 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-2 w-24 rounded-full bg-neutral-100 dark:bg-neutral-600" />
      </div>
    </div>
  </div>
)

const SkStop = ({ isEnd = false, isLast = false }: { isEnd?: boolean; isLast?: boolean }) => (
  <div className="mx-3 my-1 flex items-start gap-2.5">
    <div className="flex shrink-0 flex-col items-center pt-0.5">
      <div className={`h-3 w-3 rounded-full border-2 ${isEnd ? 'border-amber-400 bg-amber-100' : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900'}`} />
      {!isLast && <div className="mt-0.5 h-6 w-0.5 bg-neutral-200 dark:bg-neutral-700" />}
    </div>
    <div className={`mt-0.5 h-2.5 rounded-full ${isEnd ? 'w-28 bg-neutral-400 dark:bg-neutral-500' : 'w-36 bg-neutral-200 dark:bg-neutral-700'}`} />
  </div>
)

const SkHeroImg = () => (
  <div className="-mt-4 mx-3 mb-2 h-20 rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
)

const SkPlaceGrid = () => (
  <div className="mx-3 my-2 grid grid-cols-2 gap-2">
    <div className="h-16 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
    <div className="h-16 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
  </div>
)

const SkDivider = () => <div className="mx-3 my-1 h-px bg-neutral-100 dark:bg-neutral-800" />

// ─── Screen Mockups ──────────────────────────────────────────────────────────

const SplashScreen = ({ activeSlots }: { activeSlots: SlotKey[] }) => {
  const active = activeSlots.includes('APP_SPLASH')
  return (
    <PhoneShell>
      <div className="relative flex min-h-[500px] flex-col items-center justify-center gap-4 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 sm:min-h-[560px]">
        {/* app logo skeleton */}
        <div className="h-14 w-14 rounded-3xl bg-white/15" />
        <div className="h-3.5 w-32 rounded-full bg-white/20" />
        <div className="h-2.5 w-20 rounded-full bg-white/10" />
        {active ? (
          <div className="mt-5 w-52 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-900/30 px-5 py-6 text-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <div className="text-sm font-bold uppercase tracking-widest text-amber-400">📢 Your Ad Here</div>
            <div className="mt-1.5 text-xs text-amber-300">Full-screen Splash Ad</div>
            <div className="mt-2.5 inline-block rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-bold text-white">APP_SPLASH</div>
          </div>
        ) : (
          <div className="mt-5 h-28 w-52 rounded-2xl bg-white/5 border border-white/10" />
        )}
        {/* skip button skeleton */}
        <div className="absolute bottom-6 right-4 h-6 w-14 rounded-xl bg-white/10" />
      </div>
    </PhoneShell>
  )
}

const HomeScreen = ({ activeSlots }: { activeSlots: SlotKey[] }) => (
  <PhoneShell>
    <AdBanner slotKey="HOME_HERO" label="Hero Carousel Banner" activeSlots={activeSlots} />
    <SkSearch />
    <SkSecHdr />
    <SkChips />
    <SkCard />
    <SkSecHdr />
    <SkCard />
    <AdBanner slotKey="HOME_MIDDLE" label="Mid-page Promo Banner" activeSlots={activeSlots} />
    <SkSecHdr />
    <SkChips />
    <SkListItem />
    <SkListItem />
    <SkDivider />
    <AdBanner slotKey="HOME_FOOTER" label="Footer Promo Banner" activeSlots={activeSlots} />
    <div className="h-3" />
  </PhoneShell>
)

const RouteListScreen = ({ activeSlots }: { activeSlots: SlotKey[] }) => (
  <PhoneShell>
    <SkHdr />
    <SkCard />
    <SkSecHdr />
    <SkListItem />
    <SkListItem />
    <SkDivider />
    <SkSecHdr />
    <SkRouteCard />
    <SkRouteCard />
    <SkRouteCard />
    <SkRouteCard />
    <SkRouteCard />
    <AdBanner slotKey="ROUTE_LIST_MIDDLE" label="After 5th Route Card" activeSlots={activeSlots} />
    <SkRouteCard />
    <AdBanner slotKey="ROUTE_LIST_FOOTER" label="Route List Footer" activeSlots={activeSlots} />
    <div className="h-3" />
  </PhoneShell>
)

const RouteDetailScreen = ({ activeSlots }: { activeSlots: SlotKey[] }) => (
  <PhoneShell>
    <SkHdr />
    <SkRouteCard />
    <SkSecHdr />
    <SkStop isEnd />
    <SkStop />
    <SkStop />
    <SkStop />
    <SkStop />
    <AdBanner slotKey="ROUTE_DETAIL_MIDDLE" label="Mid-timeline Banner" activeSlots={activeSlots} />
    <SkStop />
    <SkStop isEnd isLast />
    <AdBanner slotKey="ROUTE_DETAIL_FOOTER" label="Route Detail Footer" activeSlots={activeSlots} />
    <div className="h-3" />
  </PhoneShell>
)

const CityScreen = ({ activeSlots }: { activeSlots: SlotKey[] }) => (
  <PhoneShell>
    <SkHdr />
    <SkHeroImg />
    <SkCard />
    <SkSecHdr />
    <SkCard tall />
    <SkSecHdr />
    <SkPlaceGrid />
    <AdBanner slotKey="CITY_MIDDLE" label="City Mid-page Banner" activeSlots={activeSlots} />
    <SkSecHdr />
    <SkListItem />
    <SkListItem />
    <AdBanner slotKey="CITY_FOOTER" label="City Footer Banner" activeSlots={activeSlots} />
    <div className="h-3" />
  </PhoneShell>
)

const SCREEN_LABELS: Record<ScreenId, string> = {
  splash:      '⓪ App Splash',
  home:        '① Home Screen',
  routeList:   '② Bus Routes',
  routeDetail: '③ Route Detail',
  city:        '④ Destination',
}

function renderScreen(screenId: ScreenId, activeSlots: SlotKey[]) {
  if (screenId === 'splash')      return <SplashScreen activeSlots={activeSlots} />
  if (screenId === 'home')        return <HomeScreen activeSlots={activeSlots} />
  if (screenId === 'routeList')   return <RouteListScreen activeSlots={activeSlots} />
  if (screenId === 'routeDetail') return <RouteDetailScreen activeSlots={activeSlots} />
  return <CityScreen activeSlots={activeSlots} />
}

// ─── Placement Row (inside package card) ────────────────────────────────────

const PlacementRow = ({
  placementKey,
  isPopular,
  onPreview,
}: {
  placementKey: string
  isPopular: boolean
  onPreview: (key: SlotKey) => void
}) => {
  const slot = AD_SLOTS.find((s) => s.key === placementKey)

  return (
    <div
      className={`group flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition-colors ${
        isPopular ? 'hover:bg-white/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
      } ${slot ? '' : 'cursor-default'}`}
      onClick={() => slot && onPreview(slot.key)}
    >
      {/* Check */}
      <svg
        className={`mt-0.5 h-5 w-5 shrink-0 ${isPopular ? 'text-white' : 'text-green-500'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>

      {/* Label + badge + desc */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-base font-semibold leading-tight ${isPopular ? 'text-white' : 'text-neutral-800 dark:text-neutral-100'}`}>
            {slot?.label ?? placementKey}
          </span>
          {slot && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold leading-none ${
              isPopular ? 'bg-white/20 text-white' : SCREEN_BADGE[slot.screenId]
            }`}>
              {slot.screen}
            </span>
          )}
        </div>
        {slot && (
          <p className={`mt-1 text-sm leading-snug ${isPopular ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {slot.pos}
          </p>
        )}
      </div>

      {/* Eye icon */}
      {slot && (
        <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 transition-colors ${
          isPopular
            ? 'text-white/50 group-hover:bg-white/20 group-hover:text-white'
            : 'text-neutral-300 group-hover:bg-primary-50 group-hover:text-primary-500 dark:text-neutral-600 dark:group-hover:bg-primary-900/20 dark:group-hover:text-primary-400'
        }`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const PLACEMENTS_VISIBLE = 4

const AdvertisePage = () => {
  const { t } = useLang()
  const [packages, setPackages] = useState<BannerPackage[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [showAllPlacements, setShowAllPlacements] = useState<Record<number, boolean>>({})

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [previewSlot, setPreviewSlot] = useState<SlotKey | null>(null)
  const [previewPackageSlots, setPreviewPackageSlots] = useState<SlotKey[]>([])
  const [viewAll, setViewAll] = useState(false)
  const activeSlotRef = useRef<HTMLDivElement>(null)

  const openPreview = (slot: SlotKey, pkgSlots: SlotKey[]) => {
    setPreviewSlot(slot)
    setPreviewPackageSlots(pkgSlots)
  }

  useEffect(() => {
    fetch(`${API_BASE}/v2/advertisingPackages`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? []
        setPackages(list)
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false))
  }, [])

  useEffect(() => {
    if (previewSlot && activeSlotRef.current) {
      setTimeout(() => activeSlotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120)
    }
  }, [previewSlot])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const payload = { ...form, message: form.message || `Interested in advertising with Tourkokan.` }
      const res = await fetch(`${API_BASE}/v2/addGuestQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data?.message && typeof data.message === 'object') {
          setFieldErrors(data.message as Record<string, string[]>)
          setErrorMsg('')
        } else {
          setErrorMsg(data?.message ?? 'Something went wrong. Please try again.')
          setFieldErrors({})
        }
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
        setFieldErrors({})
      }
    } catch {
      setErrorMsg('Unable to reach the server. Please try again later.')
      setStatus('error')
    }
  }

  const whyItems = [
    { titleKey: 'targetedTitle' as const, descKey: 'targetedDesc' as const, icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { titleKey: 'measurableTitle' as const, descKey: 'measurableDesc' as const, icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { titleKey: 'affordableTitle' as const, descKey: 'affordableDesc' as const, icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ]

  const previewSlotData = previewSlot ? AD_SLOTS.find(s => s.key === previewSlot) : null
  const previewIndex = previewSlot ? previewPackageSlots.indexOf(previewSlot) : -1
  const previewTotal = previewPackageSlots.length

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-6xl">

        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            {t.advertise.pageTag}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl xl:text-6xl dark:text-white">
            {t.advertise.pageTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
            {t.advertise.pageSubtitle}
          </p>
        </div>

        {/* Why Advertise */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyItems.map((item) => (
            <div key={item.titleKey} className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{t.advertise[item.titleKey]}</h2>
              <p className="mt-2 text-base leading-relaxed text-neutral-500 dark:text-neutral-400">{t.advertise[item.descKey]}</p>
            </div>
          ))}
        </div>

        {/* Packages + Placement Previews */}
        <div className="mb-16">
          {/* Section header with View All */}
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">{t.advertise.packagesTitle}</h2>
            <button
              onClick={() => setViewAll(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-primary-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-primary-500"
            >
              <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              View All App Screens
            </button>
          </div>

          {/* Hint */}
          <p className="mb-6 text-base text-neutral-500 dark:text-neutral-400">
            Each package includes specific ad slots. Click the{' '}
            <svg className="inline h-4 w-4 align-text-bottom text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {' '}icon on any placement to see exactly where it appears in the app.
          </p>

          {loadingPackages ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="mb-3 h-5 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="mb-2 h-8 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="space-y-2 mt-4">
                    {[1,2,3].map(j => <div key={j} className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-700" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, idx) => {
                const isPopular = idx === 1
                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col rounded-2xl border p-6 ${
                      isPopular
                        ? 'border-primary-500 bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/40'
                        : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-1.5 text-base font-bold text-primary-600">
                        {t.advertise.mostPopular}
                      </span>
                    )}

                    {/* Name */}
                    <h2 className={`text-xl font-bold sm:text-2xl ${isPopular ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                      {pkg.name}
                    </h2>

                    {/* Price */}
                    <div className={`mt-3 text-4xl font-bold sm:text-5xl ${isPopular ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                      ₹{pkg.price.toLocaleString('en-IN')}
                      {pkg.duration_days && (
                        <span className={`ml-1 text-base font-normal ${isPopular ? 'text-primary-100' : 'text-neutral-500'}`}>
                          / {pkg.duration_days} {t.common.days}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {pkg.description && (
                      <p className={`mt-3 text-base leading-relaxed ${isPopular ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {pkg.description}
                      </p>
                    )}

                    {/* Placements — rich rows */}
                    {Array.isArray(pkg.allowed_placements) && pkg.allowed_placements.length > 0 && (() => {
                      const expanded = !!showAllPlacements[pkg.id]
                      const visible = expanded ? pkg.allowed_placements : pkg.allowed_placements.slice(0, PLACEMENTS_VISIBLE)
                      const hasMore = pkg.allowed_placements.length > PLACEMENTS_VISIBLE
                      return (
                        <div className="mt-6 flex-1">
                          <div className="mb-3 flex items-center justify-between">
                            <p className={`text-sm font-bold uppercase tracking-wider ${isPopular ? 'text-primary-200' : 'text-neutral-400 dark:text-neutral-500'}`}>
                              {t.advertise.placements}
                            </p>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isPopular ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'}`}>
                              {pkg.allowed_placements.length} slots
                            </span>
                          </div>

                          <div className={`divide-y rounded-xl ${isPopular ? 'divide-white/10 bg-white/10' : 'divide-neutral-100 bg-neutral-50 dark:divide-neutral-700 dark:bg-neutral-700/30'}`}>
                            {visible.map((placement) => (
                              <PlacementRow
                                key={placement}
                                placementKey={placement}
                                isPopular={isPopular}
                                onPreview={(key) => openPreview(key, pkg.allowed_placements as SlotKey[])}
                              />
                            ))}
                          </div>

                          {hasMore && (
                            <button
                              type="button"
                              onClick={() => setShowAllPlacements((prev) => ({ ...prev, [pkg.id]: !expanded }))}
                              className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition ${
                                isPopular
                                  ? 'bg-white/15 text-white hover:bg-white/25'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                              }`}
                            >
                              {expanded
                                ? `See less ↑`
                                : `See ${pkg.allowed_placements.length - PLACEMENTS_VISIBLE} more ↓`}
                            </button>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">{t.advertise.noPackages}</p>
            </div>
          )}
        </div>

        {/* Enquiry Form */}
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">{t.advertise.quoteTitle}</h2>
            <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400">{t.advertise.quoteSubtitle}</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8 dark:border-neutral-700 dark:bg-neutral-800">
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{t.advertise.enquirySentTitle}</h3>
                <p className="text-neutral-500 dark:text-neutral-400">{t.advertise.enquirySentMsg}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  {t.advertise.sendAnotherEnquiry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t.advertise.businessNameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder={t.advertise.businessPlaceholder}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t.advertise.phoneLabel}
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                    />
                    {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone[0]}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.advertise.emailLabel}
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.advertise.tellUsLabel}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t.advertise.tellUsPlaceholder}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                  />
                  {fieldErrors.message && <p className="mt-1 text-xs text-red-500">{fieldErrors.message[0]}</p>}
                </div>

                {status === 'error' && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {status === 'loading' ? t.advertise.sendingEnquiry : t.advertise.sendEnquiry}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Single Slot Preview Modal ──────────────────────────────────────── */}
      {previewSlot && previewSlotData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-4"
          onClick={() => setPreviewSlot(null)}
        >
          <div
            className="relative flex w-full max-w-sm flex-col rounded-3xl bg-neutral-100 p-5 shadow-2xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setPreviewSlot(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Slot Info */}
            <div className={`mb-1 inline-block self-start rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SCREEN_BADGE[previewSlotData.screenId]}`}>
              {previewSlotData.screen}
            </div>
            <div className="mt-1 text-base font-bold text-neutral-900 dark:text-white">{previewSlotData.label}</div>
            <div className="mb-4 mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {previewSlotData.pos}
            </div>

            {/* Phone Mockup */}
            <div ref={activeSlotRef}>
              {renderScreen(previewSlotData.screenId, [previewSlot])}
            </div>

            {/* Navigation */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setPreviewSlot(previewPackageSlots[(previewIndex - 1 + previewTotal) % previewTotal])}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                ← Prev
              </button>
              <span className="text-xs text-neutral-400">{previewIndex + 1} / {previewTotal}</span>
              <button
                onClick={() => setPreviewSlot(previewPackageSlots[(previewIndex + 1) % previewTotal])}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View All Screens Modal ─────────────────────────────────────────── */}
      {viewAll && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-neutral-950/90 p-6"
          onClick={() => setViewAll(false)}
        >
          <div className="mx-auto max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">All App Screens — Ad Placements</h3>
                <p className="mt-1 text-sm text-neutral-400">All highlighted slots show where your ad appears on each screen</p>
              </div>
              <button
                onClick={() => setViewAll(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* All 5 Screens */}
            <div className="flex gap-8 overflow-x-auto pb-6">
              {(['splash', 'home', 'routeList', 'routeDetail', 'city'] as ScreenId[]).map((screenId) => {
                const slotsForScreen = AD_SLOTS.filter(s => s.screenId === screenId).map(s => s.key)
                return (
                  <div key={screenId} className="shrink-0">
                    <div className="mb-3 text-center text-sm font-bold text-white">{SCREEN_LABELS[screenId]}</div>
                    {renderScreen(screenId, slotsForScreen)}
                    <div className="mt-3 space-y-1">
                      {slotsForScreen.map((k) => (
                        <button
                          key={k}
                          onClick={() => { setViewAll(false); setPreviewSlot(k) }}
                          className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-[10px] font-semibold text-amber-300 hover:bg-white/10"
                        >
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvertisePage
