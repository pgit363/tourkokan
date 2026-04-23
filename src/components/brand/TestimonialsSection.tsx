'use client'

import { useLang } from '@/context/LanguageContext'

const testimonialMeta = [
  { name: 'Priya Desai', location: 'Pune', rating: 5, avatar: 'P', color: 'bg-orange-500', key: 'testimonial1' as const },
  { name: 'Rahul Naik', location: 'Mumbai', rating: 5, avatar: 'R', color: 'bg-blue-500', key: 'testimonial2' as const },
  { name: 'Sneha Joshi', location: 'Nashik', rating: 5, avatar: 'S', color: 'bg-teal-500', key: 'testimonial3' as const },
  { name: 'Amit Patil', location: 'Kolhapur', rating: 4, avatar: 'A', color: 'bg-green-600', key: 'testimonial4' as const },
  { name: 'Kavita Rane', location: 'Thane', rating: 5, avatar: 'K', color: 'bg-purple-500', key: 'testimonial5' as const },
  { name: 'Vikram Sawant', location: 'Goa', rating: 5, avatar: 'V', color: 'bg-red-500', key: 'testimonial6' as const },
]

type TestimonialKey = 'testimonial1' | 'testimonial2' | 'testimonial3' | 'testimonial4' | 'testimonial5' | 'testimonial6'

const TestimonialsSection = () => {
  const { t } = useLang()

  return (
    <section className="bg-neutral-50 py-20 lg:py-28 dark:bg-neutral-800/50">
      <div className="container">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            {t.home.testimonialsSectionTag}
          </span>
          <h2 className="mt-4 text-4xl font-bold text-neutral-900 dark:text-white">
            {t.home.testimonialsSectionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500 dark:text-neutral-400">
            {t.home.testimonialsSectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialMeta.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                &ldquo;{t.home[item.key as TestimonialKey]}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.color} text-sm font-bold text-white`}>
                  {item.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">{item.name}</div>
                  <div className="text-xs text-neutral-500">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
