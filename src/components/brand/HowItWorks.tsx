const steps = [
  {
    step: '01',
    title: 'Download Tourkokan',
    description: 'Available on Google Play. iOS coming soon. Install the app and create your free account in seconds.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Explore Destinations',
    description: "Browse 100+ curated Tourkokan destinations — beaches, forts, temples, waterfalls, and nature trails.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Plan Your Trip',
    description: 'Check bus routes, book accommodation, find local food, and discover upcoming events — all in one app.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Experience Tourkokan',
    description: 'Go on your adventure and share your experiences. Rate places, write reviews, help the community.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
]

const HowItWorks = () => {
  return (
    <section className="bg-neutral-50 py-20 lg:py-28 dark:bg-neutral-800/50">
      <div className="container">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            Simple & Intuitive
          </span>
          <h2 className="mt-4 text-4xl font-bold text-neutral-900 dark:text-white">How it works</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500 dark:text-neutral-400">
            Get started in minutes and discover the beauty of Tourkokan like a local.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-14 left-1/2 hidden h-0.5 w-3/4 -translate-x-1/2 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 lg:block" />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary-100 bg-white shadow-lg dark:border-primary-900/50 dark:bg-neutral-800">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md">
                    {step.icon}
                  </div>
                </div>
                <div className="mt-2 text-xs font-bold tracking-widest text-primary-500">{step.step}</div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
