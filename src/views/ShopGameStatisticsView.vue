<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Game Statistics</h2>
        <div class="flex items-center gap-2 mt-1 text-navy-400 font-medium text-sm">
          <span>From: <span class="text-brand-500 font-bold">{{ yesterday }}</span></span>
          <span class="mx-1">•</span>
          <span>To: <span class="text-brand-500 font-bold">{{ today }}</span></span>
        </div>
      </div>
      
      <div class="w-full md:w-auto">
        <date-picker
          @change="updateDate"
          v-model:value="setNewDate"
          type="date"
          placeholder="Select date range"
          range
          value-type="format"
          format="YYYY-MM-DD"
          class="custom-datepicker w-full"
        ></date-picker>
      </div>
    </header>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
        <!-- Sales -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Total Sales</p>
          <p class="text-xl lg:text-2xl font-bold text-brand-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalSales) }}</p>
        </div>
        <!-- Canceled -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Total Canceled</p>
          <p class="text-xl lg:text-2xl font-bold text-red-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalCanceled) }}</p>
        </div>
        <!-- Net Sales -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Net Sales</p>
          <p class="text-xl lg:text-2xl font-bold text-navy-700 dark:text-white mt-2 truncate">₦ {{ convertNumber(shopStats.totalNetSales) }}</p>
        </div>
        <!-- Claimed -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Total Claimed</p>
          <p class="text-xl lg:text-2xl font-bold text-green-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalClaimed) }}</p>
        </div>
        <!-- Commissions -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Commissions</p>
          <p class="text-xl lg:text-2xl font-bold text-blue-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalCommission) }}</p>
        </div>
        <!-- Net Balance -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute inset-0 bg-brand-500/5"></div>
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest relative z-10">Net Balance</p>
          <p class="text-xl lg:text-2xl font-bold text-brand-500 mt-2 truncate relative z-10">₦ {{ convertNumber(shopStats.totalNetBalance) }}</p>
        </div>
        <!-- 5/90 Sales -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">5/90 Sales</p>
          <p class="text-xl lg:text-2xl font-bold text-brand-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalLotto590Sales) }}</p>
        </div>
        <!-- 5/90 Claimed -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">5/90 Claimed</p>
          <p class="text-xl lg:text-2xl font-bold text-green-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalLotto590Winnings) }}</p>
        </div>
        <!-- 5/90 Comm -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">5/90 Commission</p>
          <p class="text-xl lg:text-2xl font-bold text-blue-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalLotto590Commission) }}</p>
        </div>
        <!-- Accum. Sales -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Accum. Sales</p>
          <p class="text-xl lg:text-2xl font-bold text-brand-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalAccumulatorSales) }}</p>
        </div>
        <!-- Accum. Claimed -->
        <div class="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col justify-between hover:shadow-md transition-shadow">
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Accum. Claimed</p>
    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-navy-700 dark:text-white">Game Report</h3>
            <div class="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold rounded-lg text-sm">
                {{ yesterday }} to {{ today }}
            </div>
        </div>
        
      <AppTable
        :header="tableHeader"
        :fields="shopTableStats"
        :loading="loading"
        :empty="error"
      >
        <template #item-sales="{ sales }">₦ {{ convertNumber(sales) }}</template>
        <template #item-cancelled="{ cancelled }">₦ {{ convertNumber(cancelled) }}</template>
        <template #item-netSales="{ sales, cancelled }">₦ {{ convertNumber(sales - cancelled) }}</template>
        <template #item-commision="{ commision }">₦ {{ convertNumber(commision) }}</template>
        <template #item-claimed="{ claimed }">₦ {{ convertNumber(claimed) }}</template>
        <template #item-lotto590Sales="{ lotto590Sales }">₦ {{ convertNumber(lotto590Sales) }}</template>
        <template #item-lotto590Commission="{ lotto590Commission }">₦ {{ convertNumber(lotto590Commission) }}</template>
        <template #item-lotto590Winnings="{ lotto590Winnings }">₦ {{ convertNumber(lotto590Winnings) }}</template>
        <template #item-accumulatorSales="{ accumulatorSales }">₦ {{ convertNumber(accumulatorSales) }}</template>
        <template #item-accumulatorCommission="{ accumulatorCommission }">₦ {{ convertNumber(accumulatorCommission) }}</template>
        <template #item-accumulatorWinnings="{ accumulatorWinnings }">₦ {{ convertNumber(accumulatorWinnings) }}</template>
        <template #item-net_Balance="{ net_Balance }">
          <span :class="net_Balance < 0 ? 'text-red-500' : 'text-green-500'" class="font-bold">
            ₦ {{ convertNumber(net_Balance) }}
          </span>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import AppTable from '@/components/AppTable.vue'
import { convertNumber } from '../services/convertNumber'

const authStore = useAuthStore()
const snackbar = useSnackbar()
let today = ref(format(new Date(), 'yyyy-MM-dd'))
const aDayAgo = new Date()
aDayAgo.setDate(aDayAgo.getDate() - 1)
let yesterday = ref(format(new Date(aDayAgo), 'yyyy-MM-dd'))
let loading = ref(false)
let setNewDate = ref([format(new Date(aDayAgo), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')])
let error = ref(false)

const shopStats = ref([])
const shopTableStats = ref([])
const userCode = ref(authStore.user.shopCode)

let tableHeader = reactive([
  {
    label: 'Game',
    key: 'gameName'
  },
  {
    label: 'Sales',
    key: 'sales'
  },
  {
    label: 'Cancelled',
    key: 'cancelled'
  },
  {
    label: 'Net Sales',
    key: 'netSales'
  },
  {
    label: 'Commission',
    key: 'commision'
  },
  {
    label: 'Claimed',
    key: 'claimed'
  },
  {
    label: '5/90 Sales',
    key: 'lotto590Sales'
  },
  {
    label: '5/90 Comm.',
    key: 'lotto590Commission'
  },
  {
    label: '5/90 Claimed',
    key: 'lotto590Winnings'
  },
  {
    label: 'Accum. Sales',
    key: 'accumulatorSales'
  },
  {
    label: 'Accum. Comm.',
    key: 'accumulatorCommission'
  },
  {
    label: 'Accum. Claimed',
    key: 'accumulatorWinnings'
  },
  {
    label: 'Balance',
    key: 'net_Balance'
  }
])

const updateDate = () => {
  if (setNewDate.value && setNewDate.value.length === 2) {
    yesterday.value = setNewDate.value[0]
    today.value = setNewDate.value[1]
  }
}

const fetchShopGameStats = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await axios.get(
      `report/DailyGameReportByShop?FromDate=${yesterday.value}&ToDate=${today.value}&ShopCode=${userCode.value}`
    )
    shopStats.value = res.data
    shopTableStats.value = res.data.items || []
    loading.value = false
    if (shopTableStats.value.length === 0) {
      error.value = true
    }
  } catch (err) {
    console.log(err)
    loading.value = false
    error.value = true
    snackbar.add({
      type: 'error',
      text: `Failed to load stats: ${err.message}`
    })
  }
}

onMounted(() => {
  fetchShopGameStats()
})

watchEffect(() => {
  fetchShopGameStats()
})
</script>

<style scoped></style>
