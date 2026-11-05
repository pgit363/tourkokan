'use client'

import { ProductDailyStat } from '@/lib/api'
import { useLang } from '@/context/LanguageContext'
import { useState } from 'react'

/**
 * Views per day — one series, so no legend: the heading names it.
 *
 * The series is zero-filled here because the server sends only days that had
 * activity (`productAnalytics.daily` omits quiet days rather than sending zeros),
 * and a time axis with the gaps closed up would silently compress a quiet week
 * into nothing.
 *
 * Colour is one hue from the validated sequential ramp — step 450 on light, step
 * 400 on dark, each checked against its own surface rather than the light value
 * being flipped. A `<title>` per bar is the hover layer; the table view below is
 * the non-visual path to the same numbers.
 */
export default function DailyBars({ daily, from, to }: { daily: ProductDailyStat[]; from: string; to: string }) {
  const { t } = useLang()
  const d = t.vendorDash
  const [asTable, setAsTable] = useState(false)

  const byDate = new Map(daily.map((row) => [row.date, row]))
  const days: { date: string; views: number; leads: number }[] = []

  const start = new Date(from)
  const end = new Date(to)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10)
    const row = byDate.get(key)
    days.push({ date: key, views: row?.views ?? 0, leads: row?.leads ?? 0 })
  }

  if (!days.length) return <p className="text-sm text-neutral-500">{d.noActivity}</p>

  const peak = Math.max(1, ...days.map((x) => x.views))

  // Geometry: a 2px gap between adjacent bars, 4px rounded tops, baseline at y=H.
  const W = 4
  const GAP = 2
  const H = 120
  const width = days.length * (W + GAP)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-medium">{d.viewsPerDay}</h2>
        <button
          type="button"
          onClick={() => setAsTable((v) => !v)}
          className="text-xs text-neutral-500 hover:underline"
        >
          {asTable ? d.chartView : d.tableView}
        </button>
      </div>

      {asTable ? (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-neutral-500">
              <tr>
                <th className="py-1">{d.dateLabel}</th>
                <th className="py-1">{d.statViews}</th>
                <th className="py-1">{d.navLeads}</th>
              </tr>
            </thead>
            <tbody>
              {days.map((x) => (
                <tr key={x.date} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="py-1 text-neutral-500">{x.date}</td>
                  <td className="py-1 tabular-nums">{x.views}</td>
                  <td className="py-1 tabular-nums">{x.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${width} ${H}`}
            className="h-32 w-full [--bar:#2a78d6] dark:[--bar:#3987e5]"
            preserveAspectRatio="none"
            role="img"
            aria-label={d.viewsPerDay}
          >
            {/* recessive baseline */}
            <line x1="0" y1={H - 0.5} x2={width} y2={H - 0.5} stroke="currentColor" strokeWidth="1" opacity="0.12" />
            {days.map((x, i) => {
              const h = Math.max(x.views > 0 ? 2 : 0, (x.views / peak) * (H - 6))
              return (
                <rect
                  key={x.date}
                  x={i * (W + GAP)}
                  y={H - h}
                  width={W}
                  height={h}
                  rx="2"
                  fill="var(--bar)"
                >
                  <title>{`${x.date} · ${x.views} ${d.statViews} · ${x.leads} ${d.navLeads}`}</title>
                </rect>
              )
            })}
          </svg>
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>{days[0].date}</span>
            <span>{days[days.length - 1].date}</span>
          </div>
        </>
      )}
    </div>
  )
}
