'use client'

import Logo from '@/shared/Logo'
import GuestAuthModal from '@/components/brand/GuestAuthModal'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const protectedHrefs = new Set(['/destinations', '/events', '/bus-routes', '/gallery'])

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/Tourkokan',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/Tourkokan',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

const BrandFooter = () => {
  const { isLoggedIn } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const footerLinks = {
    [t.footer.explore]: [
      { label: t.footer.destinations, href: '/destinations' },
      { label: t.footer.events, href: '/events' },
      { label: t.footer.busRoutes, href: '/bus-routes' },
      { label: t.footer.gallery, href: '/gallery' },
    ],
    [t.footer.company]: [
      { label: t.footer.about, href: '/about' },
      { label: t.footer.addPlace, href: '/add-place' },
      { label: t.footer.advertise, href: '/advertise' },
      { label: t.footer.contact, href: '/contact' },
    ],
    [t.footer.support]: [
      { label: t.footer.helpCenter, href: '/help-center' },
      { label: t.footer.privacy, href: '/privacy' },
      { label: t.footer.terms, href: '/terms' },
      { label: t.footer.deleteAccount, href: '/delete-account' },
    ],
  }

  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    if (protectedHrefs.has(href) && !isLoggedIn) {
      e.preventDefault()
      setPendingHref(href)
      setGuestModalOpen(true)
    }
  }

  const handleGuestSuccess = () => {
    if (pendingHref) {
      router.push(pendingHref)
      setPendingHref(null)
    }
  }

  return (
    <>
      <footer className="border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="container py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-6">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-3">
              <Logo className="w-28" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {t.footer.tagline}
              </p>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-primary-500 hover:text-primary-600 dark:border-neutral-700 dark:text-neutral-400"
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>

              {/* App badges */}
              <div className="mt-6 flex items-center gap-2">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.Tourkokan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-700"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83 1.01-1.3 1.68-.79l14 8.5c.6.36.6 1.22 0 1.58l-14 8.5C4.01 21.8 3 21.33 3 20.5z" />
                  </svg>
                  Google Play
                </Link>
                <div className="flex items-center gap-1.5 rounded-lg bg-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
                  {t.footer.iosSoon}
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={handleLinkClick(link.href)}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-neutral-500 transition hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-neutral-100 pt-8 sm:flex-row dark:border-neutral-800">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} Tourkokan. {t.footer.rights}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {t.footer.madeWith}
            </p>
          </div>
        </div>
      </footer>

      <GuestAuthModal
        isOpen={guestModalOpen}
        onClose={() => { setGuestModalOpen(false); setPendingHref(null) }}
        onSuccess={handleGuestSuccess}
      />
    </>
  )
}

export default BrandFooter
