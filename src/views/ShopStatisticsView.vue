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

    <!-- Headline figures -->
    <FigureGrid :figures="figures" />

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-navy-700 dark:text-white">Shop Report</h3>
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
        <template #item-sales="{ sales }">{{ moneyExact(sales) }}</template>
        <template #item-cancelled="{ cancelled }">{{ moneyExact(cancelled) }}</template>
        <template #item-netSales="{ sales, cancelled }">{{ moneyExact(sales - cancelled) }}</template>
        <template #item-commission="{ commission }">{{ moneyExact(commission) }}</template>
        <template #item-winnings="{ winnings }">{{ moneyExact(winnings) }}</template>
        <template #item-claimedCount="{ claimedCount }">{{ claimedCount ?? 0 }}</template>
        <template #item-lotto590Sales="{ lotto590Sales }">{{ moneyExact(lotto590Sales) }}</template>
        <template #item-lotto590Commission="{ lotto590Commission }">{{ moneyExact(lotto590Commission) }}</template>
        <template #item-lotto590Winnings="{ lotto590Winnings }">{{ moneyExact(lotto590Winnings) }}</template>
        <template #item-accumulatorSales="{ accumulatorSales }">{{ moneyExact(accumulatorSales) }}</template>
        <template #item-accumulatorCommission="{ accumulatorCommission }">{{ moneyExact(accumulatorCommission) }}</template>
        <template #item-accumulatorWinnings="{ accumulatorWinnings }">{{ moneyExact(accumulatorWinnings) }}</template>
        <template #item-net_Balance="{ net_Balance }">
          <span :class="net_Balance < 0 ? 'text-red-500' : 'text-green-500'" class="font-bold">
            {{ moneyExact(net_Balance) }}
          </span>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import AppTable from '@/components/AppTable.vue'
import FigureGrid from '@/components/ui/FigureGrid.vue'
import { moneyExact } from '@/services/format'

const authStore = useAuthStore()
const snackbar = useSnackbar()

const userId = ref(Number(authStore.user.shopId))

let today = ref(format(new Date(), 'yyyy-MM-dd'))
const aDayAgo = new Date()
aDayAgo.setDate(aDayAgo.getDate() - 1)
let yesterday = ref(format(new Date(aDayAgo), 'yyyy-MM-dd'))

let loading = ref(false)
let setNewDate = ref([format(new Date(aDayAgo), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')])
let error = ref(false)

const shopStats = ref([])

// The headline figures above the table, in the order they are read
const figures = computed(() => {
  const s = shopStats.value || {}
  const tickets = s.totalClaimedCount ?? 0
  return [
    { label: 'Total sales', value: moneyExact(s.totalSales) },
    { label: 'Cancelled', value: moneyExact(s.totalCanceled) },
    { label: 'Net sales', value: moneyExact(s.totalNetSales) },
    { label: 'Total cashout', value: moneyExact(s.totalClaimed), note: `${tickets} ticket${tickets !== 1 ? 's' : ''}` },
    { label: 'Commission', value: moneyExact(s.totalCommission) },
    { label: 'Net balance', value: moneyExact(s.totalNetBalance), negative: Number(s.totalNetBalance) < 0 },
    { label: '5/90 sales', value: moneyExact(s.totalLotto590Sales) },
    { label: '5/90 claimed', value: moneyExact(s.totalLotto590Winnings) },
    { label: '5/90 commission', value: moneyExact(s.totalLotto590Commission) },
    { label: 'Accum. sales', value: moneyExact(s.totalAccumulatorSales) },
    { label: 'Accum. claimed', value: moneyExact(s.totalAccumulatorWinnings) },
    { label: 'Accum. commission', value: moneyExact(s.totalAccumulatorCommission) },
  ]
})
const shopTableStats = ref([])

let tableHeader = reactive([
  {
    label: 'Cashier',
    key: 'customerUsername'
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
    key: 'commission'
  },
  {
    label: 'Claimed',
    key: 'winnings'
  },
  {
    label: 'Claimed Count',
    key: 'claimedCount'
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

const fetchStats = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await axios.get(
      `report/shop/dailygame?FromDate=${yesterday.value}&ToDate=${today.value}&ShopId=${userId.value}`
    )
    shopStats.value = res.data
    shopTableStats.value = res.data.items || []
    if (shopTableStats.value.length === 0) {
      error.value = true
    }
    loading.value = false
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

// watchEffect runs once straight away, and again whenever a filter it reads changes
watchEffect(() => {
  fetchStats()
})
</script>

<style scoped></style>
