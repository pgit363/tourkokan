'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import { ApiError, authApi, setToken, setStoredUser } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const payload: Record<string, string> = { name: form.name, password: form.password }
      if (form.email) payload.email = form.email
      if (form.mobile) payload.mobile = form.mobile

      const res = await authApi.register(payload as Parameters<typeof authApi.register>[0])
      setToken(res.access_token)
      setStoredUser(res.user)
      router.push('/account')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        if (err.errors) setFieldErrors(err.errors)
      } else {
        setError('Registration failed. Please try again.')
      }
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
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Full name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Your name"
              className="mt-1"
              value={form.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>}
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Email address</Label>
            <Input
              type="email"
              name="email"
              placeholder="example@example.com"
              className="mt-1"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>}
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Mobile number</Label>
            <Input
              type="tel"
              name="mobile"
              placeholder="10-digit mobile number"
              className="mt-1"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
            />
            {fieldErrors.mobile && <p className="mt-1 text-xs text-red-500">{fieldErrors.mobile[0]}</p>}
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Password</Label>
            <Input
              type="password"
              name="password"
              className="mt-1"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password[0]}</p>}
          </Field>

          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </ButtonPrimary>
        </form>

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
