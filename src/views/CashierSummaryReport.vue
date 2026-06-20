<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Cashier Summary Report</h2>
          <p class="text-navy-400 font-medium mt-1">Aggregated cashier performance over a date range</p>
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
            @click="load"
            :disabled="loading || !startDate || !endDate"
            class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            {{ loading ? 'Loading...' : 'Generate' }}
          </button>
          <router-link
            to="/dashboard/commission-calculator"
            class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.684 4.5 4.819V21a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V4.82c0-1.136-.806-2.12-1.907-2.248A48.494 48.494 0 0 0 12 2.25Z" />
            </svg>
            Comm. Calc
          </router-link>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin size-10 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <template v-else-if="loaded">
      <!-- Summary cards row 1 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-navy-700">
          <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Total Sales</p>
          <p class="text-xl font-bold text-navy-700 dark:text-white mt-1">₦ {{ fmt(stats.totalSales) }}</p>
        </div>
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-navy-700">
          <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Total Claimed</p>
          <p class="text-xl font-bold text-navy-700 dark:text-white mt-1">₦ {{ fmt(stats.totalPaid) }}</p>
        </div>
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-navy-700">
          <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Total Commission</p>
          <p class="text-xl font-bold text-navy-700 dark:text-white mt-1">₦ {{ fmt(stats.totalCommission) }}</p>
        </div>
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-navy-700">
          <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Net Balance</p>
          <p :class="stats.totalNetBalance < 0 ? 'text-red-500' : 'text-green-500'" class="text-xl font-bold mt-1">
            ₦ {{ fmt(stats.totalNetBalance) }}
          </p>
        </div>
      </div>

      <!-- Summary cards row 2: game-type commissions -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-brand-100 dark:border-brand-500/20">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold px-1.5 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-md uppercase">5/90</span>
            <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Sales</p>
          </div>
          <p class="text-xl font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalLotto590Sales) }}</p>
        </div>
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-brand-100 dark:border-brand-500/20">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold px-1.5 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-md uppercase">5/90</span>
            <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Commission</p>
          </div>
          <p class="text-xl font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalLotto590Commission) }}</p>
        </div>
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-purple-100 dark:border-purple-500/20">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md uppercase">Accum</span>
            <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Sales</p>
          </div>
          <p class="text-xl font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalAccumulatorSales) }}</p>
        </div>
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-purple-100 dark:border-purple-500/20">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md uppercase">Accum</span>
            <p class="text-xs font-semibold text-navy-400 uppercase tracking-wider">Commission</p>
          </div>
          <p class="text-xl font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalAccumulatorCommission) }}</p>
        </div>
      </div>

      <!-- Cashier counts -->
      <div class="flex flex-wrap items-center gap-3">
        <span class="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-bold rounded-xl">
          <span class="size-2 rounded-full bg-green-500"></span>
          {{ stats.activeCashierCount }} cashier{{ stats.activeCashierCount !== 1 ? 's' : '' }} with sales
        </span>
        <span v-if="stats.noSalesCashierCount > 0" class="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-bold rounded-xl">
          <span class="size-2 rounded-full bg-amber-500"></span>
          {{ stats.noSalesCashierCount }} cashier{{ stats.noSalesCashierCount !== 1 ? 's' : '' }} with no sales
        </span>
      </div>

      <!-- Mobile card list -->
      <div v-if="items.length" class="md:hidden space-y-4">
        <div
          v-for="row in items"
          :key="row.cashierId"
          class="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-700 overflow-hidden"
        >
          <!-- Card header -->
          <div class="px-4 pt-4 pb-3 flex items-start justify-between">
            <div>
              <p class="font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
              <p class="text-xs text-navy-400 mt-0.5">{{ row.cashierName }}</p>
            </div>
            <span
              :class="row.netBalance < 0
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'"
              class="text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap"
            >
              ₦ {{ fmt(row.netBalance) }}
            </span>
          </div>
          <!-- Overall stats -->
          <div class="grid grid-cols-2 gap-px bg-gray-100 dark:bg-navy-700 border-t border-gray-100 dark:border-navy-700">
            <div class="bg-white dark:bg-navy-800 p-3">
              <p class="text-[10px] text-navy-400 uppercase font-semibold">Sales</p>
              <p class="text-sm font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(row.sales) }}</p>
            </div>
            <div class="bg-white dark:bg-navy-800 p-3">
              <p class="text-[10px] text-navy-400 uppercase font-semibold">Cancelled</p>
              <p class="text-sm font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(row.cancelled) }}</p>
            </div>
            <div class="bg-white dark:bg-navy-800 p-3">
              <p class="text-[10px] text-navy-400 uppercase font-semibold">Commission</p>
              <p class="text-sm font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(row.commission) }}</p>
            </div>
            <div class="bg-white dark:bg-navy-800 p-3">
              <p class="text-[10px] text-navy-400 uppercase font-semibold">Claimed</p>
              <p class="text-sm font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(row.paid) }}</p>
            </div>
          </div>
          <!-- Game breakdown -->
          <div class="px-4 py-3 space-y-2.5">
            <div class="space-y-1">
              <span class="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-lg">5/90</span>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-navy-500 dark:text-navy-400 pl-1">
                <span>Sales: <span class="font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.lotto590Sales) }}</span></span>
                <span>Comm: <span class="font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.lotto590Commission) }}</span></span>
                <span>Claimed: <span class="font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.lotto590Winnings) }}</span></span>
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-lg">Accum</span>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-navy-500 dark:text-navy-400 pl-1">
                <span>Sales: <span class="font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.accumulatorSales) }}</span></span>
                <span>Comm: <span class="font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.accumulatorCommission) }}</span></span>
                <span>Claimed: <span class="font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.accumulatorWinnings) }}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <div class="p-5 border-b border-gray-100 dark:border-navy-700 flex items-center justify-between">
          <h3 class="font-bold text-navy-700 dark:text-white">Cashier Breakdown</h3>
          <span class="text-sm text-navy-400">{{ startDate }} → {{ endDate }}</span>
        </div>
        <div v-if="!items.length" class="py-16 text-center text-navy-400 font-medium">
          No sales data for the selected period.
        </div>
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-navy-900/50 text-left">
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap">Cashier</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Sales</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Cancelled</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Net Sales</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Commission</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Claimed</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in items" :key="row.cashierId">
              <!-- Main cashier row -->
              <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors border-t border-gray-100 dark:border-navy-700">
                <td class="px-4 py-3">
                  <p class="font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
                  <p class="text-xs text-navy-400">{{ row.cashierName }}</p>
                </td>
                <td class="px-4 py-3 text-right font-medium text-navy-700 dark:text-navy-200">₦ {{ fmt(row.sales) }}</td>
                <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.cancelled) }}</td>
                <td class="px-4 py-3 text-right font-medium text-navy-700 dark:text-navy-200">₦ {{ fmt(row.netSales) }}</td>
                <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.commission) }}</td>
                <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.paid) }}</td>
                <td class="px-4 py-3 text-right font-bold" :class="row.netBalance < 0 ? 'text-red-500' : 'text-green-500'">
                  ₦ {{ fmt(row.netBalance) }}
                </td>
              </tr>
              <!-- 5/90 sub-row -->
              <tr class="bg-brand-50/40 dark:bg-brand-500/5">
                <td class="pl-8 pr-4 py-2">
                  <span class="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    <span class="text-brand-300 dark:text-brand-600">└</span>
                    <span class="px-1.5 py-0.5 bg-brand-100 dark:bg-brand-900/30 rounded">5/90</span>
                  </span>
                </td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Sales) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Commission) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Winnings) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
              </tr>
              <!-- Accumulator sub-row -->
              <tr class="bg-purple-50/40 dark:bg-purple-500/5">
                <td class="pl-8 pr-4 py-2">
                  <span class="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <span class="text-purple-300 dark:text-purple-600">└</span>
                    <span class="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded">Accum</span>
                  </span>
                </td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorSales) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorCommission) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorWinnings) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr class="bg-brand-50 dark:bg-navy-900/60 border-t-2 border-brand-100 dark:border-brand-500/20">
              <td class="px-4 py-3 font-bold text-navy-700 dark:text-white">TOTAL</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalSales) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalCancelled) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalSales - stats.totalCancelled) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalCommission) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalPaid) }}</td>
              <td class="px-4 py-3 text-right font-bold" :class="stats.totalNetBalance < 0 ? 'text-red-500' : 'text-green-500'">
                ₦ {{ fmt(stats.totalNetBalance) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- No-sales cashiers -->
      <div v-if="noSalesItems.length" class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl overflow-hidden">
        <div class="p-5 border-b border-amber-200 dark:border-amber-500/20 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-amber-500 shrink-0">
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
                <th class="px-5 py-3 font-bold text-amber-600 dark:text-amber-400">Username</th>
                <th class="px-5 py-3 font-bold text-amber-600 dark:text-amber-400">Name</th>
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
    </template>

    <!-- Empty state (before first load) -->
    <div v-else class="bg-white dark:bg-navy-800 rounded-3xl p-16 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 bg-brand-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-brand-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      </div>
      <p class="text-lg font-bold text-navy-700 dark:text-white">Loading report...</p>
      <p class="text-navy-400 font-medium mt-1">All cashiers will be summarised over the selected period</p>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '@/stores/auth'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { format } from 'date-fns'
import { convertNumber } from '@/services/convertNumber'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const shopId = Number(authStore.user?.shopId ?? 0)

const todayStr = format(new Date(), 'yyyy-MM-dd')
const tomorrowStr = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')

const date = ref([todayStr, tomorrowStr])
const startDate = ref(todayStr)
const endDate = ref(tomorrowStr)
const loading = ref(false)
const loaded = ref(false)
const items = ref([])
const noSalesItems = ref([])
const stats = reactive({
  totalSales: 0,
  totalCancelled: 0,
  totalPaid: 0,
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

const fmt = (val) => convertNumber(val ?? 0)

const onDateChange = (val) => {
  if (val && val[0] && val[1]) {
    startDate.value = val[0]
    endDate.value = val[1]
  }
}

const load = async () => {
  if (!startDate.value || !endDate.value) {
    snackbar.add({ type: 'warning', text: 'Please select a date range first' })
    return
  }
  try {
    loading.value = true
    const res = await axios.get(
      `report/cashier/summary?shopId=${shopId}&fromDate=${startDate.value}&toDate=${endDate.value}`
    )
    const data = res.data
    items.value = data.items ?? []
    noSalesItems.value = data.noSalesItems ?? []
    Object.assign(stats, {
      totalSales: data.totalSales ?? 0,
      totalCancelled: data.totalCancelled ?? 0,
      totalPaid: data.totalPaid ?? 0,
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
    loaded.value = true
  } catch (err) {
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
