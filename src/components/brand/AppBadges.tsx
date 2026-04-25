import Image from 'next/image'
import Link from 'next/link'
import googlePlayBadge from '@/images/googleplay.png'
import appStoreBadge from '@/images/appstore.png'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tourkokan'

interface PlayStoreBadgeProps {
  width?: number
  className?: string
}
export const PlayStoreBadge = ({ width = 160, className = '' }: PlayStoreBadgeProps) => (
  <Link
    href={PLAY_STORE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block transition-transform hover:scale-105 ${className}`}
  >
    <Image
      src={googlePlayBadge}
      alt="Get it on Google Play"
      width={width}
      height={Math.round(width * 0.3)}
      className="h-auto"
    />
  </Link>
)

interface AppStoreBadgeProps {
  width?: number
  className?: string
}

export const AppStoreBadgeSoon = ({ width = 160, className = '' }: AppStoreBadgeProps) => (
  <div className={`relative inline-block cursor-not-allowed ${className}`}>
    <Image
      src={appStoreBadge}
      alt="Download on the App Store — Coming Soon"
      width={width}
      height={Math.round(width * 0.3)}
      className="h-auto opacity-50"
    />
    <span className="absolute bottom-1 right-1.5 rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold text-white shadow">
      Soon
    </span>
  </div>
)
