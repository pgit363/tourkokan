'use client'

import { AppStoreBadgeSoon, PlayStoreBadge } from '@/components/brand/AppBadges'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #EA580C 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary-500 opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-secondary-500 opacity-20 blur-3xl" />

      <div className="container relative flex min-h-screen flex-col items-center justify-center px-4 py-24 lg:flex-row lg:gap-16 lg:py-0">
        {/* Left — Text Content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
            Now Available on Google Play
          </div>

          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            Discover the
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Magic of Konkan
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-neutral-400 sm:text-xl">
            Your ultimate travel companion for exploring the pristine beaches, ancient forts, lush forests, and vibrant
            culture of Maharashtra&apos;s Konkan coast.
          </p>

          {/* Download Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <PlayStoreBadge width={160} />
            <AppStoreBadgeSoon width={160} />
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start">
            {[
              { value: '100+', label: 'Destinations' },
              { value: '50+', label: 'Bus Routes' },
              { value: '200+', label: 'Experiences' },
              { value: '10K+', label: 'Downloads' },
            ].map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-neutral-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — App Mockup */}
        <div className="relative mt-16 flex flex-1 items-center justify-center lg:mt-0">
          {/* Phone frame */}
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 scale-95 rounded-[3rem] bg-primary-500 opacity-30 blur-2xl" />

            {/* Phone shell */}
            <div className="relative z-10 h-[600px] w-[300px] overflow-hidden rounded-[3rem] border-4 border-neutral-700 bg-neutral-800 shadow-2xl">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <span className="text-xs font-medium text-white">9:41</span>
                <div className="flex gap-1">
                  <div className="h-2.5 w-1 rounded-full bg-white" />
                  <div className="h-2.5 w-1 rounded-full bg-white" />
                  <div className="h-2.5 w-1 rounded-full bg-white opacity-60" />
                </div>
              </div>

              {/* App header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20" />
                  <div>
                    <div className="text-xs text-primary-100">Good morning!</div>
                    <div className="text-sm font-semibold text-white">Where to today?</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-white/80">Search destinations...</span>
                </div>
              </div>

              {/* Content cards */}
              <div className="space-y-3 p-4">
                {/* Featured card */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-700 to-secondary-900">
                  <div className="p-4">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">Featured</span>
                    <div className="mt-2 text-base font-bold text-white">Sindhudurg Fort</div>
                    <div className="text-xs text-secondary-200">Malvan, Sindhudurg</div>
                    <div className="mt-2 flex items-center gap-1">
                      <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-white">4.8 · Historical Fort</span>
                    </div>
                  </div>
                </div>

                {/* Mini cards row */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Ganpatipule', type: 'Beach', color: 'from-blue-600 to-blue-800' },
                    { name: 'Ratnagiri', type: 'City', color: 'from-orange-600 to-orange-800' },
                  ].map((place) => (
                    <div key={place.name} className={`rounded-xl bg-gradient-to-br ${place.color} p-3`}>
                      <div className="text-xs font-semibold text-white">{place.name}</div>
                      <div className="text-xs text-white/70">{place.type}</div>
                    </div>
                  ))}
                </div>

                {/* Route card */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-700 p-3">
                  <div className="text-xs font-semibold text-white">🚌 Next Bus</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-xs text-neutral-300">Mumbai → Ratnagiri</div>
                    <div className="rounded bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">8:30 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-8 top-16 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl dark:bg-neutral-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-white">Live Tracking</div>
                <div className="text-xs text-neutral-500">Real-time routes</div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-24 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl dark:bg-neutral-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-white">4.8 Rating</div>
                <div className="text-xs text-neutral-500">Play Store</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" className="fill-white dark:fill-neutral-900" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
