import Heading from '@/shared/Heading'
import { FC } from 'react'

const facts = [
  {
    id: '1',
    heading: '720 km',
    subHeading:
      'Maharashtra\'s Tourkokan coastline — one of India\'s longest and most scenic stretches, from Dahanu to Goa. (Source: Maharashtra Tourism)',
  },
  {
    id: '2',
    heading: '₹12,000 Cr+',
    subHeading:
      'Estimated annual revenue from Tourkokan tourism, driven by beaches, forts, and Alphonso mango agri-tourism. (Source: MTDC 2023)',
  },
  {
    id: '3',
    heading: '5 Million+',
    subHeading:
      'Tourists visit the Tourkokan coast every year, with Malvan, Alibaug, and Ganpatipule among the top destinations. (Source: Maharashtra Tourism)',
  },
  {
    id: '4',
    heading: '200+ Beaches',
    subHeading:
      'Pristine beaches along the Tourkokan coast — from Tarkarli\'s turquoise waters to Harihareshwar\'s sacred shores.',
  },
  {
    id: '5',
    heading: '30+ Forts',
    subHeading:
      'Historic sea and hill forts including Sindhudurg, Vijaydurg, and Jaigad — built by Chhatrapati Shivaji Maharaj.',
  },
  {
    id: '6',
    heading: '52 Weeks',
    subHeading:
      'Year-round tourism — monsoon waterfalls (Jun–Sep), winter beaches (Oct–Feb), and mango season (Apr–Jun).',
  },
]

interface SectionStatisticProps {
  className?: string
}

const SectionStatistic: FC<SectionStatisticProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Heading subheading="Real numbers behind Tourkokan's growing tourism story">
        🌊 Tourkokan by the Numbers
      </Heading>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {facts.map((item) => (
          <div key={item.id} className="rounded-2xl bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="text-2xl leading-none font-semibold text-primary-600 md:text-3xl dark:text-primary-400">
              {item.heading}
            </h3>
            <span className="mt-3 block text-sm text-neutral-500 sm:text-base dark:text-neutral-400">
              {item.subHeading}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionStatistic
