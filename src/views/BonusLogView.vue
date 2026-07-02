<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Bonus Log</h2>
        <p class="text-navy-400 font-medium mt-1">Review bonuses earned by cashiers</p>
      </div>
      
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full md:w-[200px]">
          <div class="flex justify-center" v-if="loading">
            <Spinner />
          </div>
          <select v-else v-model="cashierName" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl text-sm text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 transition-all outline-none cursor-pointer">
            <option value="">All Cashiers</option>
            <option v-for="cashier in cashierDets" :key="cashier.id" :value="cashier.username">
              {{ cashier.username }}
            </option>
          </select>
        </div>
        
        <div class="flex items-center gap-2 px-2">
            <input type="checkbox" id="filterZero" v-model="filterZeroBonuses" class="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
            <label for="filterZero" class="text-sm font-medium text-navy-700 dark:text-white cursor-pointer select-none">Hide Zero Bonuses</label>
        </div>

        <div class="w-full md:w-auto">
            <date-picker
            v-model:value="date"
            type="date"
            range
            placeholder="Select date range"
            value-type="format"
            format="YYYY-MM-DD"
            @change="updateDateFilter"
            class="custom-datepicker w-full"
            ></date-picker>
        </div>
      </div>
    </header>

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-navy-700 dark:text-white">Bonus Log</h3>
            <div class="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold rounded-lg text-sm">
                {{ startDate }} to {{ endDate }}
            </div>
        </div>
        
      <AppTable
        :header="bonusTableHeader"
        :fields="filteredBonuses"
        :loading="loading2"
        :empty="error"
      >
        <template #item-dateTo="{ dateTo }">{{ formatDateTime(dateTo) }}</template>
        <template #item-percentage="{ percentage }">{{ percentage }}%</template>
        <template #item-amount="{ amount }">₦ {{ convertNumber(amount) }}</template>
        <template #item-stake="{ stake }">₦ {{ convertNumber(stake) }}</template>
        <template #item-totalSales="{ totalSales }">₦ {{ convertNumber(totalSales) }}</template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect, computed } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import Spinner from '@/components/Spinner.vue'
import AppTable from '@/components/AppTable.vue'
import { format } from 'date-fns'
import { convertNumber } from '../services/convertNumber'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const router = useRouter()

let cashierDets = ref([])

const userId = ref(Number(authStore.user.shopId))

let date = ref([format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')])
let loading = ref(false)
let error = ref(false)
let loading2 = ref(false)
let cashierName = ref('')
let filterZeroBonuses = ref(true)
let startDate = ref(format(new Date(), 'yyyy-MM-dd'))
let endDate = ref(format(new Date(), 'yyyy-MM-dd'))
const allBonuses = ref([])

let bonusTableHeader = reactive([
  { label: 'Date', key: 'dateTo' },
  { label: 'Cashier', key: 'cashierName' },
  { label: 'Terminal', key: 'terminalSerial' },
  { label: 'Stake', key: 'stake' },
  { label: 'Total Sales', key: 'totalSales' },
  { label: 'Bonus %', key: 'percentage' },
  { label: 'Amount', key: 'amount' }
])

const filteredBonuses = computed(() => {
    let result = allBonuses.value;
    if (cashierName.value) {
        result = result.filter(b => b.cashierName === cashierName.value);
    }
    return result;
})

const updateDateFilter = () => {
  if (date.value && date.value.length === 2) {
    startDate.value = date.value[0]
    endDate.value = date.value[1]
  }
}

const fetchCashiers = async () => {
  try {
    loading.value = true
    const res = await axios.get(`Retail/cashiers?ShopId=${userId.value}`)
    cashierDets.value = res.data.data
    loading.value = false
  } catch (err) {
    loading.value = false
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const getBonusLog = async () => {
  try {
    loading2.value = true
    error.value = false
    const res = await axios.get(
      `RetailFinance/shop-bonus/history?DateFrom=${startDate.value}&DateTo=${endDate.value}&IgnoreZeroBonuses=${filterZeroBonuses.value}`
    )
    allBonuses.value = res.data.data || []
    if (allBonuses.value.length === 0) {
      error.value = true
    }
    loading2.value = false
  } catch (err) {
    console.log(err)
    loading2.value = false
    error.value = true
  }
}

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM dd, yyyy');
}

onMounted(() => {
  fetchCashiers()
})

watchEffect(() => {
  getBonusLog()
})
</script>

<style scoped></style>
