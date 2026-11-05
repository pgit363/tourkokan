'use client'

import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'
import { ApiError, setStoredUser, setToken, vendorApi } from '@/lib/api'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, FieldGroup, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { useCallback, useEffect, useRef, useState } from 'react'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID

/**
 * The one sign-in surface on the website.
 *
 * Email and password is the always-available path — `/v2/auth/login` has always
 * worked, and this site simply had no page that called it, which left Google
 * Identity Services as the only way in and therefore no way in at all wherever
 * `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` is unset. Google is a supplement now, and its
 * absence costs a button rather than the whole screen.
 *
 * `title`/`subtitle` are overridable so a caller can keep its own framing — the
 * vendor wizard asks for a sign-in for a specific reason and says so — while the
 * mechanics below stay in one place.
 */
export default function SignInCard({
  onDone,
  title,
  subtitle,
}: {
  onDone: () => void
  title?: string
  subtitle?: string
}) {
  const { t } = useLang()
  const a = t.auth
  const { login, refreshUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const googleRef = useRef<HTMLDivElement>(null)

  const adoptSession = useCallback(
    async (accessToken: string, sessionUser: unknown) => {
      setToken(accessToken)
      if (sessionUser) setStoredUser(sessionUser as Parameters<typeof setStoredUser>[0])
      await refreshUser()
      onDone()
    },
    [refreshUser, onDone]
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await login(email.trim(), password)
      onDone()
    } catch (err) {
      // `apiFetch` throws an ApiError for a non-2xx AND for an HTTP 200 carrying
      // `{success: false}`, which is how this backend reports a bad credential. Its
      // own message is the useful one; anything else gets the generic line.
      setError(err instanceof ApiError && err.message ? err.message : a.signInFailed)
    } finally {
      setBusy(false)
    }
  }

  // Google Identity Services — loaded on demand, silently absent without a client id
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleRef.current) return
    const scriptId = 'google-gsi'
    const init = () => {
      const g = (
        window as unknown as {
          google?: {
            accounts?: {
              id?: {
                initialize: (o: object) => void
                renderButton: (el: HTMLElement, o: object) => void
              }
            }
          }
        }
      ).google
      if (!g?.accounts?.id || !googleRef.current) return
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp: { credential?: string }) => {
          if (!resp.credential) return
          setBusy(true)
          setError('')
          try {
            const res = await vendorApi.googleAuth(resp.credential)
            const data = res.data as { access_token?: string; user?: unknown } | undefined
            if (!data?.access_token) throw new Error(a.googleFailed)
            await adoptSession(data.access_token, data.user)
          } catch {
            setError(a.googleFailed)
          } finally {
            setBusy(false)
          }
        },
      })
      g.accounts.id.renderButton(googleRef.current, { theme: 'outline', size: 'large', width: 320 })
    }
    if (document.getElementById(scriptId)) {
      init()
      return
    }
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = init
    document.head.appendChild(script)
  }, [adoptSession, a.googleFailed])

  return (
    <div>
      <h1 className="text-2xl font-semibold">{title ?? a.signInTitle}</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{subtitle ?? a.signInSub}</p>

      <form onSubmit={submit} className="mt-6">
        <FieldGroup>
          <Field>
            <Label>{a.email}</Label>
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <Label>{a.password}</Label>
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </FieldGroup>

        <ButtonPrimary type="submit" disabled={busy} className="mt-6 w-full">
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {a.signingIn}
            </span>
          ) : (
            a.signIn
          )}
        </ButtonPrimary>
      </form>

      {GOOGLE_CLIENT_ID && (
        <>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-500">{a.orDivider}</span>
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div ref={googleRef} className="flex justify-center" />
        </>
      )}
    </div>
  )
}
