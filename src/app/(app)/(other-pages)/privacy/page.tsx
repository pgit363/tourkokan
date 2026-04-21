import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how TourKokan collects, uses, and protects your personal information.',
}

const sections = [
  {
    id: '01',
    title: 'What We Collect',
    icon: '📋',
    items: [
      'Account Information — name, email address, mobile number',
      'Profile Data — optional photo, travel preferences, saved destinations',
      'Location Data — GPS (with your permission) to show nearby attractions',
      'Device Information — device type, OS version, IP address',
      'Usage Data — pages viewed, features used, search queries',
      'User Content — reviews, photos, comments you submit',
      'Support Communications — messages you send to our team',
    ],
  },
  {
    id: '02',
    title: 'How We Use Your Data',
    icon: '🔧',
    items: [
      'Provide, operate, and improve the App and its features',
      'Personalise your experience and recommend relevant destinations',
      'Send service-related notifications and respond to queries',
      'Detect and prevent fraud, abuse, and security incidents',
      'Analyse anonymised usage trends to improve our services',
      'Comply with legal obligations',
    ],
  },
  {
    id: '03',
    title: 'Data Security',
    icon: '🔒',
    content: `We implement industry-standard security measures including AES-256 encryption at rest, TLS/HTTPS transmission, and strict access controls. Despite these measures, no electronic system is 100% secure. We encourage you to use a strong password and notify us immediately if you suspect unauthorised access to your account at support@tourkokan.com.`,
  },
  {
    id: '04',
    title: 'Sharing Your Information',
    icon: '🤝',
    content: `We do not sell your personal information. We may share data with: (a) Service Providers — cloud hosting, analytics, and payment processors who are contractually bound to handle data securely; (b) Legal Requirements — if required by law, court order, or to protect safety; (c) Business Transfers — if involved in a merger or acquisition.`,
  },
  {
    id: '05',
    title: 'Your Rights',
    icon: '⚖️',
    items: [
      'Access the personal information we hold about you',
      'Correct inaccurate or incomplete information',
      'Request deletion of your account and data (visit /delete-account)',
      'Withdraw location or marketing consent at any time via device settings',
      'Lodge a complaint with a data protection authority',
    ],
  },
  {
    id: '06',
    title: 'Data Retention',
    icon: '🗃️',
    content: `We retain your data for as long as your account is active. If you delete your account, we will delete or anonymise your personal data within 30 days, except where required to retain it for legal or regulatory purposes.`,
  },
  {
    id: '07',
    title: 'Location Data',
    icon: '📍',
    content: `Location access is optional and requested only to show nearby attractions and bus routes. You can revoke location permission at any time in your device settings. Denying location access reduces functionality but you can still use the App.`,
  },
  {
    id: '08',
    title: 'Children\'s Privacy',
    icon: '👶',
    content: `TourKokan is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, contact us and we will delete it promptly.`,
  },
  {
    id: '09',
    title: 'Cookies & Analytics',
    icon: '🍪',
    content: `Our website uses cookies for authentication and anonymised analytics. You may disable cookies through browser settings, though this may affect Website functionality. We use anonymised data only to understand how users interact with our services.`,
  },
  {
    id: '10',
    title: 'Changes to This Policy',
    icon: '📝',
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes by updating the "Last Updated" date and via in-app notification. Continued use of the App after changes constitutes acceptance.`,
  },
]

const PrivacyPage = () => {
  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-white">Privacy Policy</h1>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">
            Last updated: April 2025 &nbsp;·&nbsp; Applies to the TourKokan app and website
          </p>
        </div>

        {/* Intro card */}
        <div className="mb-10 rounded-2xl border border-primary-100 bg-primary-50 p-6 dark:border-primary-900/40 dark:bg-primary-900/20">
          <p className="text-sm leading-relaxed text-primary-800 dark:text-primary-300">
            TourKokan is committed to protecting your privacy. This policy explains exactly what data we collect,
            why we collect it, and how you can control it. We do not sell your personal information — ever.
            Questions? Email{' '}
            <a href="mailto:support@tourkokan.com" className="font-semibold underline">
              support@tourkokan.com
            </a>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-neutral-100 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{section.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">{section.id}</span>
                    <h2 className="font-semibold text-neutral-900 dark:text-white">{section.title}</h2>
                  </div>
                  {'items' in section && section.items ? (
                    <ul className="mt-3 space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {'content' in section ? section.content : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete account CTA */}
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300">Want to delete your account?</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                You can permanently delete your account and all associated data at any time.
              </p>
            </div>
            <Link
              href="/delete-account"
              className="shrink-0 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:bg-transparent dark:text-red-400"
            >
              Delete Account
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:text-left">
          <div className="flex-1 text-sm text-neutral-600 dark:text-neutral-400">
            Also read our{' '}
            <Link href="/terms" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Terms &amp; Conditions
            </Link>{' '}
            for full usage rules.
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
