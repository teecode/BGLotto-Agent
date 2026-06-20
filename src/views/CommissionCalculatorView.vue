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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Cashier Summary
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <!-- Date -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Date</label>
          <date-picker
            v-model:value="calcDate"
            type="date"
            placeholder="Select date"
            value-type="format"
            format="YYYY-MM-DD"
            class="custom-datepicker w-full"
          />
        </div>

        <!-- 5/90 cashier commission -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">5/90 Cashier Commission</label>
          <div class="relative">
            <input
              v-model.number="rate590Cashier"
              type="number"
              min="0"
              max="35"
              step="0.5"
              class="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-navy-900/50 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 font-bold text-sm">%</span>
          </div>
          <p class="text-xs text-navy-400">
            Principal agent:
            <span class="font-bold text-brand-500">{{ clamp(35 - rate590Cashier, 0, 35).toFixed(1) }}%</span>
            <span class="text-navy-300 dark:text-navy-600"> (of 35% total)</span>
          </p>
        </div>

        <!-- Accumulator cashier commission -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Accumulator Cashier Commission</label>
          <div class="relative">
            <input
              v-model.number="rateAccumCashier"
              type="number"
              min="0"
              max="10"
              step="0.5"
              class="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-navy-900/50 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 font-bold text-sm">%</span>
          </div>
          <p class="text-xs text-navy-400">
            Principal agent:
            <span class="font-bold text-purple-500">{{ clamp(10 - rateAccumCashier, 0, 10).toFixed(1) }}%</span>
            <span class="text-navy-300 dark:text-navy-600"> (of 10% total)</span>
          </p>
        </div>
      </div>

      <div class="mt-5">
        <button
          @click="calculate"
          :disabled="calcLoading || !calcDate"
          class="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <svg v-if="calcLoading" class="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.684 4.5 4.819V21a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V4.82c0-1.136-.806-2.12-1.907-2.248A48.494 48.494 0 0 0 12 2.25Z" />
          </svg>
          {{ calcLoading ? 'Calculating...' : 'Calculate' }}
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="calcLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin size-10 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <template v-else-if="calcLoaded">
      <!-- Aggregate summary -->
      <div class="space-y-3">
        <p class="text-xs font-bold text-navy-400 uppercase tracking-wider px-1">For {{ calcDate }}</p>

        <!-- 5/90 commission summary -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-brand-100 dark:border-brand-500/20">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-lg uppercase">5/90</span>
            <span class="text-sm font-bold text-navy-700 dark:text-white">Commission Split</span>
            <span class="text-xs text-navy-400">(35% total rate)</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-xs text-navy-400 font-semibold uppercase tracking-wider">Total 5/90 Sales</p>
              <p class="text-lg font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(totals.lotto590Sales) }}</p>
            </div>
            <div>
              <p class="text-xs text-navy-400 font-semibold uppercase tracking-wider">Commission Generated</p>
              <p class="text-lg font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(totals.lotto590TotalComm) }}</p>
            </div>
            <div class="col-span-2 sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-2">
              <div class="bg-green-50 dark:bg-green-900/10 rounded-xl p-3">
                <p class="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Cashiers ({{ rate590Cashier }}%)</p>
                <p class="text-base font-bold text-green-700 dark:text-green-400 mt-0.5">₦ {{ fmt(totals.lotto590CashierComm) }}</p>
              </div>
              <div class="bg-brand-50 dark:bg-brand-900/10 rounded-xl p-3">
                <p class="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase">Principal ({{ clamp(35 - rate590Cashier, 0, 35).toFixed(1) }}%)</p>
                <p class="text-base font-bold text-brand-600 dark:text-brand-400 mt-0.5">₦ {{ fmt(totals.lotto590PrincipalComm) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Accumulator commission summary -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-purple-100 dark:border-purple-500/20">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg uppercase">Accum</span>
            <span class="text-sm font-bold text-navy-700 dark:text-white">Commission Split</span>
            <span class="text-xs text-navy-400">(10% total rate)</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-xs text-navy-400 font-semibold uppercase tracking-wider">Total Accum Sales</p>
              <p class="text-lg font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(totals.accumulatorSales) }}</p>
            </div>
            <div>
              <p class="text-xs text-navy-400 font-semibold uppercase tracking-wider">Commission Generated</p>
              <p class="text-lg font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(totals.accumulatorTotalComm) }}</p>
            </div>
            <div class="col-span-2 sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-2">
              <div class="bg-green-50 dark:bg-green-900/10 rounded-xl p-3">
                <p class="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Cashiers ({{ rateAccumCashier }}%)</p>
                <p class="text-base font-bold text-green-700 dark:text-green-400 mt-0.5">₦ {{ fmt(totals.accumulatorCashierComm) }}</p>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3">
                <p class="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Principal ({{ clamp(10 - rateAccumCashier, 0, 10).toFixed(1) }}%)</p>
                <p class="text-base font-bold text-purple-600 dark:text-purple-400 mt-0.5">₦ {{ fmt(totals.accumulatorPrincipalComm) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Grand total -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-500 rounded-2xl p-5 text-white">
            <p class="text-xs font-bold uppercase tracking-wider opacity-80">Grand Total — All Cashiers</p>
            <p class="text-2xl font-bold mt-1">₦ {{ fmt(totals.grandCashierComm) }}</p>
            <p class="text-xs opacity-70 mt-1">5/90 + Accumulator commissions</p>
          </div>
          <div class="bg-brand-500 rounded-2xl p-5 text-white">
            <p class="text-xs font-bold uppercase tracking-wider opacity-80">Grand Total — Principal Agent</p>
            <p class="text-2xl font-bold mt-1">₦ {{ fmt(totals.grandPrincipalComm) }}</p>
            <p class="text-xs opacity-70 mt-1">5/90 + Accumulator commissions</p>
          </div>
        </div>
      </div>

      <!-- Per-cashier breakdown header -->
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-navy-700 dark:text-white">Per-Cashier Breakdown</h3>
        <span class="text-sm text-navy-400">{{ calcItems.length }} cashier{{ calcItems.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden space-y-4">
        <div
          v-for="row in calcItems"
          :key="row.cashierId"
          class="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-700 overflow-hidden"
        >
          <div class="px-4 pt-4 pb-3 flex items-start justify-between border-b border-gray-100 dark:border-navy-700">
            <div>
              <p class="font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
              <p class="text-xs text-navy-400 mt-0.5">{{ row.cashierName }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-navy-400 uppercase font-semibold">Total Cashier Payout</p>
              <p class="text-sm font-bold text-green-600 dark:text-green-400">₦ {{ fmt(row.totalCashierPayout) }}</p>
            </div>
          </div>

          <!-- 5/90 breakdown -->
          <div class="px-4 py-3 border-b border-gray-100 dark:border-navy-700">
            <span class="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-md uppercase mb-2 inline-block">5/90</span>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p class="text-[10px] text-navy-400 uppercase font-semibold">Sales</p>
                <p class="text-sm font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.lotto590Sales) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-navy-400 uppercase font-semibold">Total Comm (35%)</p>
                <p class="text-sm font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.lotto590TotalComm) }}</p>
              </div>
              <div class="bg-green-50 dark:bg-green-900/10 rounded-lg p-2">
                <p class="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Cashier ({{ rate590Cashier }}%)</p>
                <p class="text-sm font-bold text-green-700 dark:text-green-400">₦ {{ fmt(row.lotto590CashierComm) }}</p>
              </div>
              <div class="bg-brand-50 dark:bg-brand-900/10 rounded-lg p-2">
                <p class="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase">Principal ({{ clamp(35 - rate590Cashier, 0, 35).toFixed(1) }}%)</p>
                <p class="text-sm font-bold text-brand-600 dark:text-brand-400">₦ {{ fmt(row.lotto590PrincipalComm) }}</p>
              </div>
            </div>
          </div>

          <!-- Accumulator breakdown -->
          <div class="px-4 py-3">
            <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md uppercase mb-2 inline-block">Accum</span>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p class="text-[10px] text-navy-400 uppercase font-semibold">Sales</p>
                <p class="text-sm font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.accumulatorSales) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-navy-400 uppercase font-semibold">Total Comm (10%)</p>
                <p class="text-sm font-semibold text-navy-700 dark:text-white">₦ {{ fmt(row.accumulatorTotalComm) }}</p>
              </div>
              <div class="bg-green-50 dark:bg-green-900/10 rounded-lg p-2">
                <p class="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Cashier ({{ rateAccumCashier }}%)</p>
                <p class="text-sm font-bold text-green-700 dark:text-green-400">₦ {{ fmt(row.accumulatorCashierComm) }}</p>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-2">
                <p class="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Principal ({{ clamp(10 - rateAccumCashier, 0, 10).toFixed(1) }}%)</p>
                <p class="text-sm font-bold text-purple-600 dark:text-purple-400">₦ {{ fmt(row.accumulatorPrincipalComm) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-navy-900/50 text-left">
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap">Cashier</th>
              <!-- 5/90 columns -->
              <th class="px-4 py-3 font-bold text-brand-500 whitespace-nowrap text-right border-l border-brand-100 dark:border-brand-500/20">5/90 Sales</th>
              <th class="px-4 py-3 font-bold text-brand-500 whitespace-nowrap text-right">5/90 Comm (35%)</th>
              <th class="px-4 py-3 font-bold text-green-600 whitespace-nowrap text-right">Cashier ({{ rate590Cashier }}%)</th>
              <th class="px-4 py-3 font-bold text-brand-400 whitespace-nowrap text-right">Principal ({{ clamp(35 - rate590Cashier, 0, 35).toFixed(1) }}%)</th>
              <!-- Accum columns -->
              <th class="px-4 py-3 font-bold text-purple-500 whitespace-nowrap text-right border-l border-purple-100 dark:border-purple-500/20">Accum Sales</th>
              <th class="px-4 py-3 font-bold text-purple-500 whitespace-nowrap text-right">Accum Comm (10%)</th>
              <th class="px-4 py-3 font-bold text-green-600 whitespace-nowrap text-right">Cashier ({{ rateAccumCashier }}%)</th>
              <th class="px-4 py-3 font-bold text-purple-400 whitespace-nowrap text-right">Principal ({{ clamp(10 - rateAccumCashier, 0, 10).toFixed(1) }}%)</th>
              <!-- Total -->
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right border-l border-gray-200 dark:border-navy-600">Total Payout</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-navy-700">
            <tr v-for="row in calcItems" :key="row.cashierId" class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
              <td class="px-4 py-3">
                <p class="font-bold text-navy-700 dark:text-white">{{ row.cashierUsername }}</p>
                <p class="text-xs text-navy-400">{{ row.cashierName }}</p>
              </td>
              <!-- 5/90 -->
              <td class="px-4 py-3 text-right text-navy-600 dark:text-navy-300 border-l border-brand-50 dark:border-brand-500/10">₦ {{ fmt(row.lotto590Sales) }}</td>
              <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.lotto590TotalComm) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">₦ {{ fmt(row.lotto590CashierComm) }}</td>
              <td class="px-4 py-3 text-right text-brand-500">₦ {{ fmt(row.lotto590PrincipalComm) }}</td>
              <!-- Accum -->
              <td class="px-4 py-3 text-right text-navy-600 dark:text-navy-300 border-l border-purple-50 dark:border-purple-500/10">₦ {{ fmt(row.accumulatorSales) }}</td>
              <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.accumulatorTotalComm) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">₦ {{ fmt(row.accumulatorCashierComm) }}</td>
              <td class="px-4 py-3 text-right text-purple-500">₦ {{ fmt(row.accumulatorPrincipalComm) }}</td>
              <!-- Total -->
              <td class="px-4 py-3 text-right font-bold text-green-600 dark:text-green-400 border-l border-gray-100 dark:border-navy-700">₦ {{ fmt(row.totalCashierPayout) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-brand-50 dark:bg-navy-900/60 border-t-2 border-brand-100 dark:border-brand-500/20 font-bold">
              <td class="px-4 py-3 text-navy-700 dark:text-white">TOTAL</td>
              <td class="px-4 py-3 text-right text-navy-700 dark:text-white border-l border-brand-100 dark:border-brand-500/20">₦ {{ fmt(totals.lotto590Sales) }}</td>
              <td class="px-4 py-3 text-right text-navy-700 dark:text-white">₦ {{ fmt(totals.lotto590TotalComm) }}</td>
              <td class="px-4 py-3 text-right text-green-600 dark:text-green-400">₦ {{ fmt(totals.lotto590CashierComm) }}</td>
              <td class="px-4 py-3 text-right text-brand-500">₦ {{ fmt(totals.lotto590PrincipalComm) }}</td>
              <td class="px-4 py-3 text-right text-navy-700 dark:text-white border-l border-purple-100 dark:border-purple-500/20">₦ {{ fmt(totals.accumulatorSales) }}</td>
              <td class="px-4 py-3 text-right text-navy-700 dark:text-white">₦ {{ fmt(totals.accumulatorTotalComm) }}</td>
              <td class="px-4 py-3 text-right text-green-600 dark:text-green-400">₦ {{ fmt(totals.accumulatorCashierComm) }}</td>
              <td class="px-4 py-3 text-right text-purple-500">₦ {{ fmt(totals.accumulatorPrincipalComm) }}</td>
              <td class="px-4 py-3 text-right text-green-600 dark:text-green-400 border-l border-gray-100 dark:border-navy-700">₦ {{ fmt(totals.grandCashierComm) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else-if="!calcLoading" class="bg-white dark:bg-navy-800 rounded-3xl p-16 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 bg-green-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-green-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.684 4.5 4.819V21a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V4.82c0-1.136-.806-2.12-1.907-2.248A48.494 48.494 0 0 0 12 2.25Z" />
        </svg>
      </div>
      <p class="text-lg font-bold text-navy-700 dark:text-white">Set your rates and calculate</p>
      <p class="text-navy-400 font-medium mt-1">Select a date and enter cashier commission rates, then click Calculate</p>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
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

const calcDate = ref(format(new Date(), 'yyyy-MM-dd'))
const rate590Cashier = ref(30)
const rateAccumCashier = ref(7)

const RATE_590_TOTAL = 35
const RATE_ACCUM_TOTAL = 10

const calcLoading = ref(false)
const calcLoaded = ref(false)
const calcItems = ref([])

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
})

const fmt = (val) => convertNumber(val ?? 0)
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

const round2 = (n) => Math.round(n * 100) / 100

const calculate = async () => {
  if (!calcDate.value) {
    snackbar.add({ type: 'warning', text: 'Please select a date' })
    return
  }
  const cashier590 = clamp(rate590Cashier.value, 0, RATE_590_TOTAL)
  const cashierAccum = clamp(rateAccumCashier.value, 0, RATE_ACCUM_TOTAL)
  const principal590 = RATE_590_TOTAL - cashier590
  const principalAccum = RATE_ACCUM_TOTAL - cashierAccum

  try {
    calcLoading.value = true
    const res = await axios.get(
      `report/cashier/summary?shopId=${shopId}&fromDate=${calcDate.value}&toDate=${calcDate.value}`
    )
    const data = res.data
    const rawItems = data.items ?? []

    calcItems.value = rawItems.map((row) => {
      const lotto590TotalComm = round2(row.lotto590Sales * RATE_590_TOTAL / 100)
      const lotto590CashierComm = round2(row.lotto590Sales * cashier590 / 100)
      const lotto590PrincipalComm = round2(row.lotto590Sales * principal590 / 100)

      const accumulatorTotalComm = round2(row.accumulatorSales * RATE_ACCUM_TOTAL / 100)
      const accumulatorCashierComm = round2(row.accumulatorSales * cashierAccum / 100)
      const accumulatorPrincipalComm = round2(row.accumulatorSales * principalAccum / 100)

      const totalCashierPayout = round2(lotto590CashierComm + accumulatorCashierComm)

      return {
        cashierId: row.cashierId,
        cashierUsername: row.cashierUsername,
        cashierName: row.cashierName,
        lotto590Sales: row.lotto590Sales,
        lotto590TotalComm,
        lotto590CashierComm,
        lotto590PrincipalComm,
        accumulatorSales: row.accumulatorSales,
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
    })

    calcLoaded.value = true
  } catch (err) {
    snackbar.add({ type: 'error', text: 'Failed to fetch data' })
    console.error(err)
  } finally {
    calcLoading.value = false
  }
}
</script>
