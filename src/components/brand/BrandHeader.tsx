'use client'

import { PlayStoreBadge } from '@/components/brand/AppBadges'
import GuestAuthModal from '@/components/brand/GuestAuthModal'
import Logo from '@/shared/Logo'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const allNavLinks = [
  { href: '/destinations', label: 'Destinations', protected: true },
  { href: '/events', label: 'Events', protected: true },
  { href: '/bus-routes', label: 'Bus Routes', protected: true },
  { href: '/gallery', label: 'Gallery', protected: true },
  { href: '/about', label: 'About', protected: false },
  { href: '/contact', label: 'Contact', protected: false },
]

const BrandHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const { user, isLoggedIn, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    setMenuOpen(false)
  }

  const handleProtectedClick = (href: string) => (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setPendingHref(href)
      setGuestModalOpen(true)
      setMenuOpen(false)
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
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-xl dark:border-neutral-700 dark:bg-neutral-900/80">
        <div className="container flex h-18 items-center justify-between py-3">
          {/* Logo */}
          <Logo className="w-28" />

          {/* Desktop Nav */}
          <nav className="hidden items-center lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-neutral-200/60 bg-white/70 px-3 py-1.5 shadow-lg shadow-neutral-200/40 backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:shadow-neutral-900/40">
              {allNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={link.protected ? handleProtectedClick(link.href) : undefined}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* CTA — auth aware */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 transition hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400"
                >
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-11 w-48 rounded-2xl border border-neutral-100 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <p className="truncate px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white">{user?.name}</p>
                    <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700">My Account</Link>
                    <Link href="/account-savelists" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700">Saved Places</Link>
                    <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setGuestModalOpen(true)}
                className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Sign in
              </button>
            )}
            <PlayStoreBadge width={130} />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-neutral-600 transition hover:bg-neutral-100 lg:hidden dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-neutral-100 bg-white px-4 pb-5 lg:hidden dark:border-neutral-700 dark:bg-neutral-900">
            <nav className="mt-4 flex flex-col gap-1">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.protected && !isLoggedIn) {
                      e.preventDefault()
                      setPendingHref(link.href)
                      setGuestModalOpen(true)
                      setMenuOpen(false)
                    } else {
                      setMenuOpen(false)
                    }
                  }}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile auth section */}
            <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-700">
              {isLoggedIn ? (
                <div className="space-y-1">
                  <p className="px-3 py-1 text-sm font-medium text-neutral-900 dark:text-white">{user?.name}</p>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800">My Account</Link>
                  <Link href="/account-savelists" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800">Saved Places</Link>
                  <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</button>
                </div>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); setGuestModalOpen(true) }}
                  className="w-full rounded-xl bg-primary-600 py-2.5 text-center text-sm font-medium text-white"
                >
                  Sign in as Guest
                </button>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <PlayStoreBadge width={160} />
            </div>
          </div>
        )}
      </header>

      <GuestAuthModal
        isOpen={guestModalOpen}
        onClose={() => { setGuestModalOpen(false); setPendingHref(null) }}
        onSuccess={handleGuestSuccess}
      />
    </>
  )
}

export default BrandHeader
