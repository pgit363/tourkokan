import Image from 'next/image'
import Link from 'next/link'
import { AppStoreBadgeSoon, PlayStoreBadge } from '@/components/brand/AppBadges'

const DownloadSection = () => {
  return (
    <section id="download" className="relative overflow-hidden py-20 lg:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-orange-800" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container relative">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          {/* Left */}
          <div className="max-w-lg text-center lg:text-left">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Start exploring Konkan today
            </h2>
            <p className="mt-5 text-lg text-orange-100">
              Download TourKokan for free and unlock access to hundreds of destinations, live bus routes, local food
              guides, and unforgettable experiences.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <PlayStoreBadge width={160} />
              <AppStoreBadgeSoon width={160} />
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-orange-100">
                <svg className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">4.8 Play Store Rating</span>
              </div>
              <div className="flex items-center gap-2 text-orange-100">
                <svg className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">Free & Secure</span>
              </div>
              <div className="flex items-center gap-2 text-orange-100">
                <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Android & iOS</span>
              </div>
            </div>
          </div>

          {/* Right — QR / Visual */}
          <div className="flex flex-col items-center gap-6">
            {/* QR code */}
            <div className="rounded-3xl bg-white p-5 shadow-2xl">
              <p className="mb-3 text-center text-sm font-semibold text-neutral-700">Scan to Download</p>
              <Image
                src="/qr-code.png"
                alt="Scan to download Tourkokan on Google Play"
                width={180}
                height={180}
                className="rounded-xl"
              />
              <p className="mt-3 text-center text-xs text-neutral-500">Google Play Store</p>
            </div>

            <div className="text-center text-sm text-orange-100">
              Or search <span className="font-semibold text-white">&ldquo;Tourkokan&rdquo;</span> on Play Store
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadSection
