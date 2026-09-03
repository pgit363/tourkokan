import { PlayStoreBadge } from '@/components/brand/AppBadges'
import { isValidReferralCode, playStoreUrl } from '@/lib/deeplinks'
import { Metadata } from 'next'
import Link from 'next/link'

/**
 * Referral landing page.
 *
 * Only people who do NOT have the app ever see this. Once the app is installed
 * and /.well-known/assetlinks.json has verified, Android intercepts
 * tourkokan.com/invite/* before a browser is involved and opens the app, which
 * reads the code straight out of the URL — nothing is processed here.
 *
 * The route is a wildcard because the code changes on every share.
 */

// The code is only echoed back to the visitor and appended to the store URL,
// so anything outside the expected shape is dropped rather than 404'd — a
// referral link should never be a dead end.
const readCode = (raw: string): string | null => {
  const code = decodeURIComponent(raw).trim()
  return isValidReferralCode(code) ? code : null
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const code = readCode((await params).code)
  const title = 'You have been invited to Tourkokan'
  const description = code
    ? `Join Tourkokan with invite code ${code} and explore the beaches, forts, and hidden gems of the Konkan coast.`
    : 'Join Tourkokan and explore the beaches, forts, and hidden gems of the Konkan coast.'

  return {
    title: `${title} — Tourkokan`,
    description,
    openGraph: { title, description, type: 'website' },
  }
}

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const code = readCode((await params).code)
  const storeUrl = playStoreUrl(code ?? undefined)

  const features = ['📍 Add places', '⭐ Rate & review', '💬 Comment', '🚌 Bus routes', '🎉 Events', '❤️ Favourites']

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-8 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">

        {/* Icon + heading */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-600 shadow-md">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">You&rsquo;ve been invited to Tourkokan</h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Discover beaches, forts, waterfalls, and hidden gems along the Konkan coast.
            </p>
          </div>
        </div>

        {/* Invite code */}
        {code && (
          <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-center dark:border-primary-900/50 dark:bg-primary-900/20">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Your invite code</p>
            <p className="mt-1 font-mono text-lg font-bold tracking-widest break-all text-primary-700 dark:text-primary-300">
              {code}
            </p>
          </div>
        )}

        {/* Features — compact inline pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {features.map((f) => (
            <span key={f} className="rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-300">
              {f}
            </span>
          ))}
        </div>

        {/* Primary CTA */}
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
        >
          Continue to Play Store
        </a>

        {/* Badge + iOS note */}
        <div className="mt-5 flex items-center gap-4">
          <PlayStoreBadge width={140} href={storeUrl} />
          <p className="text-xs text-neutral-400">iOS — Coming Soon</p>
        </div>

        {/* Fallback for people who already have the app but landed here anyway */}
        {code && (
          <p className="mt-5 text-xs text-neutral-400">
            Already have the app? Enter <span className="font-mono font-semibold text-neutral-500 dark:text-neutral-300">{code}</span> in the referral field when you sign up.
          </p>
        )}

        {/* Back link */}
        <Link href="/" className="mt-5 inline-block text-xs text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
