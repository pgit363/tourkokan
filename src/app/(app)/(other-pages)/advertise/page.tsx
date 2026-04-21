'use client'

import { useEffect, useState } from 'react'

const API_BASE = '/api/proxy'

interface BannerPackage {
  id: number
  name: string
  description?: string
  price: number
  duration_days?: number
  allowed_placements?: string[]
}

const AdvertisePage = () => {
  const [packages, setPackages] = useState<BannerPackage[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    fetch(`${API_BASE}/v2/advertisingPackages`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? []
        setPackages(list)
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const payload = {
        ...form,
        message: form.message || `Interested in advertising with TourKokan.`,
      }
      const res = await fetch(`${API_BASE}/v2/addGuestQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data?.message && typeof data.message === 'object') {
          setFieldErrors(data.message as Record<string, string[]>)
          setErrorMsg('')
        } else {
          setErrorMsg(data?.message ?? 'Something went wrong. Please try again.')
          setFieldErrors({})
        }
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
        setFieldErrors({})
      }
    } catch {
      setErrorMsg('Unable to reach the server. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-6xl">
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            Advertising
          </span>
          <h1 className="mt-4 text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-white">
            Reach Konkan Travellers
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400">
            TourKokan connects your business with thousands of travellers exploring the Konkan coast every month.
            Advertise your hotel, restaurant, experience, or service directly in the app.
          </p>
        </div>

        {/* Why Advertise */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: 'Targeted Audience',
              desc: 'Reach travellers actively planning or exploring Konkan — the most relevant audience for your business.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'Measurable Results',
              desc: 'Track impressions, clicks, and enquiries in real-time through your advertiser dashboard.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Affordable Pricing',
              desc: 'Flexible packages for every budget — from local homestays to large resorts.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                {item.icon}
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed dark:text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900 dark:text-white">Advertising Packages</h2>

          {loadingPackages ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="mb-3 h-5 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="mb-2 h-8 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-700" />
                </div>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl border p-6 ${
                    idx === 1
                      ? 'border-primary-500 bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900'
                      : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                  }`}
                >
                  {idx === 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-xs font-bold text-primary-600">
                      Most Popular
                    </span>
                  )}
                  <h3 className={`font-semibold ${idx === 1 ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                    {pkg.name}
                  </h3>
                  <div className={`mt-3 text-3xl font-bold ${idx === 1 ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                    ₹{pkg.price.toLocaleString('en-IN')}
                    {pkg.duration_days && (
                      <span className={`ml-1 text-sm font-normal ${idx === 1 ? 'text-primary-100' : 'text-neutral-500'}`}>
                        / {pkg.duration_days} days
                      </span>
                    )}
                  </div>
                  {pkg.description && (
                    <p className={`mt-3 text-sm leading-relaxed ${idx === 1 ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {pkg.description}
                    </p>
                  )}
                  {Array.isArray(pkg.allowed_placements) && pkg.allowed_placements.length > 0 && (
                    <div className="mt-4">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${idx === 1 ? 'text-primary-200' : 'text-neutral-400'}`}>
                        Placements
                      </p>
                      <ul className="space-y-1.5">
                        {pkg.allowed_placements.map((placement) => (
                          <li key={placement} className={`flex items-center gap-2 text-sm ${idx === 1 ? 'text-primary-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                            <svg className={`h-4 w-4 shrink-0 ${idx === 1 ? 'text-white' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {placement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">
                Advertising packages coming soon. Contact us to get a custom quote.
              </p>
            </div>
          )}
        </div>

        {/* Enquiry Form */}
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Get a Custom Quote</h2>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Fill in your details and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Enquiry Sent!</h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Thank you for your interest. Our advertising team will contact you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Business / Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name or business"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                    />
                    {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone[0]}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Tell Us About Your Business
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your business, location, and what kind of advertising you're looking for..."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                  />
                  {fieldErrors.message && <p className="mt-1 text-xs text-red-500">{fieldErrors.message[0]}</p>}
                </div>

                {status === 'error' && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending Enquiry…' : 'Send Advertising Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvertisePage
