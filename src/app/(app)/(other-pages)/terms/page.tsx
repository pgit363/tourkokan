import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using Tourkokan — your Tourkokan travel guide app.',
}

const sections = [
  {
    id: '01',
    title: 'Acceptance of Terms',
    content: `By downloading, installing, or using the Tourkokan application or visiting Tourkokan.com, you agree to be bound by these Terms. If you do not agree, please do not use our services.`,
  },
  {
    id: '02',
    title: 'Description of Service',
    content: `Tourkokan provides a travel-guide platform for the Tourkokan coast of Maharashtra, India. Features include destination guides, live bus routes, local food recommendations, accommodation listings, and user-submitted reviews. The App is available on Android; iOS is coming soon.`,
  },
  {
    id: '03',
    title: 'User Accounts',
    content: `You may use parts of the App as a guest. Creating an account requires a valid name and either an email address or mobile number. You are responsible for maintaining the confidentiality of your credentials. Notify us immediately at support@Tourkokan.com if you suspect unauthorised access.`,
  },
  {
    id: '04',
    title: 'User-Generated Content',
    content: `By submitting reviews, photos, or other content, you grant Tourkokan a non-exclusive, royalty-free, worldwide licence to use, reproduce, and display that content in connection with our services. You represent that you have the rights to submit such content and that it does not violate any third-party rights or applicable law.`,
  },
  {
    id: '05',
    title: 'Prohibited Conduct',
    content: `You agree not to: post false, misleading, or harmful content; impersonate any person or entity; use the App for commercial solicitation without written consent; attempt to reverse-engineer or scrape our services; or upload malware or engage in activity that disrupts the App.`,
  },
  {
    id: '06',
    title: 'Intellectual Property',
    content: `All content, branding, and technology within the App and Website are owned by or licensed to Tourkokan. The Tourkokan name, logo, and trade dress are trademarks of Tourkokan. Nothing herein grants you any right to use our intellectual property without prior written permission.`,
  },
  {
    id: '07',
    title: 'Disclaimers',
    content: `The App is provided "as is" without warranties of any kind. Travel information, bus schedules, and listings are sourced from third parties and may not always be accurate. Always verify critical information before travel. Tourkokan is not liable for any loss, injury, or inconvenience arising from reliance on App information.`,
  },
  {
    id: '08',
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, Tourkokan shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount you paid (if any) for the App in the three months preceding the claim.`,
  },
  {
    id: '09',
    title: 'Account Deletion',
    content: `You may delete your account at any time from the app settings or by visiting Tourkokan.com/delete-account. Deletion permanently removes all personal data associated with your account within 30 days, except where we are required to retain it by law.`,
  },
  {
    id: '10',
    title: 'Changes to Terms',
    content: `We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the revised Terms. We will notify you of significant changes via an in-app notification or email.`,
  },
  {
    id: '11',
    title: 'Governing Law',
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Maharashtra, India.`,
  },
]

const TermsPage = () => {
  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">
            Last updated: April 2025 &nbsp;·&nbsp; Effective for all Tourkokan users
          </p>
        </div>

        {/* Intro card */}
        <div className="mb-10 rounded-2xl border border-primary-100 bg-primary-50 p-6 dark:border-primary-900/40 dark:bg-primary-900/20">
          <p className="text-sm leading-relaxed text-primary-800 dark:text-primary-300">
            These Terms &amp; Conditions govern your use of the Tourkokan app and website. By using our services
            you agree to these terms. Questions? Email us at{' '}
            <a href="mailto:support@Tourkokan.com" className="font-semibold underline">
              support@Tourkokan.com
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
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {section.id}
                </span>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:text-left">
          <div className="flex-1 text-sm text-neutral-600 dark:text-neutral-400">
            Also read our{' '}
            <Link href="/privacy" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Privacy Policy
            </Link>{' '}
            — it explains how we collect and protect your data.
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

export default TermsPage
