import { AppStoreBadgeSoon, PlayStoreBadge } from '@/components/brand/AppBadges'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'TourKokan — your ultimate guide to exploring the breathtaking beauty and cultural richness of the Konkan region. Discover beaches, forts, culture, and hidden gems.',
}

const features = [
  {
    icon: '🏖️',
    title: 'Discover Konkan',
    desc: 'Explore popular destinations like Devgad Beach, Malvan, Ratnagiri, and many hidden gems along the Konkan coast.',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-900/40',
  },
  {
    icon: '🗺️',
    title: 'Real-Time Updates',
    desc: 'Get real-time updates, user reviews, and interactive maps for the best possible travel experience.',
    color: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-100 dark:border-teal-900/40',
  },
  {
    icon: '🚌',
    title: 'Bus Timetables',
    desc: 'Access the latest bus timetables and local event listings to plan your trip seamlessly.',
    color: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-100 dark:border-amber-900/40',
  },
  {
    icon: '🤝',
    title: 'Community',
    desc: 'Join a community of explorers and share your Konkan travel stories with fellow adventurers.',
    color: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-100 dark:border-purple-900/40',
  },
]

const stats = [
  { value: '720 km', label: 'Konkan Coastline', source: 'Maharashtra Tourism' },
  { value: '5M+', label: 'Annual Visitors', source: 'Maharashtra Tourism' },
  { value: '200+', label: 'Pristine Beaches', source: 'MTDC' },
  { value: '30+', label: "Shivaji-era Forts", source: 'ASI India' },
  { value: '₹12K Cr', label: 'Tourism Revenue', source: 'MTDC 2023' },
  { value: '52 weeks', label: 'Year-round Travel', source: '' },
]

const PageAbout = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-primary-50/60 to-white py-24 lg:py-32 dark:from-neutral-800/60 dark:to-neutral-900">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-semibold text-primary-600 shadow-sm dark:border-primary-700 dark:bg-neutral-800 dark:text-primary-400">
            About TourKokan
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
            Your Gateway to the <span className="text-primary-600">Konkan Coast</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
            Welcome to TourKokan — your ultimate guide to exploring the breathtaking beauty and cultural richness
            of the Konkan region. We give you everything you need to make every journey through Konkan unforgettable.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PlayStoreBadge width={160} />
            <AppStoreBadgeSoon width={160} />
          </div>
        </div>
      </section>

      {/* ── What we offer ────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Everything you need to explore Konkan</h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
              Four pillars that make TourKokan the most complete Konkan travel companion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className={`flex gap-5 rounded-3xl border ${f.border} ${f.color} p-8`}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-neutral-800">
                  {f.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-500 dark:text-neutral-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose / Commitment ───────────────────────── */}
      <section className="bg-neutral-50 py-20 lg:py-28 dark:bg-neutral-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

            <div>
              <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
                Why TourKokan
              </span>
              <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white">
                The most complete Konkan travel guide
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-500 dark:text-neutral-400">
                TourKokan stands out for its comprehensive approach to travel guidance. Our app not only provides
                detailed information about tourist spots but also offers real-time updates, user reviews, and
                interactive maps. Whether you are looking for adventure, relaxation, or cultural immersion,
                TourKokan ensures you have the best resources at your fingertips.
              </p>
              <ul className="mt-6 space-y-3">
                {['Curated destination guides for every budget', 'Offline maps and bus timetables', 'Community reviews from real travellers', 'Regular updates with new places'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/40">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between gap-8">
              <div className="rounded-3xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
                <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-400">
                  Our Commitment
                </span>
                <h3 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Always up to date</h3>
                <p className="mt-3 leading-relaxed text-neutral-500 dark:text-neutral-400">
                  We continuously expand our database with new destinations, updated bus timetables, and the
                  latest events in Konkan. Your satisfaction and enjoyment are our top priorities.
                </p>
              </div>

              <div className="rounded-3xl bg-primary-600 p-8 text-white">
                <div className="text-4xl">🌊</div>
                <h3 className="mt-4 text-xl font-bold">Ready to explore?</h3>
                <p className="mt-2 text-sm text-primary-100">
                  Download TourKokan for free on Google Play and start your Konkan adventure today.
                </p>
                <div className="mt-5">
                  <PlayStoreBadge width={150} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Konkan by the Numbers ─────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">🌊 Konkan by the Numbers</h2>
            <p className="mx-auto mt-3 max-w-lg text-neutral-500 dark:text-neutral-400">
              Real data behind Konkan&apos;s growing tourism story.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-700 lg:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center bg-white px-6 py-10 text-center dark:bg-neutral-900"
              >
                <span className="text-3xl font-bold text-primary-600 sm:text-4xl dark:text-primary-400">
                  {s.value}
                </span>
                <span className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">{s.label}</span>
                {s.source && (
                  <span className="mt-1 text-xs text-neutral-400">Source: {s.source}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default PageAbout
