<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Cashier Reports</h2>
        <p class="text-navy-400 font-medium mt-1">Review performance and sales by cashier</p>
      </div>
      
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div class="w-full md:w-[200px]">
          <div class="flex justify-center" v-if="loading">
            <Spinner />
          </div>
          <select v-else v-model="cashierId" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-xl text-sm text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 transition-all outline-none cursor-pointer">
            <option disabled value="">Select Cashier</option>
            <option v-for="cashier in cashierDets" :key="cashier.id" :value="cashier.id">
              {{ cashier.username }}
            </option>
          </select>
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
      <AppTable
        :header="cashierTableHeader"
        :fields="selectedCashier"
        :loading="loading2"
        :empty="error"
      >
        <template #item-dateFromLong="{ dateFromLong }">
          <span class="font-bold text-navy-700 dark:text-navy-200">
            {{ format(new Date(dateFromLong), 'dd MMM, yyyy') }}
          </span>
        </template>
        <template #item-sales="{ sales }">₦ {{ convertNumber(sales) }}</template>
        <template #item-cancelled="{ cancelled }">₦ {{ convertNumber(cancelled) }}</template>
        <template #item-netSales="{ netSales }">₦ {{ convertNumber(netSales) }}</template>
        <template #item-commission="{ commission }">₦ {{ convertNumber(commission) }}</template>
        <template #item-paid="{ paid }">₦ {{ convertNumber(paid) }}</template>
        <template #item-net_Balance="{ net_Balance }">
          <span :class="net_Balance < 0 ? 'text-red-500' : 'text-green-500'" class="font-bold">
            ₦ {{ convertNumber(net_Balance) }}
          </span>
        </template>
        <template #item-lotto590Sales="{ lotto590Sales }">₦ {{ convertNumber(lotto590Sales) }}</template>
        <template #item-lotto590Winnings="{ lotto590Winnings }">₦ {{ convertNumber(lotto590Winnings) }}</template>
        <template #item-lotto590Commission="{ lotto590Commission }">₦ {{ convertNumber(lotto590Commission) }}</template>
        <template #item-accumulatorSales="{ accumulatorSales }">₦ {{ convertNumber(accumulatorSales) }}</template>
        <template #item-accumulatorWinnings="{ accumulatorWinnings }">₦ {{ convertNumber(accumulatorWinnings) }}</template>
        <template #item-accumulatorCommission="{ accumulatorCommission }">₦ {{ convertNumber(accumulatorCommission) }}</template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
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

let cashierDets = reactive([])

const userId = ref(Number(authStore.user.shopId))

let date = ref()
let loading = ref(false)
let error = ref(false)
let loading2 = ref(false)
let cashierId = ref('')
let startDate = ref(format(new Date(), 'yyyy-MM-dd'))
let endDate = ref(format(new Date(), 'yyyy-MM-dd'))
const selectedCashier = ref([])

let cashierTableHeader = reactive([
  {
    label: 'Date',
    key: 'dateFromLong'
  },
  {
    label: 'Cashier',
    key: 'customerUsername'
  },
  {
    label: 'Terminal ID',
    key: 'terminal'
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
    key: 'paid'
  },
  {
    label: '5/90 Sales',
    key: 'lotto590Sales'
  },
  {
    label: '5/90 Claimed',
    key: 'lotto590Winnings'
  },
  {
    label: '5/90 Comm.',
    key: 'lotto590Commission'
  },
  {
    label: 'Accum. Sales',
    key: 'accumulatorSales'
  },
  {
    label: 'Accum. Claimed',
    key: 'accumulatorWinnings'
  },
  {
    label: 'Accum. Comm.',
    key: 'accumulatorCommission'
  },
  {
    label: 'Balance',
    key: 'net_Balance'
  }
])

const updateDateFilter = () => {
  startDate.value = date.value[0]
  endDate.value = date.value[1]
}

const fetchCasheirs = async () => {
  try {
    loading.value = true
    const res = await axios.get(`Retail/cashiers?ShopId=${userId.value}`)
    cashierDets = res.data.data
    // totalData.value = res.data.totalCount;
    // totalPages.value = res.data.totalPages;
    loading.value = false
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const getCashierDetails = async () => {
  try {
    loading2.value = true
    const res = await axios.get(
      `report/customerterminal/dailygame?fromDate=${startDate.value}&toDate=${endDate.value}&shopCode=${authStore.user.shopCode}&CashierId=${cashierId.value}`
    )
    selectedCashier.value = res.data.items
    if (selectedCashier.length == 0) {
      error.value = true
    }
    loading2.value = false
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  fetchCasheirs()
})

watchEffect(() => {
  getCashierDetails()
})
</script>

<style scoped></style>
