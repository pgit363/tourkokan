'use client'

import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import VendorSidebar from './VendorSidebar'

/**
 * The console's chrome: a fixed rail on desktop, a drawer on mobile, and a slim bar
 * carrying only what a working screen needs — language, who you are, and the way
 * out.
 *
 * Deliberately not `ApplicationLayout`: the public header's job is to sell the
 * Kokan to a tourist, and a vendor editing prices is not that visit. Keeping the
 * Tourkokan mark and the primary colour means it still reads as the same product
 * without borrowing the same navigation.
 */
export default function VendorShell({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useLang()
  const d = t.vendorDash
  const { user, logout } = useAuth()
  const router = useRouter()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const signOut = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white lg:block dark:border-neutral-800 dark:bg-neutral-900">
        <VendorSidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={d.closeMenu}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-neutral-900">
            <VendorSidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
          <button
            type="button"
            aria-label={d.menu}
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <span className="truncate text-sm font-medium text-neutral-500 lg:hidden">{d.title}</span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
              title={lang === 'en' ? 'Switch to Marathi' : 'Switch to English'}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-neutral-700 dark:text-neutral-300"
            >
              {lang === 'en' ? 'मराठी' : 'EN'}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 transition hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400"
              >
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </button>
              {userMenuOpen && (
                <>
                  {/* Click-away: a menu that only closes by re-clicking its own
                      button is the kind of thing that feels broken on a phone. */}
                  <button
                    type="button"
                    aria-hidden
                    tabIndex={-1}
                    onClick={() => setUserMenuOpen(false)}
                    className="fixed inset-0 z-0 cursor-default"
                  />
                  <div className="absolute top-10 right-0 z-10 w-48 rounded-2xl border border-neutral-100 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <p className="truncate px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white">
                      {user?.name}
                    </p>
                    <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      {t.header.myAccount}
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {t.header.signOut}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
