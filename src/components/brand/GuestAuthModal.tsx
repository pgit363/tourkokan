'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

interface GuestAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const GuestAuthModal = ({ isOpen, onClose, onSuccess }: GuestAuthModalProps) => {
  const { loginAsGuest } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = async () => {
    setLoading(true)
    setError('')
    try {
      await loginAsGuest()
      onClose()
      onSuccess?.()
    } catch {
      setError('Failed to create guest session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg">
              <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <DialogTitle className="text-center text-lg font-bold text-neutral-900 dark:text-white">
            Continue as Guest
          </DialogTitle>

          <p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
            We'll create a temporary guest account for you to explore TourKokan.
          </p>

          {/* Info boxes */}
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 px-3 py-2.5 dark:bg-amber-900/20">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Guest sessions are valid for <strong>24 hours</strong>. After that your session will expire.
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-center text-sm text-red-500">{error}</p>
          )}

          <button
            onClick={handleContinue}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Creating session…' : 'Continue as Guest'}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            For a full experience, download the TourKokan app
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default GuestAuthModal
