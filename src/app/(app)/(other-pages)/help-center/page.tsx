'use client'

import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is TourKokan?',
        a: 'TourKokan is your guide to exploring the Konkan coast of Maharashtra. We list beaches, forts, waterfalls, temples, and local events to help travellers discover hidden gems along the coast.',
      },
      {
        q: 'Do I need an account to browse destinations?',
        a: 'You can browse the home page freely. To explore destinations, events, gallery, and bus routes in detail, you need a quick guest account — it takes just one tap and no password is required.',
      },
      {
        q: 'Is TourKokan free to use?',
        a: 'Yes, TourKokan is completely free for travellers. You can explore all destinations, events, and routes without any charges.',
      },
    ],
  },
  {
    category: 'Guest Account',
    items: [
      {
        q: 'What is a guest account?',
        a: 'A guest account is a temporary session we create for you automatically. It lets you access all features — saving places, viewing details, and more — without signing up with an email.',
      },
      {
        q: 'How long does a guest session last?',
        a: 'Guest sessions are valid for 24 hours from the time you sign in. After that you can simply create a new guest session.',
      },
      {
        q: 'Can I upgrade from a guest account to a full account?',
        a: 'Full account registration with email is available on the TourKokan mobile app. Download it from Google Play to get a permanent account with more features.',
      },
    ],
  },
  {
    category: 'Destinations & Places',
    items: [
      {
        q: 'How do I find a specific beach or fort?',
        a: 'Go to Destinations and use the search bar to type the name. You can also filter by category (Beach, Fort, Waterfall, Temple, etc.) to narrow down results.',
      },
      {
        q: 'How do I save a place for later?',
        a: 'Tap the heart icon on any destination card to save it. You can view all saved places in your account under "Saved Places".',
      },
      {
        q: 'Can I add a place that is not listed?',
        a: 'Yes! Use our "Add a Place" form to suggest a new destination. Our team reviews all submissions before publishing them.',
      },
    ],
  },
  {
    category: 'Bus Routes',
    items: [
      {
        q: 'How do I find a bus route between two places?',
        a: 'Go to Bus Routes, select your departure point in the "From" field and your destination in the "To" field, then tap Search.',
      },
      {
        q: 'Are the bus timings accurate?',
        a: 'We try to keep timings updated but schedules can change. We recommend confirming at the local ST bus stand for the most current information.',
      },
    ],
  },
  {
    category: 'Events',
    items: [
      {
        q: 'How do I find upcoming festivals in Kokan?',
        a: 'Open the Events page and use the search or filters. You can filter by "Featured" to see the biggest upcoming events, or search by festival name or location.',
      },
      {
        q: 'How can I submit an event?',
        a: 'Event submissions are currently handled through the TourKokan mobile app or by contacting us directly via the Contact page.',
      },
    ],
  },
  {
    category: 'Advertising',
    items: [
      {
        q: 'How can I advertise my business on TourKokan?',
        a: 'Visit our Advertise page to see available packages and pricing. Fill out the enquiry form and our team will get back to you within 24 hours.',
      },
      {
        q: 'What types of businesses can advertise?',
        a: 'Hotels, homestays, restaurants, boat tours, water sports operators, local experiences, and any business serving Konkan travellers can advertise on TourKokan.',
      },
    ],
  },
]

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neutral-100 last:border-0 dark:border-neutral-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="pr-4 text-sm font-medium text-neutral-900 dark:text-white">{q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{a}</p>
      )}
    </div>
  )
}

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('Getting Started')

  const current = faqs.find((f) => f.category === activeCategory)

  return (
    <div className="container py-16 lg:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Help Center</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Find answers to common questions about TourKokan.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {faqs.map((section) => (
            <button
              key={section.category}
              onClick={() => setActiveCategory(section.category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === section.category
                  ? 'bg-primary-600 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {section.category}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        {current && (
          <div className="rounded-2xl border border-neutral-100 bg-white px-6 dark:border-neutral-700 dark:bg-neutral-800">
            {current.items.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-10 rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
          <h2 className="font-semibold text-neutral-900 dark:text-white">Still need help?</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Our team responds within 24 hours.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
