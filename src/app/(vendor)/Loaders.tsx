'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'

/**
 * The dashboard's loading states.
 *
 * Every screen here used to render the bare word "Loading…", which tells someone
 * nothing about what is coming and makes the page jump when it arrives. These
 * stand in for the real shape instead: a table keeps its header and shows pulsing
 * rows, the overview keeps its tile grid, a form keeps its block.
 *
 * The spinner is the ring already used on the public events and destinations
 * pages, extracted rather than reinvented so the two halves of the site agree on
 * what "busy" looks like.
 */
export function Spinner({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-block animate-spin rounded-full border-4 border-primary-500 border-t-transparent ${className}`}
    />
  )
}

/** Spinner plus its label, for the middle of an otherwise empty panel. */
export function Loading({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-sm text-neutral-500">
      <Spinner />
      <span>{label}</span>
    </div>
  )
}

/** A bar of shimmering nothing, sized by class. */
export function Bar({ className = 'h-4 w-24' }: { className?: string }) {
  return <span className={`block animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 ${className}`} />
}

/**
 * Placeholder rows for a table whose header is already on screen.
 *
 * Rendered inside the real `<TableBody>` so the column widths and the header stay
 * put — the point is that nothing moves when the data lands.
 */
export function SkeletonRows({ columns, rows = 4 }: { columns: number; rows?: number }) {
  // Varied widths so it reads as text rather than as a progress bar.
  const widths = ['w-40', 'w-20', 'w-28', 'w-16', 'w-32', 'w-24', 'w-12']

  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <TableRow key={r} aria-hidden>
          {Array.from({ length: columns }, (_, c) => (
            <TableCell key={c}>
              <Bar className={`h-4 ${widths[(r + c) % widths.length]}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

/** The overview's tile grid, before the numbers exist. */
export function StatsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
          <Bar className="h-7 w-14" />
          <Bar className="mt-3 h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

/** A bordered block standing in for a panel or a form. */
export function PanelSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
      <Bar className="h-5 w-40" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <Bar key={i} className={`h-4 ${['w-full', 'w-5/6', 'w-2/3', 'w-3/4'][i % 4]}`} />
        ))}
      </div>
    </div>
  )
}

/**
 * A whole table, header included, for a route that has not mounted yet.
 *
 * `loading.tsx` runs before any component knows what the columns are called, so
 * the headers are bars too. It still reserves the right number of them, which is
 * the point: the shape on screen is the shape that arrives.
 */
export function TableSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <Table dense striped className="text-sm">
      <TableHead>
        <TableRow aria-hidden>
          {Array.from({ length: columns }, (_, c) => (
            <TableHeader key={c}>
              <Bar className="h-3 w-16" />
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <SkeletonRows columns={columns} rows={rows} />
      </TableBody>
    </Table>
  )
}

/** A list route between the click and the first paint: title, toolbar, table. */
export function ListPageSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div>
      <Bar className="h-7 w-48" />
      <div className="mt-6 mb-5 flex gap-3">
        <Bar className="h-9 w-56 rounded-2xl" />
        <Bar className="h-9 w-32 rounded-2xl" />
      </div>
      <TableSkeleton columns={columns} />
    </div>
  )
}

/** A form or detail route between the click and the first paint. */
export function FormPageSkeleton() {
  return (
    <div className="max-w-2xl">
      <Bar className="h-7 w-52" />
      <div className="mt-6 space-y-6">
        <PanelSkeleton lines={4} />
        <PanelSkeleton lines={3} />
      </div>
    </div>
  )
}
