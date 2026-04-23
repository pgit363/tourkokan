'use client'

import { useLang } from '@/context/LanguageContext'

const featureIcons = [
  <svg key="1" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="2" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>,
  <svg key="3" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>,
  <svg key="4" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6l3 3m0 0l3-3m-3 3V3m0 18v-9" />
  </svg>,
  <svg key="5" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  <svg key="6" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
]

const featureColors = [
  'bg-orange-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
]

type FeatureTitleKey = 'feature1Title' | 'feature2Title' | 'feature3Title' | 'feature4Title' | 'feature5Title' | 'feature6Title'
type FeatureDescKey = 'feature1Desc' | 'feature2Desc' | 'feature3Desc' | 'feature4Desc' | 'feature5Desc' | 'feature6Desc'

const featureKeys: Array<{ titleKey: FeatureTitleKey; descKey: FeatureDescKey }> = [
  { titleKey: 'feature1Title', descKey: 'feature1Desc' },
  { titleKey: 'feature2Title', descKey: 'feature2Desc' },
  { titleKey: 'feature3Title', descKey: 'feature3Desc' },
  { titleKey: 'feature4Title', descKey: 'feature4Desc' },
  { titleKey: 'feature5Title', descKey: 'feature5Desc' },
  { titleKey: 'feature6Title', descKey: 'feature6Desc' },
]

const FeaturesSection = () => {
  const { t } = useLang()

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            {t.home.featuresSectionTag}
          </span>
          <h2 className="mt-4 text-4xl font-bold text-neutral-900 dark:text-white">
            {t.home.featuresSectionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400">
            {t.home.featuresSectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((f, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${featureColors[index]}`}>
                {featureIcons[index]}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900 dark:text-white">{t.home[f.titleKey]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{t.home[f.descKey]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
