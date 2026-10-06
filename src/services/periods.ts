/** The periods the dashboard can show, and the stretch each one is compared with. */
import { addDays, startOfDay } from './format'

export type PeriodKey = 'today' | 'week' | 'month' | 'last30'

export interface DateRange {
  from: Date
  to: Date
}

export const PERIODS: { key: PeriodKey; label: string; comparedWith: string }[] = [
  { key: 'today', label: 'Today', comparedWith: 'yesterday' },
  { key: 'week', label: 'This week', comparedWith: 'the same days last week' },
  { key: 'month', label: 'This month', comparedWith: 'the same days last month' },
  { key: 'last30', label: 'Last 30 days', comparedWith: 'the 30 days before' },
]

const DAY = 24 * 60 * 60 * 1000

export function rangeFor(period: PeriodKey, now = new Date()): DateRange {
  const today = startOfDay(now)
  switch (period) {
    case 'week': return { from: addDays(today, -today.getDay()), to: today } // weeks start on Sunday, as in the reports
    case 'month': return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today }
    case 'last30': return { from: addDays(today, -29), to: today }
    default: return { from: today, to: today }
  }
}

/** The stretch of the same length that a period is measured against */
export function previousRangeFor(period: PeriodKey, range: DateRange): DateRange {
  if (period === 'month') {
    const from = new Date(range.from.getFullYear(), range.from.getMonth() - 1, 1)
    const lastDay = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate()
    return { from, to: new Date(from.getFullYear(), from.getMonth(), Math.min(range.to.getDate(), lastDay)) }
  }
  const length = Math.round((range.to.getTime() - range.from.getTime()) / DAY) + 1
  const shift = period === 'week' ? 7 : length
  return { from: addDays(range.from, -shift), to: addDays(range.to, -shift) }
}

export function dayCount(range: DateRange): number {
  return Math.round((range.to.getTime() - range.from.getTime()) / DAY) + 1
}
