'use client'

import SignInCard from '@/components/brand/SignInCard'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect } from 'react'

/**
 * Where `?next=` may send someone.
 *
 * Only a path on this site. An absolute URL, a protocol-relative `//evil.test` or
 * anything else is dropped in favour of the home page — a redirect target taken
 * from the query string and followed unchecked is an open redirect, and this one is
 * reachable from a link in an email.
 */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

function LoginForm() {
  const { t } = useLang()
  const router = useRouter()
  const params = useSearchParams()
  const { isLoggedIn, isGuest, isLoading } = useAuth()

  const next = safeNext(params.get('next'))

  // Already signed in as a real account — nothing to do here. A guest is *not*
  // signed in for this purpose: the pages that send people here (the vendor
  // dashboard) need a real identity, so a guest sees the form.
  useEffect(() => {
    if (!isLoading && isLoggedIn && !isGuest) router.replace(next)
  }, [isLoading, isLoggedIn, isGuest, next, router])

  const onDone = useCallback(() => router.replace(next), [router, next])

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      {isLoading ? (
        <p className="text-sm text-neutral-500">{t.common.loading}</p>
      ) : (
        <SignInCard onDone={onDone} />
      )}
    </div>
  )
}

export default function LoginPage() {
  // `useSearchParams` makes the subtree dynamic; the boundary keeps the rest of the
  // route prerenderable rather than opting the whole page out.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
