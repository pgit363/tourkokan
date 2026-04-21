import BrandFooter from '@/components/brand/BrandFooter'
import BrandHeader from '@/components/brand/BrandHeader'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  header?: ReactNode
}

const ApplicationLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <BrandHeader />
      {children}
      <BrandFooter />
    </>
  )
}

export { ApplicationLayout }
