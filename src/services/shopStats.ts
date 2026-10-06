/**
 * The shop's sales figures for the dashboard.
 *
 * "Sales" here always means net sales: everything staked, less the stake on
 * cancelled tickets. Gross sales and the cancelled amount are kept alongside
 * so a screen can show what the net figure is made of.
 */
import axios from 'axios'
import { addDays, isoDate, startOfDay } from './format'
import type { DateRange } from './periods'

export interface Totals {
  /** Gross sales: every stake placed, cancelled tickets included */
  sales: number
  cancelled: number
  /** Gross sales less cancelled */
  netSales: number
  /** Won by tickets in the period */
  winnings: number
  /** Winnings claimed and paid out in the period */
  paid: number
  /** Number of winning tickets paid */
  paidCount: number
  commission: number
  /** Net sales less commission and winnings paid */
  balance: number
}

export interface DayRow extends Totals {
  date: Date
}

export const NO_TOTALS: Totals = { sales: 0, cancelled: 0, netSales: 0, winnings: 0, paid: 0, paidCount: 0, commission: 0, balance: 0 }

const num = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

/** Some report endpoints answer 200 with a sentence instead of data when they refuse or fail */
function expectData<T>(data: unknown, isRight: (value: unknown) => boolean): T {
  if (!isRight(data)) throw new Error(typeof data === 'string' && data ? data : 'The server sent an unexpected answer.')
  return data as T
}

function dateOf(item: any): Date | null {
  // dateLong is yyMMdd; reading it directly avoids a time zone shift from parsing a timestamp
  const key = num(item?.dateLong)
  if (key > 0) return new Date(2000 + Math.floor(key / 10000), (Math.floor(key / 100) % 100) - 1, key % 100)
  const parsed = item?.dateFromLong ? new Date(item.dateFromLong) : null
  return parsed && !isNaN(parsed.getTime()) ? startOfDay(parsed) : null
}

function totalsOf(item: any): Totals {
  const sales = num(item.sales)
  const cancelled = num(item.cancelled)
  const paid = num(item.claimed)
  const commission = num(item.commission)
  const netSales = sales - cancelled
  return { sales, cancelled, netSales, winnings: num(item.winnings), paid, paidCount: num(item.claimedCount), commission, balance: netSales - paid - commission }
}

function add(a: Totals, b: Totals): Totals {
  return {
    sales: a.sales + b.sales,
    cancelled: a.cancelled + b.cancelled,
    netSales: a.netSales + b.netSales,
    winnings: a.winnings + b.winnings,
    paid: a.paid + b.paid,
    paidCount: a.paidCount + b.paidCount,
    commission: a.commission + b.commission,
    balance: a.balance + b.balance,
  }
}

export function sumDays(rows: Totals[]): Totals {
  return rows.reduce(add, NO_TOTALS)
}

/** One row per day of the range, oldest first, with a zero row for each day the shop sold nothing */
export async function fetchDays(shopId: number, range: DateRange): Promise<DayRow[]> {
  const res = await axios.get('statistics/shop/ticket/dashboard', {
    params: { FromDate: isoDate(range.from), ToDate: isoDate(range.to), ShopId: shopId, Period: 'Custom' },
  })
  const items = expectData<any[]>(res.data, Array.isArray)

  const byDay = new Map<string, Totals>()
  for (const item of items) {
    const date = dateOf(item)
    if (!date) continue
    const key = isoDate(date)
    const row = totalsOf(item)
    const existing = byDay.get(key)
    byDay.set(key, existing ? add(existing, row) : row)
  }

  const rows: DayRow[] = []
  for (let day = range.from; day <= range.to; day = addDays(day, 1)) {
    rows.push({ date: day, ...(byDay.get(isoDate(day)) ?? NO_TOTALS) })
  }
  return rows
}

export interface CashierRow {
  id: number
  name: string
  username: string
  netSales: number
  paid: number
  commission: number
}

export interface CashierBreakdown {
  /** Cashiers who sold in the period, best first */
  selling: CashierRow[]
  /** Cashiers of the shop who sold nothing in the period */
  idle: { id: number; name: string; username: string }[]
  /** Gross sales by product, across the whole shop */
  lotto590Sales: number
  accumulatorSales: number
}

export async function fetchCashiers(shopId: number, range: DateRange): Promise<CashierBreakdown> {
  const res = await axios.get('report/cashier/summary', {
    params: { shopId, fromDate: isoDate(range.from), toDate: isoDate(range.to) },
  })
  const data = expectData<any>(res.data, (value) => !!value && typeof value === 'object' && !Array.isArray(value))
  const items: any[] = Array.isArray(data.items) ? data.items : []
  const noSales: any[] = Array.isArray(data.noSalesItems) ? data.noSalesItems : []

  const person = (item: any) => ({
    id: num(item.cashierId),
    name: (item.cashierName || '').trim() || item.cashierUsername || 'Cashier',
    username: item.cashierUsername || '',
  })

  return {
    selling: items
      .map((item) => ({ ...person(item), netSales: num(item.sales) - num(item.cancelled), paid: num(item.paid), commission: num(item.commission) }))
      .filter((row) => row.netSales > 0)
      .sort((a, b) => b.netSales - a.netSales),
    idle: noSales.map(person),
    lotto590Sales: items.reduce((total, item) => total + num(item.lotto590Sales), 0),
    accumulatorSales: items.reduce((total, item) => total + num(item.accumulatorSales), 0),
  }
}

export interface GameRow {
  name: string
  netSales: number
  paid: number
}

/** Games the shop sold in the period, best first */
export async function fetchGames(shopCode: string, range: DateRange): Promise<GameRow[]> {
  const res = await axios.get('report/DailyGameReportByShop', {
    params: { FromDate: isoDate(range.from), ToDate: isoDate(range.to), ShopCode: shopCode },
  })
  const data = expectData<any>(res.data, (value) => !!value && typeof value === 'object' && !Array.isArray(value))
  const items: any[] = Array.isArray(data.items) ? data.items : []

  // The report has a row per game per day; the dashboard wants one row per game
  const byGame = new Map<string, GameRow>()
  for (const item of items) {
    const name = item.gameName || 'Unnamed game'
    const row = byGame.get(name) ?? { name, netSales: 0, paid: 0 }
    row.netSales += num(item.sales) - num(item.cancelled)
    row.paid += num(item.claimed)
    byGame.set(name, row)
  }
  return [...byGame.values()].filter((row) => row.netSales > 0).sort((a, b) => b.netSales - a.netSales)
}
