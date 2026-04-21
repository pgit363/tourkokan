'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import { ApiError, authApi } from '@/lib/api'
import Link from 'next/link'
import { useState } from 'react'

type Step = 'email' | 'otp'

const Page = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.sendOtp(email)
      setSuccess('OTP sent to your email. Check your inbox.')
      setStep('otp')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.verifyOtp(email, otp)
      setSuccess('OTP verified! You can now log in with your new credentials.')
      setStep('email')
      setEmail('')
      setOtp('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Logo className="w-32" />
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {step === 'email' ? 'Reset your password' : 'Enter OTP'}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            {step === 'email'
              ? 'Enter your registered email to receive an OTP.'
              : `We sent a 6-digit OTP to ${email}.`}
          </p>
        </div>

        {success && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSendOtp}>
            <Field className="block">
              <Label className="text-neutral-800 dark:text-neutral-200">Email address</Label>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </ButtonPrimary>
          </form>
        ) : (
          <form className="grid grid-cols-1 gap-6" onSubmit={handleVerifyOtp}>
            <Field className="block">
              <Label className="text-neutral-800 dark:text-neutral-200">OTP</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                className="mt-1 text-center tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </Field>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify OTP'}
            </ButtonPrimary>
            <button
              type="button"
              onClick={() => { setStep('email'); setError(''); setSuccess('') }}
              className="text-center text-sm text-neutral-500 underline"
            >
              Back
            </button>
          </form>
        )}

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          New user?{' '}
          <Link href="/signup" className="font-medium underline">
            Create an account
          </Link>
          {'  or  '}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
