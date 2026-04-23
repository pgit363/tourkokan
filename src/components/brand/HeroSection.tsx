'use client'

import { AppStoreBadgeSoon, PlayStoreBadge } from '@/components/brand/AppBadges'
import { useLang } from '@/context/LanguageContext'
import Image from 'next/image'

const HeroSection = () => {
  const { t } = useLang()

  const stats = [
    { value: '100+', label: t.home.statDestinations },
    { value: '50+', label: t.home.statBusRoutes },
    { value: '200+', label: t.home.statExperiences },
    { value: '10K+', label: t.home.statDownloads },
  ]

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
            {t.home.nowAvailable}
          </div>

          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            {t.home.heroTitle1}
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              {t.home.heroTitle2}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-neutral-400 sm:text-xl">
            {t.home.heroSubtitle}
          </p>

          {/* Download Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <PlayStoreBadge width={160} />
            <AppStoreBadgeSoon width={160} />
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start">
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-neutral-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — App Mockup */}
        <div className="relative mt-16 flex flex-1 items-center justify-center lg:mt-0">
          <div className="relative">
            <div className="absolute inset-0 scale-95 rounded-[3rem] bg-primary-500 opacity-30 blur-2xl" />

            <div className="relative z-10 w-[285px] overflow-hidden rounded-[3rem] border-4 border-neutral-700 bg-black shadow-2xl sm:w-[300px]" style={{ aspectRatio: '1080/2340' }}>
              <Image
                src="/app-screenshot.png"
                alt="Tourkokan App"
                fill
                className="object-fill"
                sizes="300px"
                priority
              />
            </div>

            {/* Floating badge — destinations */}
            <div className="absolute right-0 top-32 z-20 flex translate-x-1/2 items-center gap-2 rounded-2xl bg-green-500 px-3 py-2 shadow-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{t.home.badgeDestinationsCount}</div>
                <div className="text-xs text-green-100">{t.home.badgeAcrossKokan}</div>
              </div>
            </div>

            {/* Floating badge — rating */}
            <div className="absolute left-0 bottom-24 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-primary-600 px-3 py-2 shadow-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{t.home.badgeRating}</div>
                <div className="text-xs text-primary-100">{t.home.badgePlayStore}</div>
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
