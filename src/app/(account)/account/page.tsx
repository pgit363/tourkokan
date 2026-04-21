'use client'

import { ImageAdd02Icon } from '@/components/Icons'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import { useAuth } from '@/context/AuthContext'
import { ApiError, authApi } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function Page() {
  const { user, refreshUser } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    dob: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        mobile: user.mobile ?? '',
        gender: user.gender ?? '',
        dob: user.dob ?? '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await authApi.updateProfile(form)
      await refreshUser()
      setSuccess('Profile updated successfully.')
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

  const avatarLetter = user.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div>
      <h1 className="text-3xl font-semibold">Account information</h1>
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

      <form className="flex flex-col md:flex-row" onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="flex shrink-0 items-start">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-primary-100">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-primary-600">{avatarLetter}</span>
            )}
            <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-neutral-50 opacity-0 transition hover:opacity-100">
              <ImageAdd02Icon className="h-6 w-6" />
              <span className="mt-1 text-xs">Change Image</span>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-10 max-w-3xl grow space-y-6 md:mt-0 md:ps-16">
          <Field>
            <Label>Full name</Label>
            <Input name="name" className="mt-1.5" value={form.name} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Gender</Label>
            <Select name="gender" className="mt-1.5" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </Field>

          <Field>
            <Label>Email</Label>
            <Input name="email" type="email" className="mt-1.5" value={form.email} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Mobile number</Label>
            <Input name="mobile" type="tel" className="mt-1.5" value={form.mobile} onChange={handleChange} maxLength={10} />
          </Field>

          <Field className="max-w-lg">
            <Label>Date of birth</Label>
            <Input name="dob" type="date" className="mt-1.5" value={form.dob} onChange={handleChange} />
          </Field>

          <div className="pt-4">
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Update information'}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </div>
  )
}
