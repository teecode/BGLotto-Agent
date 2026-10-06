<template>
  <div class="space-y-5">
    <!-- What is on screen, and the period it covers -->
    <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <h1 class="text-2xl font-bold tracking-tight text-navy-700 dark:text-white">{{ greeting }}, {{ authStore.user.firstName || 'Agent' }}</h1>
        <p class="mt-1 text-sm font-medium text-navy-400">
          {{ periodText }}<span class="hidden sm:inline"> · compared with {{ comparedWith }}</span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <SegmentedControl v-model="period" :options="PERIODS" label="Period" />
        <button
          type="button"
          class="btn-quiet shrink-0 px-3"
          :disabled="loading"
          :title="updatedAt ? `Updated ${clockTime(updatedAt)}` : 'Refresh'"
          aria-label="Refresh figures"
          @click="loadPeriod"
        >
          <AppIcon name="refresh" class="size-5" :class="loading ? 'animate-spin' : ''" />
        </button>
      </div>
    </header>

    <!-- Terminals at risk of being taken back -->
    <section v-if="inoperativeTerminals.length > 0" class="rounded-3xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10 sm:p-5" aria-label="Terminal warning">
      <div class="flex items-start gap-3">
        <AppIcon name="warning" class="mt-0.5 size-6 text-amber-600 dark:text-amber-400" />
        <div class="min-w-0 flex-1">
          <h2 class="font-bold text-amber-900 dark:text-amber-200">
            {{ inoperativeTerminals.length === 1 ? '1 terminal may be repossessed' : `${inoperativeTerminals.length} terminals may be repossessed` }}
          </h2>
          <p class="mt-0.5 text-sm text-amber-800 dark:text-amber-200/80">
            Terminals that sell less than ₦5,000 in 7 days after being assigned are taken back.
          </p>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li v-for="terminal in inoperativeTerminals" :key="terminal.terminalSerial" class="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm dark:border-amber-500/30 dark:bg-navy-800">
              <p class="font-bold text-navy-700 dark:text-white">Terminal {{ terminal.terminalSerial }}</p>
              <p class="text-navy-400">{{ terminal.cashierName || 'Unassigned' }} · {{ money(terminal.totalSales) }} in 7 days</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- A failed load says so, instead of showing zeros that look like a quiet day -->
    <div v-if="error" class="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10" role="alert">
      <p class="flex items-center gap-3 text-sm font-semibold text-red-700 dark:text-red-300">
        <AppIcon name="warning" class="size-5" />
        <span>{{ error }}<template v-if="loaded && updatedAt"> The figures below are from {{ clockTime(updatedAt) }}.</template></span>
      </p>
      <button type="button" class="btn bg-red-600 text-white hover:bg-red-700" :disabled="loading" @click="loadPeriod">Try again</button>
    </div>

    <!-- Wallet and the headline figures -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section class="flex flex-col justify-between gap-5 rounded-3xl bg-brand-600 p-5 text-white shadow-sm sm:p-6" aria-label="Wallet">
        <div>
          <p class="text-sm font-semibold text-white/80">Wallet balance</p>
          <span v-if="!walletLoaded" class="skeleton mt-2 h-10 w-2/3 !bg-white/20"></span>
          <p v-else class="tabular mt-1 whitespace-nowrap text-3xl font-bold tracking-tight sm:text-4xl">{{ moneyExact(walletBalance) }}</p>
        </div>

        <div v-if="accountNumber" class="rounded-2xl bg-white/10 p-3.5">
          <p class="text-xs font-semibold text-white/75">Fund your wallet by transfer to</p>
          <div class="mt-1 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="tabular truncate text-lg font-bold tracking-wide">{{ accountNumber }}</p>
              <p class="truncate text-sm text-white/80">{{ accountBank }}</p>
            </div>
            <button type="button" class="btn shrink-0 bg-white/15 text-white hover:bg-white/25" @click="copyAccount">
              <AppIcon :name="copied ? 'check' : 'copy'" class="size-5" />
              {{ copied ? 'Copied' : 'Copy' }}
            </button>
          </div>
        </div>

        <button type="button" class="btn w-full bg-white py-3 text-base text-brand-700 hover:bg-brand-50" @click="showModal = true">
          Request payout
        </button>
      </section>

      <!-- With nothing loaded there are no figures to show: an empty space reads better than a row of ₦0 -->
      <div v-if="!noFigures" class="grid grid-cols-2 gap-4 xl:col-span-2" :class="dimmed">
        <StatTile
          label="Net sales"
          :value="money(current.netSales)"
          :change="loaded ? change(current.netSales, previous.netSales) : null"
          :previous="loaded && previous.netSales ? money(previous.netSales) : ''"
          up-is="good"
          :trend="days.map((day) => day.netSales)"
          :loading="!loaded && !error"
          hint="Stake placed, less the stake on cancelled tickets"
        >
          <!-- What the net figure is made of -->
          <span class="tabular">Gross {{ money(current.sales) }} less {{ money(current.cancelled) }} cancelled</span>
        </StatTile>
        <StatTile
          label="Commission earned"
          :value="money(current.commission)"
          :change="loaded ? change(current.commission, previous.commission) : null"
          :previous="loaded && previous.commission ? money(previous.commission) : ''"
          up-is="good"
          :trend="days.map((day) => day.commission)"
          :loading="!loaded && !error"
          hint="Your commission on the period's sales"
        >
          <span class="tabular">{{ percent(current.commission, current.netSales) }} of net sales</span>
        </StatTile>
        <StatTile
          label="Winnings paid"
          :value="money(current.paid)"
          :change="loaded ? change(current.paid, previous.paid) : null"
          :previous="loaded && previous.paid ? money(previous.paid) : ''"
          :trend="days.map((day) => day.paid)"
          :loading="!loaded && !error"
          hint="Winning tickets claimed and paid in your shop"
        >
          <span class="tabular">{{ count(current.paidCount) }} {{ current.paidCount === 1 ? 'ticket' : 'tickets' }} paid</span>
        </StatTile>
        <StatTile
          label="Net balance"
          :value="money(current.balance)"
          :change="loaded ? change(current.balance, previous.balance) : null"
          :previous="loaded && previous.balance ? money(previous.balance) : ''"
          :trend="days.map((day) => day.balance)"
          :loading="!loaded && !error"
          hint="Net sales less commission and winnings paid"
        >
          <span>Net sales less commission and winnings paid</span>
        </StatTile>
      </div>
    </div>

    <!-- Trend, and where the sales came from -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3" :class="dimmed">
      <section v-if="!noFigures" class="card p-5 sm:p-6 xl:col-span-2">
        <h2 class="text-lg font-bold text-navy-700 dark:text-white">Net sales and winnings paid by day</h2>
        <p class="mb-4 mt-0.5 text-sm text-navy-400">{{ trendIsLast7Days ? 'The last 7 days, for context' : 'Each day of the selected period' }}</p>
        <span v-if="!loaded" class="skeleton h-[280px] w-full"></span>
        <TrendChart
          v-else
          :labels="trend.map((day) => shortDay(day.date))"
          :series="[
            { name: 'Net sales', values: trend.map((day) => day.netSales) },
            { name: 'Winnings paid', values: trend.map((day) => day.paid) },
          ]"
          :format-value="money"
          :format-axis="compactMoney"
        />
      </section>

      <section class="card flex flex-col gap-5 p-5 sm:p-6">
        <div>
          <h2 class="text-lg font-bold text-navy-700 dark:text-white">Sales by product</h2>
          <p class="mt-0.5 text-sm text-navy-400">Gross sales in the selected period</p>
        </div>

        <span v-if="cashiersLoading && !breakdown" class="skeleton h-24 w-full"></span>
        <p v-else-if="cashiersError" class="text-sm font-medium text-navy-400">{{ cashiersError }}</p>
        <template v-else-if="productTotal > 0">
          <!-- One hue in two strengths: a share of the same thing, not two different things -->
          <div class="flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" :aria-label="`5/90 ${percent(breakdown!.lotto590Sales, productTotal, 0)}, Accumulator ${percent(breakdown!.accumulatorSales, productTotal, 0)}`">
            <div class="bg-chart-1" :style="{ width: `${(breakdown!.lotto590Sales / productTotal) * 100}%` }"></div>
            <div class="bg-chart-1/40" :style="{ width: `${(breakdown!.accumulatorSales / productTotal) * 100}%` }"></div>
          </div>
          <dl class="space-y-2 text-sm">
            <div class="flex items-center justify-between gap-3">
              <dt class="flex items-center gap-2 font-semibold text-navy-600 dark:text-navy-200"><span class="size-2.5 rounded-sm bg-chart-1" aria-hidden="true"></span>5/90</dt>
              <dd class="tabular font-bold text-navy-700 dark:text-white">{{ money(breakdown!.lotto590Sales) }} <span class="font-medium text-navy-400">· {{ percent(breakdown!.lotto590Sales, productTotal, 0) }}</span></dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="flex items-center gap-2 font-semibold text-navy-600 dark:text-navy-200"><span class="size-2.5 rounded-sm bg-chart-1/40" aria-hidden="true"></span>Accumulator</dt>
              <dd class="tabular font-bold text-navy-700 dark:text-white">{{ money(breakdown!.accumulatorSales) }} <span class="font-medium text-navy-400">· {{ percent(breakdown!.accumulatorSales, productTotal, 0) }}</span></dd>
            </div>
          </dl>
        </template>
        <p v-else class="text-sm font-medium text-navy-400">No sales in this period.</p>

        <dl class="mt-auto space-y-3 border-t border-gray-100 pt-4 text-sm dark:border-navy-700">
          <div v-for="ratio in ratios" :key="ratio.label" class="flex items-baseline justify-between gap-3" :title="ratio.hint">
            <dt class="font-semibold text-navy-500">{{ ratio.label }}</dt>
            <dd class="tabular font-bold text-navy-700 dark:text-white">{{ ratio.value }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <!-- Who and what sold -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2" :class="dimmed">
      <section class="card flex flex-col p-5 sm:p-6">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-navy-700 dark:text-white">Top cashiers</h2>
            <p class="mt-0.5 text-sm text-navy-400">By net sales in the selected period</p>
          </div>
          <RouterLink to="/dashboard/cashier-summary-report" class="btn-quiet shrink-0 py-2">All cashiers</RouterLink>
        </div>

        <div v-if="cashiersLoading && !breakdown" class="space-y-4" aria-hidden="true">
          <span v-for="n in 4" :key="n" class="skeleton h-9 w-full"></span>
        </div>
        <p v-else-if="cashiersError" class="py-6 text-center text-sm font-medium text-navy-400">{{ cashiersError }}</p>
        <BarList v-else-if="topCashiers.length > 0" :items="topCashiers" />
        <p v-else class="py-6 text-center text-sm font-medium text-navy-400">No cashier has sold in this period.</p>

        <p v-if="breakdown && breakdown.idle.length > 0 && topCashiers.length > 0" class="mt-5 rounded-2xl bg-navy-50 p-3 text-sm text-navy-500 dark:bg-navy-900">
          <span class="font-bold text-navy-700 dark:text-white">{{ breakdown.idle.length }} {{ breakdown.idle.length === 1 ? 'cashier has' : 'cashiers have' }} not sold in this period:</span>
          {{ idleNames }}
        </p>
      </section>

      <section class="card flex flex-col p-5 sm:p-6">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-navy-700 dark:text-white">Top games</h2>
            <p class="mt-0.5 text-sm text-navy-400">By net sales in the selected period</p>
          </div>
          <RouterLink to="/dashboard/game-statistics" class="btn-quiet shrink-0 py-2">All games</RouterLink>
        </div>

        <div v-if="gamesLoading && games.length === 0" class="space-y-4" aria-hidden="true">
          <span v-for="n in 4" :key="n" class="skeleton h-9 w-full"></span>
        </div>
        <p v-else-if="gamesError" class="py-6 text-center text-sm font-medium text-navy-400">{{ gamesError }}</p>
        <BarList v-else-if="topGames.length > 0" :items="topGames" />
        <p v-else class="py-6 text-center text-sm font-medium text-navy-400">No game sales in this period.</p>
      </section>
    </div>

    <!-- Today's draws -->
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section class="card p-5 sm:p-6">
        <h2 class="text-lg font-bold text-navy-700 dark:text-white">Today's games</h2>
        <p class="mb-4 mt-0.5 text-sm text-navy-400">{{ openGameCount === 0 ? 'No game is open right now' : openGameCount === 1 ? '1 game is open for sales' : `${openGameCount} games are open for sales` }}</p>

        <div v-if="gamesTodayLoading" class="space-y-3" aria-hidden="true">
          <span v-for="n in 4" :key="n" class="skeleton h-12 w-full"></span>
        </div>
        <p v-else-if="todaysGames.length === 0" class="py-6 text-center text-sm font-medium text-navy-400">No games are scheduled for today.</p>
        <ul v-else class="max-h-[22rem] divide-y divide-gray-100 overflow-y-auto dark:divide-navy-700">
          <li v-for="game in todaysGames" :key="game.gameId" class="flex items-center gap-3 py-3" :class="game.state === 'closed' ? 'opacity-60' : ''">
            <div class="min-w-0 flex-1">
              <p class="truncate font-bold text-navy-700 dark:text-white">{{ game.gameName }} <span v-if="game.gameCode" class="font-medium text-navy-400">· {{ game.gameCode }}</span></p>
              <p class="tabular text-sm text-navy-400">{{ clockTime(game.startDateTime) }} to {{ clockTime(game.endDateTime) }}</p>
            </div>
            <span class="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold" :class="GAME_PILL[game.state as GameState]">{{ game.status }}</span>
          </li>
        </ul>
      </section>

      <section class="card p-5 sm:p-6">
        <h2 class="text-lg font-bold text-navy-700 dark:text-white">Latest results</h2>
        <p class="mb-4 mt-0.5 text-sm text-navy-400">Draws completed today</p>

        <div v-if="resultsLoading" class="space-y-3" aria-hidden="true">
          <span v-for="n in 3" :key="n" class="skeleton h-20 w-full"></span>
        </div>
        <p v-else-if="results.length === 0" class="py-6 text-center text-sm font-medium text-navy-400">No results yet today.</p>
        <ul v-else class="max-h-[22rem] space-y-3 overflow-y-auto">
          <li v-for="(item, index) in results" :key="index" class="rounded-2xl bg-navy-50 p-3.5 dark:bg-navy-900">
            <div class="flex items-baseline justify-between gap-3">
              <p class="truncate font-bold text-navy-700 dark:text-white">{{ item.gameName }}</p>
              <p v-if="item.endDateTime" class="tabular shrink-0 text-xs text-navy-400">Drawn {{ clockTime(item.endDateTime) }}</p>
            </div>
            <div class="mt-2.5 space-y-2">
              <div class="flex items-center gap-3">
                <span class="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-navy-500">Winning</span>
                <div class="flex gap-1.5">
                  <span v-for="i in 5" :key="`w-${i}`" class="tabular flex size-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white sm:size-9">{{ item.result?.[`winningBall${i}`] }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-navy-500">Machine</span>
                <div class="flex gap-1.5">
                  <span v-for="i in 5" :key="`m-${i}`" class="tabular flex size-8 items-center justify-center rounded-full border border-navy-200 bg-white text-sm font-bold text-navy-700 dark:border-navy-600 dark:bg-navy-800 dark:text-white sm:size-9">{{ item.result?.[`machineBall${i}`] }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- The same figures as the chart, day by day -->
    <section v-if="!noFigures" class="card p-5 sm:p-6" :class="dimmed">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-navy-700 dark:text-white">Daily figures</h2>
          <p class="mt-0.5 text-sm text-navy-400">{{ trendIsLast7Days ? 'The last 7 days, newest first' : 'Each day of the selected period, newest first' }}</p>
        </div>
        <RouterLink to="/dashboard/shop-statistics" class="btn-quiet shrink-0 py-2">Shop statistics</RouterLink>
      </div>
      <span v-if="!loaded" class="skeleton h-40 w-full"></span>
      <div v-else class="max-h-[26rem] overflow-auto">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="sticky top-0 bg-white dark:bg-navy-800">
            <tr class="border-b border-navy-200 text-xs font-bold uppercase tracking-wider text-navy-400 dark:border-navy-600">
              <th class="py-2.5 pr-4">Day</th>
              <th class="px-4 py-2.5 text-right">Gross sales</th>
              <th class="px-4 py-2.5 text-right">Cancelled</th>
              <th class="px-4 py-2.5 text-right">Net sales</th>
              <th class="px-4 py-2.5 text-right">Commission</th>
              <th class="px-4 py-2.5 text-right">Winnings paid</th>
              <th class="py-2.5 pl-4 text-right">Net balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-navy-700">
            <tr v-for="day in [...trend].reverse()" :key="day.date.getTime()">
              <td class="whitespace-nowrap py-3 pr-4 font-semibold text-navy-700 dark:text-white">{{ weekDay(day.date) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right text-navy-500">{{ money(day.sales) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right text-navy-500">{{ money(day.cancelled) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right font-bold text-navy-700 dark:text-white">{{ money(day.netSales) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right text-navy-500">{{ money(day.commission) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right text-navy-500">{{ money(day.paid) }}</td>
              <td class="whitespace-nowrap py-3 pl-4 text-right font-bold" :class="day.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-navy-700 dark:text-white'">{{ money(day.balance) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- What cashiers have been doing -->
    <section class="card p-5 sm:p-6">
      <h2 class="text-lg font-bold text-navy-700 dark:text-white">Recent shop activity</h2>
      <p class="mb-4 mt-0.5 text-sm text-navy-400">The latest actions by your cashiers</p>

      <div v-if="activitiesLoading" class="space-y-3" aria-hidden="true">
        <span v-for="n in 4" :key="n" class="skeleton h-10 w-full"></span>
      </div>
      <p v-else-if="activities.length === 0" class="py-6 text-center text-sm font-medium text-navy-400">No activity recorded yet.</p>
      <ul v-else class="divide-y divide-gray-100 dark:divide-navy-700">
        <li v-for="(activity, index) in activities" :key="activity.id ?? index" class="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
          <div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
            <span class="font-bold text-navy-700 dark:text-white">{{ activity.userName }}</span>
            <span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{{ activity.action }}</span>
            <span class="min-w-0 break-words text-sm text-navy-500">{{ activity.details }}</span>
          </div>
          <time class="tabular shrink-0 text-xs text-navy-400">{{ dayAndTime(activity.dateCreated) }}</time>
        </li>
      </ul>
    </section>

    <!-- Payout Modal -->
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:title>
        <h5 class="text-xl font-bold text-navy-700 dark:text-white">Request a payout</h5>
      </template>

      <template v-slot:description>
        <form id="payout-form" class="mt-4 space-y-4" novalidate @submit.prevent="submitPayout">
          <div class="flex items-center justify-between rounded-2xl bg-navy-50 p-4 dark:bg-navy-900">
            <span class="text-sm font-medium text-navy-400">Wallet balance</span>
            <span class="tabular text-lg font-bold text-navy-700 dark:text-white">{{ moneyExact(walletBalance) }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="payout-amount" class="text-sm font-bold text-navy-700 dark:text-navy-200">Amount</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-navy-400" aria-hidden="true">₦</span>
              <input
                id="payout-amount"
                v-model.number="amount"
                type="number"
                inputmode="decimal"
                min="0"
                step="any"
                placeholder="0.00"
                class="tabular w-full rounded-2xl border border-navy-200 bg-white py-3.5 pl-10 pr-4 font-bold text-navy-700 outline-none transition-colors focus:border-brand-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
                :aria-invalid="!!payoutError"
                aria-describedby="payout-error"
              />
            </div>
            <p v-if="payoutError" id="payout-error" class="text-sm font-semibold text-red-600 dark:text-red-400" role="alert">{{ payoutError }}</p>
          </div>
        </form>
      </template>

      <template v-slot:buttons>
        <div class="flex w-full gap-3">
          <button type="button" class="btn-quiet flex-1 py-3.5" @click="closeModal">Cancel</button>
          <button type="submit" form="payout-form" class="btn-primary flex-1 py-3.5" :disabled="processing">
            {{ processing ? 'Sending...' : 'Send request' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '../stores/auth'
import Modal from '@/components/Modal.vue'
import AppIcon from '@/components/AppIcon.vue'
import StatTile from '@/components/ui/StatTile.vue'
import TrendChart from '@/components/ui/TrendChart.vue'
import BarList from '@/components/ui/BarList.vue'
import type { BarItem } from '@/components/ui/BarList.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import { addDays, change, clockTime, compactMoney, count, dayAndTime, duration, money, moneyExact, percent, shortDay, weekDay } from '@/services/format'
import { PERIODS, previousRangeFor, rangeFor } from '@/services/periods'
import type { DateRange, PeriodKey } from '@/services/periods'
import { NO_TOTALS, fetchCashiers, fetchDays, fetchGames, sumDays } from '@/services/shopStats'
import type { CashierBreakdown, DayRow, GameRow, Totals } from '@/services/shopStats'

const snackbar = useSnackbar()
const authStore = useAuthStore()

const shopId = Number(authStore.user.shopId)
const shopCode = String(authStore.user.shopCode ?? '')

// ---- The selected period ----

const period = ref<PeriodKey>('today')
const range = ref<DateRange>(rangeFor('today'))

const current = ref<Totals>(NO_TOTALS)
const previous = ref<Totals>(NO_TOTALS)
/** One row per day of the period */
const days = ref<DayRow[]>([])
/** What the chart and the daily table show: the period, or the last 7 days when the period is a single day */
const trend = ref<DayRow[]>([])
const trendIsLast7Days = ref(true)

const loading = ref(true)
const loaded = ref(false)
const error = ref('')
const updatedAt = ref<Date | null>(null)

const breakdown = ref<CashierBreakdown | null>(null)
const cashiersLoading = ref(true)
const cashiersError = ref('')
const games = ref<GameRow[]>([])
const gamesLoading = ref(true)
const gamesError = ref('')

// The first load failed, so there is nothing true to put in the tiles, the chart or the daily table
const noFigures = computed(() => !!error.value && !loaded.value)

// Figures from the previous load stay in place, stepped back, while the next ones arrive
const dimmed = computed(() => (loading.value && loaded.value ? 'opacity-60 transition-opacity' : 'transition-opacity'))

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
})

const longDate = (date: Date) => date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const periodText = computed(() => {
  if (period.value === 'today') return longDate(range.value.from)
  const from = range.value.from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const to = range.value.to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${from} to ${to}`
})
const comparedWith = computed(() => PERIODS.find((option) => option.key === period.value)?.comparedWith ?? '')

const ratios = computed(() => [
  { label: 'Payout ratio', value: percent(current.value.paid, current.value.netSales), hint: 'Winnings paid as a share of net sales' },
  { label: 'Commission rate', value: percent(current.value.commission, current.value.netSales), hint: 'Commission as a share of net sales' },
  { label: 'Cancellation rate', value: percent(current.value.cancelled, current.value.sales), hint: 'Cancelled stake as a share of gross sales' },
])

const productTotal = computed(() => (breakdown.value ? breakdown.value.lotto590Sales + breakdown.value.accumulatorSales : 0))

const topCashiers = computed<BarItem[]>(() =>
  (breakdown.value?.selling ?? []).slice(0, 5).map((cashier) => ({
    label: cashier.name,
    value: cashier.netSales,
    display: money(cashier.netSales),
    note: `Commission ${money(cashier.commission)} · winnings paid ${money(cashier.paid)}`,
  }))
)
const idleNames = computed(() => {
  const names = (breakdown.value?.idle ?? []).map((cashier) => cashier.name)
  return names.length > 4 ? `${names.slice(0, 4).join(', ')} and ${names.length - 4} more` : names.join(', ')
})

const topGames = computed<BarItem[]>(() =>
  games.value.slice(0, 5).map((game) => ({
    label: game.name,
    value: game.netSales,
    display: money(game.netSales),
    note: `Winnings paid ${money(game.paid)}`,
  }))
)

/** Only the answer to the latest request is used, so a slow earlier one cannot overwrite it */
let requestId = 0

const reasonFor = (err: any, fallback: string): string => {
  if (err?.response?.status === 403) return 'Your account does not have access to these figures.'
  if (err?.request && !err?.response) return 'Could not reach the server. Check your internet connection.'
  return fallback
}

async function loadPeriod() {
  const request = ++requestId
  const selected = rangeFor(period.value)
  const before = previousRangeFor(period.value, selected)
  const single = period.value === 'today'

  range.value = selected
  loading.value = true
  error.value = ''
  loadCashiers(request, selected)
  loadGames(request, selected)

  try {
    const [currentDays, previousDays, lastSeven] = await Promise.all([
      fetchDays(shopId, selected),
      fetchDays(shopId, before),
      single ? fetchDays(shopId, { from: addDays(selected.to, -6), to: selected.to }) : Promise.resolve(null),
    ])
    if (request !== requestId) return

    days.value = currentDays
    current.value = sumDays(currentDays)
    previous.value = sumDays(previousDays)
    trend.value = lastSeven ?? currentDays
    trendIsLast7Days.value = single
    loaded.value = true
    updatedAt.value = new Date()
  } catch (err) {
    if (request !== requestId) return
    console.error('Failed to load dashboard figures', err)
    error.value = reasonFor(err, 'The sales figures could not be loaded.')
  } finally {
    if (request === requestId) loading.value = false
  }
}

async function loadCashiers(request: number, selected: DateRange) {
  cashiersLoading.value = true
  cashiersError.value = ''
  try {
    const result = await fetchCashiers(shopId, selected)
    if (request !== requestId) return
    breakdown.value = result
  } catch (err) {
    if (request !== requestId) return
    console.error('Failed to load cashier figures', err)
    breakdown.value = null
    cashiersError.value = reasonFor(err, 'Cashier figures could not be loaded.')
  } finally {
    if (request === requestId) cashiersLoading.value = false
  }
}

async function loadGames(request: number, selected: DateRange) {
  gamesLoading.value = true
  gamesError.value = ''
  try {
    const result = await fetchGames(shopCode, selected)
    if (request !== requestId) return
    games.value = result
  } catch (err) {
    if (request !== requestId) return
    console.error('Failed to load game figures', err)
    games.value = []
    gamesError.value = reasonFor(err, 'Game figures could not be loaded.')
  } finally {
    if (request === requestId) gamesLoading.value = false
  }
}

watch(period, loadPeriod)

// ---- Wallet ----

const walletData = ref<any>({})
const walletLoaded = ref(false)
const walletBalance = computed(() => Number(walletData.value?.walletBalance) || 0)
const accountNumber = computed(() => walletData.value?.virtualAccountNumber || authStore.user.virtualAccountNumber || '')
const accountBank = computed(() => walletData.value?.virtualAccountBank || authStore.user.virtualAccountBank || '')

const fetchWalletBalance = async () => {
  try {
    const res = await axios.get(`Retail/shop/GetShopById?ShopId=${shopId}`)
    walletData.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    walletLoaded.value = true
  }
}

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
const copyAccount = async () => {
  try {
    await navigator.clipboard.writeText(String(accountNumber.value))
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch {
    snackbar.add({ type: 'error', text: 'Could not copy. Press and hold the number to copy it.' })
  }
}

// ---- Payout request ----

const showModal = ref(false)
const amount = ref<number | ''>('')
const processing = ref(false)
const payoutError = ref('')

const closeModal = () => {
  amount.value = ''
  payoutError.value = ''
  showModal.value = false
}

const submitPayout = async () => {
  const value = Number(amount.value)
  if (!value || value <= 0) {
    payoutError.value = 'Enter the amount you want paid out.'
    return
  }
  if (walletLoaded.value && value > walletBalance.value) {
    payoutError.value = `That is more than your wallet balance of ${moneyExact(walletBalance.value)}.`
    return
  }
  payoutError.value = ''
  try {
    processing.value = true
    const res = await axios.post(`/RetailFinance/payment/PayoutRequest`, { amount: value })
    if (res.status === 200) {
      snackbar.add({ type: 'success', text: `Payout Request Successful` })
      closeModal()
      fetchWalletBalance()
    }
  } catch (err: any) {
    // The API answers with either { message } or a plain sentence
    const fromServer = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : '')
    payoutError.value = fromServer || `The request could not be sent: ${err.message}`
  } finally {
    processing.value = false
  }
}

// ---- Today's games and results ----

type GameState = 'open' | 'upcoming' | 'closed'
const GAME_PILL: Record<GameState, string> = {
  open: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  upcoming: 'bg-navy-100 text-navy-500 dark:bg-navy-700',
  closed: 'bg-navy-100 text-navy-400 dark:bg-navy-700',
}

const dailyGames = ref<any[]>([])
const gamesTodayLoading = ref(true)
/** Moves on every half minute so "closes in 12 min" stays true without a reload */
const now = ref(Date.now())
let clock: ReturnType<typeof setInterval> | undefined

const todaysGames = computed(() => {
  const order: Record<GameState, number> = { open: 0, upcoming: 1, closed: 2 }
  return dailyGames.value
    .map((game) => {
      const start = new Date(game.startDateTime).getTime()
      const end = new Date(game.endDateTime).getTime()
      const state: GameState = now.value >= end ? 'closed' : now.value < start ? 'upcoming' : 'open'
      const status = state === 'open' ? `Closes in ${duration(end - now.value)}` : state === 'upcoming' ? `Opens ${clockTime(game.startDateTime)}` : 'Closed'
      return { ...game, state, status, start, end }
    })
    .sort((a, b) => order[a.state as GameState] - order[b.state as GameState] || (a.state === 'closed' ? b.end - a.end : a.end - b.end))
})
const openGameCount = computed(() => todaysGames.value.filter((game) => game.state === 'open').length)

const fetchDailyGames = async () => {
  try {
    const res = await axios.get(`dailygame/get`)
    dailyGames.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error(err)
  } finally {
    gamesTodayLoading.value = false
  }
}

const results = ref<any[]>([])
const resultsLoading = ref(true)

const fetchGamesResult = async () => {
  const today = rangeFor('today').from
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  try {
    const res = await axios.get(`DailyGameResult/AllGamesPerPeriodPerGame?StartDate=${day}&EndDate=${day}`)
    results.value = Array.isArray(res.data?.data) ? res.data.data : []
  } catch (err) {
    console.error(err)
  } finally {
    resultsLoading.value = false
  }
}

// ---- Shop activity and terminals ----

const activities = ref<any[]>([])
const activitiesLoading = ref(true)

const fetchActivities = async () => {
  try {
    const res = await axios.get(`Retail/shop/${shopId}/activities?Page=1&PageSize=10`)
    activities.value = Array.isArray(res.data?.data) ? res.data.data : []
  } catch (err) {
    console.error(err)
  } finally {
    activitiesLoading.value = false
  }
}

const inoperativeTerminals = ref<any[]>([])

const fetchInoperativeTerminals = async () => {
  try {
    const res = await axios.get(`report/terminals/inoperative-warning?shopId=${shopId}&days=7&threshold=5000`)
    inoperativeTerminals.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadPeriod()
  fetchWalletBalance()
  fetchDailyGames()
  fetchGamesResult()
  fetchActivities()
  fetchInoperativeTerminals()
  clock = setInterval(() => { now.value = Date.now() }, 30000)
})

onBeforeUnmount(() => {
  requestId++
  clearInterval(clock)
  clearTimeout(copiedTimer)
})
</script>
