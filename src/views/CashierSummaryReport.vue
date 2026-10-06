<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Cashier Summary Report</h2>
          <p class="text-navy-400 font-medium mt-1">Aggregated cashier performance over a date range</p>
        </div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <date-picker
            v-model:value="date"
            type="date"
            range
            placeholder="Select date range"
            value-type="format"
            format="YYYY-MM-DD"
            @change="onDateChange"
            class="custom-datepicker w-full sm:w-auto"
          />
          <button
            type="button"
            @click="load"
            :disabled="loading || !startDate || !endDate"
            class="btn-primary whitespace-nowrap"
          >
            {{ loading ? 'Loading...' : 'Generate' }}
          </button>
          <router-link to="/dashboard/commission-calculator" class="btn-quiet whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.684 4.5 4.819V21a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V4.82c0-1.136-.806-2.12-1.907-2.248A48.494 48.494 0 0 0 12 2.25Z" />
            </svg>
            Commission calculator
          </router-link>
        </div>
      </div>
    </header>

    <!-- First load: placeholders in the shape of what is coming -->
    <template v-if="loading && !loaded">
      <FigureGrid :figures="figures" loading />
      <div class="card space-y-4 p-5" role="status" aria-label="Loading report">
        <span v-for="n in 6" :key="n" class="skeleton h-9 w-full" :style="{ opacity: 1 - n * 0.12 }"></span>
      </div>
    </template>

    <!-- Generating again keeps the last report on screen, dimmed, until the new one arrives -->
    <div v-else-if="loaded" class="space-y-6 transition-opacity" :class="loading ? 'opacity-50' : ''" :aria-busy="loading">
      <!-- Headline figures -->
      <FigureGrid :figures="figures" />

      <!-- The same money, split by game type -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section v-for="game in gameTotals" :key="game.name" class="card p-5">
          <h3 class="font-bold text-navy-700 dark:text-white">{{ game.name }}</h3>
          <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-2 2xl:grid-cols-4">
            <div v-for="figure in game.figures" :key="figure.label" class="min-w-0">
              <dt class="eyebrow">{{ figure.label }}</dt>
              <dd class="tabular mt-0.5 whitespace-nowrap text-base font-bold" :class="figure.negative ? negativeInk : 'text-navy-700 dark:text-white'">{{ figure.value }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <!-- Cashier breakdown -->
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1">
        <div>
          <h3 class="font-bold text-navy-700 dark:text-white">Cashier breakdown</h3>
          <p class="text-sm text-navy-400">{{ cashierLine }}</p>
        </div>
        <div class="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold rounded-lg text-sm whitespace-nowrap">
          {{ shown.from }} to {{ shown.to }}
        </div>
      </div>

      <div v-if="!items.length" class="card px-6 py-14 text-center font-medium text-navy-400">
        No sales in this period.
      </div>

      <template v-else>
        <!-- Phone: one card per cashier -->
        <div class="md:hidden space-y-3">
          <article v-for="row in items" :key="row.cashierId" class="card overflow-hidden">
            <div class="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
              <div class="min-w-0">
                <p class="break-words font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
                <p class="text-xs text-navy-400 mt-0.5">{{ row.cashierName }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="eyebrow">Balance</p>
                <p class="tabular whitespace-nowrap text-base font-bold" :class="row.netBalance < 0 ? negativeInk : 'text-navy-700 dark:text-white'">{{ moneyExact(row.netBalance) }}</p>
              </div>
            </div>
            <dl class="grid grid-cols-2 gap-px border-t border-gray-100 bg-gray-100 dark:border-navy-700 dark:bg-navy-700">
              <div v-for="cell in cashierFigures(row)" :key="cell.label" class="bg-white p-3 dark:bg-navy-800">
                <dt class="eyebrow">{{ cell.label }}</dt>
                <dd class="tabular mt-0.5 whitespace-nowrap text-sm font-bold text-navy-700 dark:text-white">{{ cell.value }}</dd>
              </div>
            </dl>
            <div class="space-y-3 border-t border-gray-100 px-4 py-3 dark:border-navy-700">
              <div v-for="game in cashierGames(row)" :key="game.name">
                <span class="rounded-md bg-navy-100 px-2 py-0.5 text-xs font-bold text-navy-700 dark:bg-navy-700 dark:text-white">{{ game.name }}</span>
                <dl class="mt-1.5 grid grid-cols-3 gap-2">
                  <div class="min-w-0">
                    <dt class="text-[11px] font-medium text-navy-400">Net sales</dt>
                    <dd class="tabular whitespace-nowrap text-xs font-semibold text-navy-700 dark:text-white">{{ moneyExact(game.sales) }}</dd>
                  </div>
                  <div class="min-w-0">
                    <dt class="text-[11px] font-medium text-navy-400">Commission</dt>
                    <dd class="tabular whitespace-nowrap text-xs font-semibold text-navy-700 dark:text-white">{{ moneyExact(game.commission) }}</dd>
                  </div>
                  <div class="min-w-0">
                    <dt class="text-[11px] font-medium text-navy-400">Claimed</dt>
                    <dd class="tabular whitespace-nowrap text-xs font-semibold text-navy-700 dark:text-white">{{ moneyExact(game.claimed) }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        </div>

        <!-- Wider screens: the table -->
        <div class="card hidden overflow-x-auto md:block">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/50 text-left dark:bg-navy-900/50">
                <th scope="col" class="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-400 whitespace-nowrap">Cashier</th>
                <th v-for="column in columns" :key="column" scope="col" class="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-navy-400 whitespace-nowrap">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="row in items" :key="row.cashierId">
                <tr class="border-t border-gray-100 dark:border-navy-700">
                  <td class="px-4 py-3">
                    <p class="font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
                    <p class="text-xs text-navy-400">{{ row.cashierName }}</p>
                  </td>
                  <td class="px-4 py-3 text-right font-semibold text-navy-700 dark:text-navy-200 whitespace-nowrap">{{ moneyExact(row.sales) }}</td>
                  <td class="px-4 py-3 text-right text-navy-500 whitespace-nowrap">{{ moneyExact(row.cancelled) }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-navy-700 dark:text-navy-200 whitespace-nowrap">{{ moneyExact(row.netSales) }}</td>
                  <td class="px-4 py-3 text-right text-navy-500 whitespace-nowrap">{{ moneyExact(row.commission) }}</td>
                  <td class="px-4 py-3 text-right text-navy-500 whitespace-nowrap">
                    {{ moneyExact(row.paid) }}
                    <span class="block text-[11px] text-navy-400">{{ tickets(row.claimedCount) }}</span>
                  </td>
                  <td class="px-4 py-3 text-right font-bold whitespace-nowrap" :class="row.netBalance < 0 ? negativeInk : 'text-navy-700 dark:text-white'">{{ moneyExact(row.netBalance) }}</td>
                </tr>
                <!-- What each game type contributed. Its sales arrive already less cancelled tickets, so they sit under Net sales. -->
                <tr v-for="game in cashierGames(row)" :key="game.name" class="bg-navy-50/70 text-xs text-navy-500 dark:bg-navy-900/30">
                  <td class="py-2 pl-8 pr-4">
                    <span class="rounded-md bg-navy-100 px-1.5 py-0.5 font-bold text-navy-700 dark:bg-navy-700 dark:text-white">{{ game.name }}</span>
                  </td>
                  <td class="px-4 py-2 text-right text-navy-300" aria-label="Not split by game type">–</td>
                  <td class="px-4 py-2 text-right text-navy-300" aria-label="Not split by game type">–</td>
                  <td class="px-4 py-2 text-right whitespace-nowrap">{{ moneyExact(game.sales) }}</td>
                  <td class="px-4 py-2 text-right whitespace-nowrap">{{ moneyExact(game.commission) }}</td>
                  <td class="px-4 py-2 text-right whitespace-nowrap">{{ moneyExact(game.claimed) }}</td>
                  <td class="px-4 py-2 text-right font-semibold whitespace-nowrap" :class="game.balance < 0 ? negativeInk : ''">{{ moneyExact(game.balance) }}</td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-gray-200 bg-gray-50/50 font-bold text-navy-700 dark:border-navy-600 dark:bg-navy-900/50 dark:text-white">
                <td class="px-4 py-3">Total</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">{{ moneyExact(stats.totalSales) }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">{{ moneyExact(stats.totalCancelled) }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">{{ moneyExact(stats.totalSales - stats.totalCancelled) }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">{{ moneyExact(stats.totalCommission) }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  {{ moneyExact(stats.totalPaid) }}
                  <span class="block text-[11px] font-medium text-navy-400">{{ tickets(stats.totalClaimedCount) }}</span>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap" :class="stats.totalNetBalance < 0 ? negativeInk : ''">{{ moneyExact(stats.totalNetBalance) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>

      <!-- No-sales cashiers -->
      <div v-if="noSalesItems.length" class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl overflow-hidden">
        <div class="p-5 border-b border-amber-200 dark:border-amber-500/20 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-amber-500 shrink-0" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h3 class="font-bold text-amber-700 dark:text-amber-400">
            Cashiers with No Sales ({{ noSalesItems.length }})
          </h3>
          <p class="text-sm text-amber-600 dark:text-amber-500 font-medium hidden sm:block">— No activity recorded in the selected period</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left">
                <th scope="col" class="px-5 py-3 font-bold text-amber-600 dark:text-amber-400">Username</th>
                <th scope="col" class="px-5 py-3 font-bold text-amber-600 dark:text-amber-400">Name</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-amber-100 dark:divide-amber-500/10">
              <tr v-for="row in noSalesItems" :key="row.cashierId" class="hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors">
                <td class="px-5 py-3 font-semibold text-amber-700 dark:text-amber-300">{{ row.cashierUsername }}</td>
                <td class="px-5 py-3 text-amber-600 dark:text-amber-400">{{ row.cashierName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- The first report did not arrive -->
    <div v-else-if="failed" class="card px-6 py-14 text-center" role="alert">
      <p class="text-lg font-bold text-navy-700 dark:text-white">The report could not be loaded</p>
      <p class="text-navy-400 font-medium mt-1">Check your connection and try again.</p>
      <button type="button" class="btn-primary mt-5" @click="load">Try again</button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '@/stores/auth'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { format } from 'date-fns'
import FigureGrid from '@/components/ui/FigureGrid.vue'
import { moneyExact, count } from '@/services/format'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const shopId = Number(authStore.user?.shopId ?? 0)

const todayStr = format(new Date(), 'yyyy-MM-dd')
const tomorrowStr = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')

const date = ref([todayStr, tomorrowStr])
const startDate = ref(todayStr)
const endDate = ref(tomorrowStr)
// The page asks for its report as soon as it opens
const loading = ref(true)
const loaded = ref(false)
const failed = ref(false)
// The range the report on screen was generated for; the picker may have moved on since
const shown = reactive({ from: todayStr, to: tomorrowStr })
const items = ref([])
const noSalesItems = ref([])
const stats = reactive({
  totalSales: 0,
  totalCancelled: 0,
  totalPaid: 0,
  totalClaimedCount: 0,
  totalCommission: 0,
  totalNetBalance: 0,
  totalLotto590Sales: 0,
  totalLotto590Winnings: 0,
  totalLotto590Commission: 0,
  totalAccumulatorSales: 0,
  totalAccumulatorWinnings: 0,
  totalAccumulatorCommission: 0,
  activeCashierCount: 0,
  noSalesCashierCount: 0,
})

const columns = ['Sales', 'Cancelled', 'Net sales', 'Commission', 'Claimed', 'Balance']
// A balance below zero is the one figure set apart by colour
const negativeInk = 'text-red-600 dark:text-red-400'

const round2 = (n) => Math.round(n * 100) / 100
const tickets = (n) => `${count(n)} ticket${Number(n) === 1 ? '' : 's'}`

const figures = computed(() => [
  { label: 'Sales', value: moneyExact(stats.totalSales) },
  { label: 'Cancelled', value: moneyExact(stats.totalCancelled) },
  { label: 'Net sales', value: moneyExact(stats.totalSales - stats.totalCancelled) },
  { label: 'Commission', value: moneyExact(stats.totalCommission) },
  { label: 'Claimed', value: moneyExact(stats.totalPaid), note: tickets(stats.totalClaimedCount) },
  { label: 'Net balance', value: moneyExact(stats.totalNetBalance), negative: stats.totalNetBalance < 0 },
])

// What is left of a game type's sales after its commission and the winnings paid on it
const gameBalance = (sales, commission, claimed) => round2((Number(sales) || 0) - (Number(commission) || 0) - (Number(claimed) || 0))

const gameTotals = computed(() =>
  [
    { name: '5/90', sales: stats.totalLotto590Sales, commission: stats.totalLotto590Commission, claimed: stats.totalLotto590Winnings },
    { name: 'Accumulator', sales: stats.totalAccumulatorSales, commission: stats.totalAccumulatorCommission, claimed: stats.totalAccumulatorWinnings },
  ].map((game) => {
    const balance = gameBalance(game.sales, game.commission, game.claimed)
    return {
      name: game.name,
      figures: [
        { label: 'Net sales', value: moneyExact(game.sales) },
        { label: 'Commission', value: moneyExact(game.commission) },
        { label: 'Claimed', value: moneyExact(game.claimed) },
        { label: 'Balance', value: moneyExact(balance), negative: balance < 0 },
      ],
    }
  })
)

const cashierLine = computed(() => {
  const active = `${count(stats.activeCashierCount)} cashier${stats.activeCashierCount === 1 ? '' : 's'} with sales`
  return stats.noSalesCashierCount > 0 ? `${active}, ${count(stats.noSalesCashierCount)} with none` : active
})

const cashierFigures = (row) => [
  { label: 'Sales', value: moneyExact(row.sales) },
  { label: 'Cancelled', value: moneyExact(row.cancelled) },
  { label: 'Net sales', value: moneyExact(row.netSales ?? row.sales - row.cancelled) },
  { label: 'Commission', value: moneyExact(row.commission) },
  { label: 'Claimed', value: moneyExact(row.paid) },
  { label: 'Tickets claimed', value: count(row.claimedCount) },
]

const cashierGames = (row) => [
  { name: '5/90', sales: row.lotto590Sales, commission: row.lotto590Commission, claimed: row.lotto590Winnings, balance: gameBalance(row.lotto590Sales, row.lotto590Commission, row.lotto590Winnings) },
  { name: 'Accumulator', sales: row.accumulatorSales, commission: row.accumulatorCommission, claimed: row.accumulatorWinnings, balance: gameBalance(row.accumulatorSales, row.accumulatorCommission, row.accumulatorWinnings) },
]

const onDateChange = (val) => {
  if (val && val[0] && val[1]) {
    startDate.value = val[0]
    endDate.value = val[1]
  }
}

const load = async () => {
  if (!startDate.value || !endDate.value) {
    loading.value = false
    snackbar.add({ type: 'warning', text: 'Please select a date range first' })
    return
  }
  const from = startDate.value
  const to = endDate.value
  try {
    loading.value = true
    failed.value = false
    const res = await axios.get(
      `report/cashier/summary?shopId=${shopId}&fromDate=${from}&toDate=${to}`
    )
    const data = res.data
    items.value = data.items ?? []
    noSalesItems.value = data.noSalesItems ?? []
    Object.assign(stats, {
      totalSales: data.totalSales ?? 0,
      totalCancelled: data.totalCancelled ?? 0,
      totalPaid: data.totalPaid ?? 0,
      totalClaimedCount: data.totalClaimedCount ?? 0,
      totalCommission: data.totalCommission ?? 0,
      totalNetBalance: data.totalNetBalance ?? 0,
      totalLotto590Sales: data.totalLotto590Sales ?? 0,
      totalLotto590Winnings: data.totalLotto590Winnings ?? 0,
      totalLotto590Commission: data.totalLotto590Commission ?? 0,
      totalAccumulatorSales: data.totalAccumulatorSales ?? 0,
      totalAccumulatorWinnings: data.totalAccumulatorWinnings ?? 0,
      totalAccumulatorCommission: data.totalAccumulatorCommission ?? 0,
      activeCashierCount: data.activeCashierCount ?? 0,
      noSalesCashierCount: data.noSalesCashierCount ?? 0,
    })
    shown.from = from
    shown.to = to
    loaded.value = true
  } catch (err) {
    // With a report already on screen it stays there, still labelled with its own dates
    failed.value = true
    snackbar.add({ type: 'error', text: 'Failed to load cashier summary' })
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})
</script>
