<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header + Inputs -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Commission Calculator</h2>
          <p class="text-navy-400 font-medium mt-1">Calculate how commission is split between cashiers and the principal agent</p>
        </div>
        <router-link
          to="/dashboard/cashier-summary-report"
          class="flex items-center gap-2 text-sm font-semibold text-navy-400 hover:text-brand-500 transition-colors whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Cashier Summary
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <!-- Date -->
        <div class="space-y-1.5">
          <label for="calc-date" class="eyebrow block">Date</label>
          <date-picker
            v-model:value="calcDate"
            type="date"
            placeholder="Select date"
            value-type="format"
            format="YYYY-MM-DD"
            :input-attr="{ id: 'calc-date' }"
            class="custom-datepicker w-full"
          />
        </div>

        <!-- 5/90 cashier commission -->
        <div class="space-y-1.5">
          <label for="rate-590" class="eyebrow block">5/90 Cashier Commission</label>
          <div class="relative">
            <input
              id="rate-590"
              v-model.number="rate590Cashier"
              type="number"
              inputmode="decimal"
              min="0"
              max="35"
              step="0.5"
              class="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-navy-900/50 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 font-bold text-sm" aria-hidden="true">%</span>
          </div>
          <p class="text-xs text-navy-400">
            Principal agent:
            <span class="font-bold text-navy-700 dark:text-white">{{ pct(clamp(35 - rate590Cashier, 0, 35)) }}</span>
            (of 35% total)
          </p>
        </div>

        <!-- Accumulator cashier commission -->
        <div class="space-y-1.5">
          <label for="rate-accumulator" class="eyebrow block">Accumulator Cashier Commission</label>
          <div class="relative">
            <input
              id="rate-accumulator"
              v-model.number="rateAccumCashier"
              type="number"
              inputmode="decimal"
              min="0"
              max="10"
              step="0.5"
              class="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-navy-900/50 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 font-bold text-sm" aria-hidden="true">%</span>
          </div>
          <p class="text-xs text-navy-400">
            Principal agent:
            <span class="font-bold text-navy-700 dark:text-white">{{ pct(clamp(10 - rateAccumCashier, 0, 10)) }}</span>
            (of 10% total)
          </p>
        </div>
      </div>

      <div class="mt-5">
        <button
          type="button"
          @click="calculate"
          :disabled="calcLoading || !calcDate"
          class="btn-primary w-full px-6 sm:w-auto"
        >
          <svg v-if="calcLoading" class="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.684 4.5 4.819V21a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V4.82c0-1.136-.806-2.12-1.907-2.248A48.494 48.494 0 0 0 12 2.25Z" />
          </svg>
          {{ calcLoading ? 'Calculating...' : 'Calculate' }}
        </button>
      </div>
    </header>

    <!-- First calculation: placeholders in the shape of what is coming -->
    <div v-if="calcLoading && !calcLoaded" class="card space-y-4 p-5" role="status" aria-label="Calculating">
      <span v-for="n in 6" :key="n" class="skeleton h-9 w-full" :style="{ opacity: 1 - n * 0.12 }"></span>
    </div>

    <!-- Calculating again keeps the last answer on screen, dimmed, until the new one arrives -->
    <div v-else-if="calcLoaded" class="space-y-6 transition-opacity" :class="calcLoading ? 'opacity-50' : ''" :aria-busy="calcLoading">
      <div class="space-y-4">
        <!-- The date and rates this answer was worked out with; the fields above may have changed since -->
        <p class="eyebrow px-1">For {{ ran.date }}</p>

        <!-- What each side takes -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-3xl bg-brand-600 p-5 text-white shadow-sm">
            <p class="text-sm font-semibold text-white/85">Principal agent takes</p>
            <p class="tabular mt-1 whitespace-nowrap text-2xl font-bold sm:text-3xl">{{ moneyExact(totals.grandPrincipalComm) }}</p>
            <p class="mt-1 text-sm text-white/85">5/90 and Accumulator commission together</p>
          </div>
          <div class="card p-5">
            <p class="text-sm font-semibold text-navy-400">All cashiers take</p>
            <p class="tabular mt-1 whitespace-nowrap text-2xl font-bold text-navy-700 dark:text-white sm:text-3xl">{{ moneyExact(totals.grandCashierComm) }}</p>
            <p class="mt-1 text-sm text-navy-400">Shared between {{ cashierCount }}</p>
          </div>
        </div>

        <!-- How each game type's commission is shared -->
        <section v-for="game in games" :key="game.key" class="card p-5">
          <div class="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 class="font-bold text-navy-700 dark:text-white">{{ game.name }} commission split</h3>
            <span class="text-sm text-navy-400">{{ pct(game.totalRate) }} of net sales in all</span>
          </div>
          <dl class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div v-for="figure in splitFigures(totals, game, true)" :key="figure.label" class="min-w-0">
              <dt class="eyebrow">{{ figure.label }}</dt>
              <dd class="tabular mt-0.5 whitespace-nowrap text-lg font-bold text-navy-700 dark:text-white">{{ figure.value }}</dd>
            </div>
          </dl>
          <div
            class="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full"
            role="img"
            :aria-label="`Cashiers get ${pct(game.cashierShare)} of the ${game.name} commission, the principal agent ${pct(game.principalShare)}`"
          >
            <div v-if="game.cashierShare > 0" class="bg-chart-1" :style="{ width: `${game.cashierShare}%` }"></div>
            <div v-if="game.principalShare > 0" class="bg-chart-2" :style="{ width: `${game.principalShare}%` }"></div>
          </div>
          <div class="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs font-medium text-navy-400">
            <span class="flex items-center gap-1.5"><span class="size-2 rounded-sm bg-chart-1" aria-hidden="true"></span>Cashiers {{ pct(game.cashierShare) }} of the commission</span>
            <span class="flex items-center gap-1.5"><span class="size-2 rounded-sm bg-chart-2" aria-hidden="true"></span>Principal agent {{ pct(game.principalShare) }}</span>
          </div>
        </section>
      </div>

      <!-- Per-cashier breakdown -->
      <div class="flex items-center justify-between gap-4 px-1">
        <h3 class="font-bold text-navy-700 dark:text-white">Per-cashier breakdown</h3>
        <span class="text-sm text-navy-400">{{ cashierCount }}</span>
      </div>

      <div v-if="!calcItems.length" class="card px-6 py-14 text-center font-medium text-navy-400">
        No cashier had sales on {{ ran.date }}.
      </div>

      <template v-else>
        <!-- Up to a small laptop: one card per cashier -->
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
          <article v-for="row in calcItems" :key="row.cashierId" class="card overflow-hidden">
            <div class="flex items-start justify-between gap-3 border-b border-gray-100 px-4 pt-4 pb-3 dark:border-navy-700">
              <div class="min-w-0">
                <p class="break-words font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
                <p class="text-xs text-navy-400 mt-0.5">{{ row.cashierName }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="eyebrow">Cashier payout</p>
                <p class="tabular whitespace-nowrap text-base font-bold text-navy-700 dark:text-white">{{ moneyExact(row.totalCashierPayout) }}</p>
                <p class="text-[11px] text-navy-400 mt-0.5">{{ claimed(row.claimedCount) }}</p>
              </div>
            </div>
            <div v-for="game in games" :key="game.key" class="border-b border-gray-100 px-4 py-3 last:border-b-0 dark:border-navy-700">
              <span class="rounded-md bg-navy-100 px-2 py-0.5 text-xs font-bold text-navy-700 dark:bg-navy-700 dark:text-white">{{ game.name }}</span>
              <dl class="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                <div v-for="figure in splitFigures(row, game, false)" :key="figure.label" class="min-w-0">
                  <dt class="text-[11px] font-medium text-navy-400">{{ figure.label }}</dt>
                  <dd class="tabular whitespace-nowrap text-sm font-semibold text-navy-700 dark:text-white">{{ figure.value }}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>

        <!-- Wide screens: the table. The cashier and what they are paid come first and the name stays put
             if the rest has to scroll sideways. -->
        <div class="card hidden overflow-x-auto xl:block">
          <table class="w-full text-[13px]">
            <thead class="text-[11px] font-bold uppercase tracking-wide text-navy-400">
              <tr class="bg-gray-50 dark:bg-navy-900">
                <th scope="col" rowspan="2" class="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left align-bottom whitespace-nowrap dark:bg-navy-900">Cashier</th>
                <th scope="col" rowspan="2" class="px-3 py-3 text-right align-bottom whitespace-nowrap">Cashier payout</th>
                <th v-for="game in games" :key="game.key" scope="colgroup" colspan="4" class="border-l border-gray-200 px-3 pt-3 pb-1 text-left whitespace-nowrap dark:border-navy-600">{{ game.name }}</th>
              </tr>
              <tr class="bg-gray-50 dark:bg-navy-900">
                <template v-for="game in games" :key="game.key">
                  <th scope="col" class="border-l border-gray-200 px-3 pt-1 pb-3 text-right whitespace-nowrap dark:border-navy-600">Net sales</th>
                  <th scope="col" class="px-3 pt-1 pb-3 text-right whitespace-nowrap">Comm. {{ pct(game.totalRate) }}</th>
                  <th scope="col" class="px-3 pt-1 pb-3 text-right whitespace-nowrap">Cashier {{ pct(game.cashierRate) }}</th>
                  <th scope="col" class="px-3 pt-1 pb-3 text-right whitespace-nowrap">Principal {{ pct(game.principalRate) }}</th>
                </template>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-navy-700">
              <tr v-for="row in calcItems" :key="row.cashierId">
                <td class="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap dark:bg-navy-800">
                  <p class="text-sm font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
                  <p class="text-xs text-navy-400">{{ row.cashierName }}</p>
                </td>
                <td class="px-3 py-3 text-right text-sm font-bold text-navy-700 whitespace-nowrap dark:text-white">
                  {{ moneyExact(row.totalCashierPayout) }}
                  <span class="block text-[11px] font-medium text-navy-400">{{ claimed(row.claimedCount) }}</span>
                </td>
                <template v-for="game in games" :key="game.key">
                  <td class="border-l border-gray-100 px-3 py-3 text-right text-navy-700 whitespace-nowrap dark:border-navy-700 dark:text-navy-200">{{ moneyExact(row[`${game.key}Sales`]) }}</td>
                  <td class="px-3 py-3 text-right text-navy-500 whitespace-nowrap">{{ moneyExact(row[`${game.key}TotalComm`]) }}</td>
                  <td class="px-3 py-3 text-right font-semibold text-navy-700 whitespace-nowrap dark:text-navy-200">{{ moneyExact(row[`${game.key}CashierComm`]) }}</td>
                  <td class="px-3 py-3 text-right text-navy-500 whitespace-nowrap">{{ moneyExact(row[`${game.key}PrincipalComm`]) }}</td>
                </template>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-gray-200 bg-gray-50 font-bold text-navy-700 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
                <td class="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-sm dark:bg-navy-900">Total</td>
                <td class="px-3 py-3 text-right text-sm whitespace-nowrap">
                  {{ moneyExact(totals.grandCashierComm) }}
                  <span class="block text-[11px] font-medium text-navy-400">{{ claimed(totals.totalClaimedCount) }}</span>
                </td>
                <template v-for="game in games" :key="game.key">
                  <td class="border-l border-gray-200 px-3 py-3 text-right whitespace-nowrap dark:border-navy-600">{{ moneyExact(totals[`${game.key}Sales`]) }}</td>
                  <td class="px-3 py-3 text-right whitespace-nowrap">{{ moneyExact(totals[`${game.key}TotalComm`]) }}</td>
                  <td class="px-3 py-3 text-right whitespace-nowrap">{{ moneyExact(totals[`${game.key}CashierComm`]) }}</td>
                  <td class="px-3 py-3 text-right whitespace-nowrap">{{ moneyExact(totals[`${game.key}PrincipalComm`]) }}</td>
                </template>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </div>

    <!-- Nothing calculated yet -->
    <div v-else class="card p-10 text-center sm:p-16">
      <div class="size-16 bg-brand-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-brand-500" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.684 4.5 4.819V21a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V4.82c0-1.136-.806-2.12-1.907-2.248A48.494 48.494 0 0 0 12 2.25Z" />
        </svg>
      </div>
      <p class="text-lg font-bold text-navy-700 dark:text-white">Set your rates and calculate</p>
      <p class="text-navy-400 font-medium mt-1">Select a date and enter cashier commission rates, then click Calculate</p>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '@/stores/auth'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { format } from 'date-fns'
import { moneyExact, count } from '@/services/format'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const shopId = Number(authStore.user?.shopId ?? 0)

const calcDate = ref(format(new Date(), 'yyyy-MM-dd'))
const rate590Cashier = ref(30)
const rateAccumCashier = ref(7)

const RATE_590_TOTAL = 35
const RATE_ACCUM_TOTAL = 10

const calcLoading = ref(false)
const calcLoaded = ref(false)
const calcItems = ref([])

// What the answer on screen was worked out with. The fields can be edited afterwards
// without the figures claiming a date or a split they were not calculated for.
const ran = reactive({ date: '', cashier590: 30, cashierAccum: 7 })

const totals = reactive({
  lotto590Sales: 0,
  lotto590TotalComm: 0,
  lotto590CashierComm: 0,
  lotto590PrincipalComm: 0,
  accumulatorSales: 0,
  accumulatorTotalComm: 0,
  accumulatorCashierComm: 0,
  accumulatorPrincipalComm: 0,
  grandCashierComm: 0,
  grandPrincipalComm: 0,
  totalClaimedCount: 0,
})

const clamp = (val, min, max) => Math.min(Math.max(Number(val) || 0, min), max)
const round2 = (n) => Math.round(n * 100) / 100
const round1 = (n) => Math.round(n * 10) / 10
/** 30 reads "30%", 4.5 reads "4.5%" */
const pct = (n) => `${round1(Number(n) || 0)}%`
const claimed = (n) => `${count(n)} ticket${Number(n) === 1 ? '' : 's'} claimed`

// The two game types, with the rates of the last calculation. `key` is the prefix of their fields.
const games = computed(() =>
  [
    { key: 'lotto590', name: '5/90', totalRate: RATE_590_TOTAL, cashierRate: ran.cashier590 },
    { key: 'accumulator', name: 'Accumulator', totalRate: RATE_ACCUM_TOTAL, cashierRate: ran.cashierAccum },
  ].map((game) => {
    const cashierShare = round1((game.cashierRate / game.totalRate) * 100)
    return {
      ...game,
      principalRate: round1(game.totalRate - game.cashierRate),
      // Of the commission the game generated, how much goes to each side
      cashierShare,
      principalShare: round1(100 - cashierShare),
    }
  })
)

const cashierCount = computed(() => `${count(calcItems.value.length)} cashier${calcItems.value.length === 1 ? '' : 's'}`)

/** One game type's four figures, for the whole shop (the totals) or for one cashier (a row) */
const splitFigures = (source, game, wholeShop) => [
  { label: 'Net sales', value: moneyExact(source[`${game.key}Sales`]) },
  { label: wholeShop ? 'Commission generated' : `Commission (${pct(game.totalRate)})`, value: moneyExact(source[`${game.key}TotalComm`]) },
  { label: `${wholeShop ? 'Cashiers' : 'Cashier'} (${pct(game.cashierRate)})`, value: moneyExact(source[`${game.key}CashierComm`]) },
  { label: `${wholeShop ? 'Principal agent' : 'Principal'} (${pct(game.principalRate)})`, value: moneyExact(source[`${game.key}PrincipalComm`]) },
]

const calculate = async () => {
  if (!calcDate.value) {
    snackbar.add({ type: 'warning', text: 'Please select a date' })
    return
  }
  const date = calcDate.value
  const cashier590 = clamp(rate590Cashier.value, 0, RATE_590_TOTAL)
  const cashierAccum = clamp(rateAccumCashier.value, 0, RATE_ACCUM_TOTAL)
  const principal590 = RATE_590_TOTAL - cashier590
  const principalAccum = RATE_ACCUM_TOTAL - cashierAccum

  try {
    calcLoading.value = true
    const res = await axios.get(
      `report/cashier/summary?shopId=${shopId}&fromDate=${date}&toDate=${date}`
    )
    const data = res.data
    const rawItems = data.items ?? []

    calcItems.value = rawItems.map((row) => {
      // The API sends each game type's sales already less cancelled tickets
      const lotto590Sales = Number(row.lotto590Sales) || 0
      const accumulatorSales = Number(row.accumulatorSales) || 0

      const lotto590TotalComm = round2(lotto590Sales * RATE_590_TOTAL / 100)
      const lotto590CashierComm = round2(lotto590Sales * cashier590 / 100)
      const lotto590PrincipalComm = round2(lotto590Sales * principal590 / 100)

      const accumulatorTotalComm = round2(accumulatorSales * RATE_ACCUM_TOTAL / 100)
      const accumulatorCashierComm = round2(accumulatorSales * cashierAccum / 100)
      const accumulatorPrincipalComm = round2(accumulatorSales * principalAccum / 100)

      const totalCashierPayout = round2(lotto590CashierComm + accumulatorCashierComm)

      return {
        cashierId: row.cashierId,
        cashierUsername: row.cashierUsername,
        cashierName: row.cashierName,
        claimedCount: row.claimedCount ?? 0,
        lotto590Sales,
        lotto590TotalComm,
        lotto590CashierComm,
        lotto590PrincipalComm,
        accumulatorSales,
        accumulatorTotalComm,
        accumulatorCashierComm,
        accumulatorPrincipalComm,
        totalCashierPayout,
      }
    })

    const sum = (field) => round2(calcItems.value.reduce((acc, r) => acc + r[field], 0))

    Object.assign(totals, {
      lotto590Sales: sum('lotto590Sales'),
      lotto590TotalComm: sum('lotto590TotalComm'),
      lotto590CashierComm: sum('lotto590CashierComm'),
      lotto590PrincipalComm: sum('lotto590PrincipalComm'),
      accumulatorSales: sum('accumulatorSales'),
      accumulatorTotalComm: sum('accumulatorTotalComm'),
      accumulatorCashierComm: sum('accumulatorCashierComm'),
      accumulatorPrincipalComm: sum('accumulatorPrincipalComm'),
      grandCashierComm: round2(sum('lotto590CashierComm') + sum('accumulatorCashierComm')),
      grandPrincipalComm: round2(sum('lotto590PrincipalComm') + sum('accumulatorPrincipalComm')),
      totalClaimedCount: sum('claimedCount'),
    })

    ran.date = date
    ran.cashier590 = cashier590
    ran.cashierAccum = cashierAccum
    calcLoaded.value = true
  } catch (err) {
    snackbar.add({ type: 'error', text: 'Failed to fetch data' })
    console.error(err)
  } finally {
    calcLoading.value = false
  }
}
</script>
