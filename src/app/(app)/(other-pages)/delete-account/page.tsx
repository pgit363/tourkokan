'use client'

import { useState } from 'react'
import Link from 'next/link'

const API_BASE = '/api/proxy'

type Step = 'email' | 'otp' | 'done'

const DeleteAccountPage = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 — send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/v2/auth/deleteMyAccount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) {
        setError(data?.message ?? 'Something went wrong. Please try again.')
      } else {
        setStep('otp')
      }
    } catch {
      setError('Unable to reach the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — verify OTP and delete
  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/v2/auth/verifyOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, otp, delete: true }),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) {
        setError(data?.message ?? 'Invalid OTP. Please try again.')
      } else {
        setStep('done')
      }
    } catch {
      setError('Unable to reach the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Delete Your Account</h1>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">
            This is permanent and cannot be undone. All your data will be erased.
          </p>
        </div>

        {step === 'email' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            {/* What gets deleted */}
            <div className="mb-6 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                The following will be permanently deleted:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• Your account and profile information</li>
                <li>• All saved destinations and favourites</li>
                <li>• Your reviews and submitted content</li>
                <li>• Wallet and transaction history</li>
              </ul>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                />
                <p className="mt-1.5 text-xs text-neutral-400">
                  We will send a one-time verification code to this email.
                </p>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? 'Sending Code…' : 'Send Verification Code'}
              </button>

              <p className="text-center text-xs text-neutral-400">
                Changed your mind?{' '}
                <Link href="/" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Go back to home
                </Link>
              </p>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
              A 6-digit verification code has been sent to{' '}
              <span className="font-semibold text-neutral-900 dark:text-white">{email}</span>.
              Enter it below to permanently delete your account.
            </p>

            <form onSubmit={handleConfirmDelete} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="123456"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-lg font-bold tracking-widest text-neutral-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? 'Deleting Account…' : 'Confirm & Permanently Delete'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(''); setError('') }}
                className="w-full rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Use a different email
              </button>
            </form>
          </div>
        )}

        {step === 'done' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Account Deleted</h2>
            <p className="mt-3 text-neutral-500 dark:text-neutral-400">
              Your account and all associated data have been permanently removed from our database.
              We&apos;re sorry to see you go.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeleteAccountPage
