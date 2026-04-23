const destinations = [
  {
    name: 'Sindhudurg Fort',
    location: 'Malvan',
    type: 'Historical Fort',
    rating: '4.9',
    gradient: 'from-blue-600 to-blue-900',
    emoji: '🏰',
  },
  {
    name: 'Ganpatipule Beach',
    location: 'Ratnagiri',
    type: 'Beach Temple',
    rating: '4.8',
    gradient: 'from-cyan-500 to-blue-700',
    emoji: '🏖️',
  },
  {
    name: 'Sawantwadi Palace',
    location: 'Sawantwadi',
    type: 'Heritage',
    rating: '4.7',
    gradient: 'from-amber-600 to-orange-800',
    emoji: '🏛️',
  },
  {
    name: 'Tarkarli Beach',
    location: 'Malvan',
    type: 'Beach & Diving',
    rating: '4.9',
    gradient: 'from-teal-500 to-cyan-700',
    emoji: '🤿',
  },
  {
    name: 'Ratnagiri Lighthouse',
    location: 'Ratnagiri',
    type: 'Landmark',
    rating: '4.6',
    gradient: 'from-orange-500 to-red-700',
    emoji: '🗼',
  },
  {
    name: 'Amboli Ghat',
    location: 'Sawantwadi',
    type: 'Nature & Trek',
    rating: '4.8',
    gradient: 'from-green-600 to-emerald-800',
    emoji: '🌿',
  },
]

const DestinationsSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              Top picks
            </span>
            <h2 className="mt-4 text-4xl font-bold text-neutral-900 dark:text-white">
              Iconic Tourkokan destinations
            </h2>
            <p className="mt-3 max-w-lg text-neutral-500 dark:text-neutral-400">
              From ancient forts to pristine beaches — explore the best of what Tourkokan has to offer.
            </p>
          </div>
          <a
            href="#download"
            className="shrink-0 rounded-xl border border-primary-500 px-5 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Gradient background */}
              <div className={`bg-gradient-to-br ${dest.gradient} h-48 w-full`} />

              {/* Emoji decoration */}
              <div className="absolute right-5 top-5 text-5xl opacity-30 transition-all group-hover:scale-110 group-hover:opacity-50">
                {dest.emoji}
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-white/70">{dest.type}</div>
                    <h3 className="mt-1 text-xl font-bold text-white">{dest.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {dest.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 backdrop-blur-sm">
                    <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-white">{dest.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DestinationsSection
