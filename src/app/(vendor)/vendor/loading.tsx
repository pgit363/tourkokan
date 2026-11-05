import { StatsSkeleton, PanelSkeleton, Bar } from '../Loaders'

/** Shown the moment /vendor is navigated to, before anything has fetched. */
export default function Loading() {
  return (
    <div className="space-y-10">
      <Bar className="h-7 w-48" />
      <StatsSkeleton count={4} />
      <PanelSkeleton lines={2} />
    </div>
  )
}
