import { PlayStoreBadge } from '@/components/brand/AppBadges'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Metadata } from 'next'

/**
 * List-your-business + plans page.
 *
 * Content mirrors the backend launch plans (PlanSeeder) and the vendor onboarding flow:
 * Free is live for the launch year; Starter/Growth are seeded but inactive, with pricing
 * that will be finalised on the lead data the platform is collecting. Vendors onboard from
 * the mobile app, so every CTA points there.
 */

type Plan = {
  name: string
  price: string
  per?: string
  badge: string
  highlighted?: boolean
  tagline: string
  features: string[]
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '₹0',
    badge: 'Live now',
    tagline: 'Everything a local business needs to get discovered — free for the launch year.',
    features: [
      'List up to 5 businesses',
      'Up to 100 products or services',
      '10 photos per listing',
      'Direct enquiries — calls, WhatsApp & directions',
      'Listing insights (views & leads)',
    ],
  },
  {
    name: 'Starter',
    price: '₹499',
    per: '/mo',
    badge: 'Coming soon',
    highlighted: true,
    tagline: 'For a growing business running several outlets.',
    features: [
      'Everything in Free',
      'List up to 15 businesses',
      'Up to 500 products',
      '15 photos per listing',
      '2 featured placement slots',
    ],
  },
  {
    name: 'Growth',
    price: '₹1,499',
    per: '/mo',
    badge: 'Coming soon',
    tagline: 'Unlimited listings and priority placement across Kokan.',
    features: [
      'Everything in Starter',
      'Unlimited businesses',
      'Unlimited products',
      '25 photos per listing',
      '10 featured placement slots',
      'Priority placement in search',
    ],
  },
]

const steps = [
  {
    title: 'Get the app & request access',
    body: 'Download TourKokan, sign in, and ask to become a vendor — one tap from your profile.',
  },
  {
    title: 'Add your business',
    body: 'Tell us about your place. Our team reviews and approves it, usually within a day.',
  },
  {
    title: 'List your products & services',
    body: 'Rooms, thalis, tour packages, taxi trips, repairs — add them with photos and prices.',
  },
  {
    title: 'Receive direct leads',
    body: 'Travellers call, WhatsApp or navigate straight to you. No commission, no middleman.',
  },
]

const categories = [
  'Hotels & homestays',
  'Restaurants & khanavals',
  'Tour operators',
  'Taxi & travel',
  'Grocery & general stores',
  'Carpenters & electricians',
  'Handicraft shops',
  'Farm & Alphonso produce',
]

export const metadata: Metadata = {
  title: 'List your business on TourKokan',
  description:
    'Put your Kokan business in front of travellers. List your place, add your products and services, and get direct leads — free for the launch year.',
}

const Page = () => {
  const renderPlan = (plan: Plan, index: number) => (
    <div
      key={index}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border-2 px-6 py-8 ${
        plan.highlighted ? 'border-primary-500' : 'border-neutral-100 dark:border-neutral-700'
      }`}
    >
      <span
        className={`absolute end-3 top-3 z-10 rounded-full px-3 py-1 text-xs tracking-widest ${
          plan.badge === 'Live now'
            ? 'bg-green-500 text-white'
            : plan.highlighted
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200'
        }`}
      >
        {plan.badge.toUpperCase()}
      </span>

      <div className="mb-6">
        <h3 className="mb-2 block text-sm font-medium tracking-widest text-neutral-600 uppercase dark:text-neutral-300">
          {plan.name}
        </h3>
        <h2 className="flex items-end text-5xl leading-none text-neutral-900 dark:text-neutral-100">
          <span>{plan.price}</span>
          {plan.per && <span className="ms-1 text-lg font-normal text-neutral-500">{plan.per}</span>}
        </h2>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{plan.tagline}</p>
      </div>

      <nav className="mb-8 space-y-4">
        {plan.features.map((item, i) => (
          <li className="flex items-center" key={i}>
            <span className="me-4 inline-flex shrink-0 text-primary-600">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
          </li>
        ))}
      </nav>

      <div className="mt-auto">
        {plan.badge === 'Live now' ? (
          <PlayStoreBadge width={180} />
        ) : (
          <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
            Available soon
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="container pb-24 lg:pb-32">
      {/* Hero */}
      <header className="mx-auto my-16 max-w-3xl text-center lg:my-20">
        <span className="text-sm font-medium tracking-widest text-primary-600 uppercase dark:text-primary-400">
          For businesses
        </span>
        <h1 className="mt-3 text-4xl/[1.15] font-semibold sm:text-5xl/[1.15]">
          List your business on TourKokan
        </h1>
        <p className="mt-4 text-base text-neutral-600 sm:text-lg dark:text-neutral-300">
          Put your Kokan business in front of travellers planning their trip. List your place, add
          your products and services, and get enquiries directly — no commission.
        </p>
        <div className="mt-8 flex justify-center">
          <PlayStoreBadge width={190} />
        </div>
      </header>

      {/* How it works */}
      <section className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto mt-20 max-w-4xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Every kind of Kokan business</h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          From beachfront resorts to the electrician down the lane — if travellers need it, list it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="flex items-center justify-center text-3xl font-semibold sm:text-4xl">
            <span className="me-3 text-3xl leading-none">💎</span>
            Plans
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            Start free — pick a bigger plan only when you outgrow it.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 xl:gap-8">{plans.map(renderPlan)}</div>

        <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-neutral-50 px-6 py-5 text-center text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Every vendor is on the <strong>Free</strong> plan for the launch year — no card, no
          commitment. Starter and Growth arrive later, and final pricing will be based on the leads
          your listings actually generate, not on views. You only ever pay once the paid tiers go
          live.
        </p>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto mt-20 max-w-3xl rounded-3xl bg-primary-600 px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to get discovered?</h2>
        <p className="mt-3 text-primary-50">
          Download TourKokan and request vendor access to start listing today.
        </p>
        <div className="mt-8 flex justify-center">
          <PlayStoreBadge width={190} />
        </div>
      </section>
    </div>
  )
}

export default Page
