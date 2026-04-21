import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`inline-flex items-center focus:ring-0 focus:outline-hidden ${className}`}>
      <Image
        src="/logo.png"
        alt="TourKokan"
        width={382}
        height={415}
        className="h-17 w-auto dark:brightness-90"
        priority
      />
    </Link>
  )
}

export default Logo
