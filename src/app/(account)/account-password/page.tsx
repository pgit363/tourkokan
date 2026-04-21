'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { useAuth } from '@/context/AuthContext'
import { ApiError, authApi } from '@/lib/api'
import { useState } from 'react'

export default function Page() {
  const { user } = useAuth()
  const [form, setForm] = useState({ password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await authApi.updateProfile({ password: form.password, password_confirmation: form.password_confirmation })
      setSuccess('Password updated successfully.')
      setForm({ password: '', password_confirmation: '' })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-neutral-500">
        <p>You must be logged in to view this page.</p>
        <a href="/login" className="mt-4 inline-block font-medium text-primary-600 underline">Sign in</a>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Update your password</h1>
      <Divider className="my-8 w-14!" />

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form className="max-w-xl space-y-6" onSubmit={handleSubmit}>
        <Field>
          <Label>New password</Label>
          <Input
            type="password"
            name="password"
            className="mt-1.5"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </Field>
        <Field>
          <Label>Confirm new password</Label>
          <Input
            type="password"
            name="password_confirmation"
            className="mt-1.5"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            minLength={6}
          />
        </Field>
        <div className="pt-4">
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  )
}
