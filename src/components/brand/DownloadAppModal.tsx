'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { PlayStoreBadge } from '@/components/brand/AppBadges'

interface DownloadAppModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

const DownloadAppModal = ({ isOpen, onClose, title = 'Get More Details' }: DownloadAppModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-800">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* App icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg">
              <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          <DialogTitle className="text-center text-lg font-bold text-neutral-900 dark:text-white">
            {title}
          </DialogTitle>

          <p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Download the TourKokan app to explore full details, photos, reviews, and more — for free.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <PlayStoreBadge width={180} />
            <p className="text-xs text-neutral-400">iOS version coming soon</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default DownloadAppModal
