/** How figures and dates are written across the portal, in one place. */

const toNumber = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

/** Whole naira, e.g. ₦204,471. A real minus sign for negatives, and no gap after the ₦. */
export function money(value: unknown): string {
  const amount = Math.round(toNumber(value))
  return (amount < 0 ? '−₦' : '₦') + Math.abs(amount).toLocaleString('en-US')
}

/** To the kobo, for balances an agent reconciles against: ₦184,250.50 */
export function moneyExact(value: unknown): string {
  const amount = toNumber(value)
  return (amount < 0 ? '−₦' : '₦') + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Short form for chart axes and tight spots: ₦1.2M, ₦340K */
export function compactMoney(value: unknown): string {
  const amount = toNumber(value)
  const size = Math.abs(amount)
  const sign = amount < 0 ? '−' : ''
  if (size >= 1e9) return `${sign}₦${+(size / 1e9).toFixed(1)}B`
  if (size >= 1e6) return `${sign}₦${+(size / 1e6).toFixed(1)}M`
  if (size >= 1e3) return `${sign}₦${+(size / 1e3).toFixed(size >= 1e4 ? 0 : 1)}K`
  return `${sign}₦${Math.round(size)}`
}

export function count(value: unknown): string {
  return Math.round(toNumber(value)).toLocaleString('en-US')
}

/** "12.3%", or an en dash when there is nothing to divide by */
export function percent(part: unknown, whole: unknown, digits = 1): string {
  const base = toNumber(whole)
  if (base <= 0) return '–'
  return `${((toNumber(part) / base) * 100).toFixed(digits)}%`
}

export interface Change {
  /** e.g. "+12.4%", "−3.0%", "New" */
  text: string
  direction: 'up' | 'down' | 'flat'
}

/** How a figure moved against the one before it; null when both are nothing */
export function change(now: unknown, before: unknown): Change | null {
  const current = toNumber(now)
  const previous = toNumber(before)
  if (previous === 0) return current === 0 ? null : { text: 'New', direction: 'flat' }
  const moved = ((current - previous) / Math.abs(previous)) * 100
  if (Math.abs(moved) < 0.05) return { text: '0%', direction: 'flat' }
  const size = Math.abs(moved)
  return {
    text: `${moved > 0 ? '+' : '−'}${size >= 1000 ? Math.round(size).toLocaleString('en-US') : size.toFixed(1)}%`,
    direction: moved > 0 ? 'up' : 'down',
  }
}

// ---- Dates ----

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
export const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

/** yyyy-MM-dd in local time, the form the API takes */
export function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** "5 Oct", or "Today" */
export function shortDay(date: Date, today = startOfDay(new Date())): string {
  if (date.getTime() === today.getTime()) return 'Today'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** "Mon, 5 Oct" */
export function weekDay(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "2:45 PM" */
export function clockTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** "5 Oct, 2:45 PM" */
export function dayAndTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${clockTime(date)}`
}

/** "1h 20m", "12 min", "under a minute" for a span given in milliseconds */
export function duration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'under a minute'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}
