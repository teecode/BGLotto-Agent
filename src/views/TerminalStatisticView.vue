<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Terminal Statistics</h2>
        <p class="text-navy-400 font-medium mt-1">View performance metrics for all shop terminals</p>
      </div>
      
      <div class="w-full md:w-auto">
        <date-picker v-model:value="date" type="date" range placeholder="Select date range" value-type="format"
            format="YYYY-MM-DD" @change="updateDateFilter" class="custom-datepicker w-full"></date-picker>
      </div>
    </header>

    <Spinner v-if="loading2" />

    <template v-else>
      <!-- Mobile card list -->
      <div v-if="terminals.length" class="md:hidden space-y-4">
        <div
          v-for="row in terminals"
          :key="row.terminal_Id"
          class="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-700 overflow-hidden"
        >
          <!-- Card header -->
          <div class="px-4 pt-4 pb-3 flex items-start justify-between">
            <div>
              <p class="font-bold text-navy-700 dark:text-white">{{ row.terminal }}</p>
              <p class="text-xs text-navy-400 mt-0.5">Terminal ID: {{ row.terminal_Id }}</p>
            </div>
            <span
              :class="row.net_Balance < 0
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'"
              class="text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap"
            >
              ₦ {{ fmt(row.net_Balance) }}
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
              <p class="text-sm font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ fmt(row.commision) }}</p>
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
          <h3 class="font-bold text-navy-700 dark:text-white">Terminal Breakdown</h3>
          <span class="text-sm text-navy-400">{{ startDate }} → {{ endDate }}</span>
        </div>
        <div v-if="!terminals.length" class="py-16 text-center text-navy-400 font-medium">
          No data for the selected period.
        </div>
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-navy-900/50 text-left">
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap">Terminal</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Sales</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Cancelled</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Net Sales</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Commission</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Claimed</th>
              <th class="px-4 py-3 font-bold text-navy-500 dark:text-navy-300 whitespace-nowrap text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in terminals" :key="row.terminal_Id">
              <!-- Main row -->
              <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors border-t border-gray-100 dark:border-navy-700">
                <td class="px-4 py-3">
                  <p class="font-bold text-navy-700 dark:text-white">{{ row.terminal }}</p>
                  <p class="text-xs text-navy-400">ID: {{ row.terminal_Id }}</p>
                </td>
                <td class="px-4 py-3 text-right font-medium text-navy-700 dark:text-navy-200">₦ {{ fmt(row.sales) }}</td>
                <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.cancelled) }}</td>
                <td class="px-4 py-3 text-right font-medium text-navy-700 dark:text-navy-200">₦ {{ fmt(row.sales - row.cancelled) }}</td>
                <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.commision) }}</td>
                <td class="px-4 py-3 text-right text-navy-500 dark:text-navy-400">₦ {{ fmt(row.paid) }}</td>
                <td class="px-4 py-3 text-right font-bold" :class="row.net_Balance < 0 ? 'text-red-500' : 'text-green-500'">
                  ₦ {{ fmt(row.net_Balance) }}
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
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Sales) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Sales) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Commission) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.lotto590Winnings) }}</td>
                <td class="px-4 py-2 text-right text-xs font-semibold"
                    :class="(row.lotto590Sales - row.lotto590Commission - row.lotto590Winnings) < 0 ? 'text-red-400' : 'text-green-500'">
                  ₦ {{ fmt(round2(row.lotto590Sales - row.lotto590Commission - row.lotto590Winnings)) }}
                </td>
              </tr>
              <!-- Accumulator sub-row -->
              <tr class="bg-purple-50/40 dark:bg-purple-500/5">
                <td class="pl-8 pr-4 py-2">
                  <span class="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <span class="text-purple-300 dark:text-purple-600">└</span>
                    <span class="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded">Accum</span>
                  </span>
                </td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorSales) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-300 dark:text-navy-600">—</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorSales) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorCommission) }}</td>
                <td class="px-4 py-2 text-right text-xs text-navy-600 dark:text-navy-300">₦ {{ fmt(row.accumulatorWinnings) }}</td>
                <td class="px-4 py-2 text-right text-xs font-semibold"
                    :class="(row.accumulatorSales - row.accumulatorCommission - row.accumulatorWinnings) < 0 ? 'text-red-400' : 'text-green-500'">
                  ₦ {{ fmt(round2(row.accumulatorSales - row.accumulatorCommission - row.accumulatorWinnings)) }}
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr class="bg-brand-50 dark:bg-navy-900/60 border-t-2 border-brand-100 dark:border-brand-500/20">
              <td class="px-4 py-3 font-bold text-navy-700 dark:text-white">TOTAL</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalSales) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalCancelled) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalNetSales) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalCommission) }}</td>
              <td class="px-4 py-3 text-right font-bold text-navy-700 dark:text-white">₦ {{ fmt(stats.totalPaid) }}</td>
              <td class="px-4 py-3 text-right font-bold" :class="stats.totalNetBalance < 0 ? 'text-red-500' : 'text-green-500'">
                ₦ {{ fmt(stats.totalNetBalance) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import Spinner from '@/components/Spinner.vue';
import { format } from 'date-fns';
import { convertNumber } from '../services/convertNumber';

const fmt = (num) => convertNumber(num) || '0.00';
const round2 = (num) => Number(Math.round(num + 'e2') + 'e-2');

const snackbar = useSnackbar();
const authStore = useAuthStore();

let date = ref([format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')]);
let loading2 = ref(false);
let startDate = ref(format(new Date(), 'yyyy-MM-dd'));
let endDate = ref(format(new Date(), 'yyyy-MM-dd'));
const terminals = ref([]);
const stats = reactive({
  totalSales: 0,
  totalCancelled: 0,
  totalNetSales: 0,
  totalCommission: 0,
  totalPaid: 0,
  totalNetBalance: 0
});

const updateDateFilter = () => {
    if (date.value && date.value.length === 2) {
        startDate.value = date.value[0];
        endDate.value = date.value[1]; 
    }
};

const fetchTerminalStats = async() => {
    try{
        loading2.value = true;
        const res = await axios.get(`report/terminal/dailygame?fromDate=${startDate.value}&toDate=${endDate.value}&shopCode=${authStore.user.shopCode}`)
        terminals.value = res.data.items || [];
        stats.totalSales = res.data.totalSales || 0;
        stats.totalCancelled = res.data.totalCanceled || 0;
        stats.totalNetSales = res.data.totalNetSales || 0;
        stats.totalCommission = res.data.totalCommission || 0;
        stats.totalPaid = res.data.totalPaid || 0;
        stats.totalNetBalance = res.data.totalNetBalance || 0;
        loading2.value = false; 
    } catch(err){
        console.log(err)
        loading2.value = false;
        snackbar.add({
            type: 'error',
            text: `Failed to load stats: ${err.message}`
        });
    }
}

watchEffect(() => {
    fetchTerminalStats();
})

</script>

<style scoped>

</style>