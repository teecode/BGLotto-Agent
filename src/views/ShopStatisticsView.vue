<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Shop Statistics</h2>
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
          <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Total Cashout</p>
          <p class="text-xl lg:text-2xl font-bold text-green-500 mt-2 truncate">₦ {{ convertNumber(shopStats.totalWinnings) }}</p>
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
    </div>

    <!-- Content Card (Table) -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
      <AppTable
        :header="tableHeader"
        :fields="shopTableStats"
        :loading="loading"
        :dataCount="shopTableStats.length"
        :empty="error"
      >
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
let setNewDate = ref(new Date())
let error = ref(false)

const shopStats = ref([])
const shopTableStats = ref([])
const userId = ref(Number(authStore.user.shopId))

let tableHeader = reactive([
  {
    label: 'Date',
    key: 'date'
  },
  {
    label: 'Cashier',
    key: 'customerName'
  },
  {
    label: 'ShopName',
    key: 'shopName'
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
    label: 'Winnings',
    key: 'winnings'
  },
  {
    label: 'Commission',
    key: 'commission'
  },
  {
    label: 'Balance',
    key: 'net_Balance'
  }
])

const updateDate = () => {
  today.value = setNewDate.value[1]
  yesterday.value = setNewDate.value[0]
}

const fetchStats = async () => {
  try {
    loading.value = true
    const res = await axios.get(
      `report/shop/dailygame?FromDate=${yesterday.value}&ToDate=${today.value}&ShopId=${userId.value}`
    )
    shopStats.value = res.data
    shopTableStats.value = res.data.items
    if (shopTableStats.value.length == 0) {
      error.value = true
    }
    loading.value = false
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

onMounted(() => {
  fetchStats()
})

watchEffect(() => {
  fetchStats()
})
</script>

<style scoped></style>
