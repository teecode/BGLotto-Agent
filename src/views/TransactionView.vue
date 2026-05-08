<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Filters Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Wallet Transactions</h2>
          <p class="text-navy-400 font-medium">Monitor your shop's financial activities</p>
        </div>
        
        <div class="flex items-center gap-4 w-full md:w-auto">
          <date-picker
            v-model:value="today"
            type="date"
            placeholder="Select date"
            value-type="format"
            format="YYYY-MM-DD"
            class="custom-datepicker w-full md:w-auto"
          ></date-picker>
        </div>
      </div>
    </header>

    <!-- Table Section -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700">
      <AppTable
        :header="ticketsTableHeader"
        :fields="transactions"
        :loading="loading"
        :totalPages="totalPages"
        :pageSize="pageSize"
        :totalRecords="totalData"
        :dataCount="transactions.length"
        :empty="error"
      >
        <template #item-date="{ date }">
          <div class="space-y-0.5">
            <span class="font-bold text-navy-700 dark:text-navy-200">
              {{ format(new Date(date), 'dd MMM, yyyy') }}
            </span>
            <p class="text-[10px] text-navy-300">{{ format(new Date(date), 'hh:mm a') }}</p>
          </div>
        </template>

        <template #item-amount="{ amount }">
          <span :class="amount > 0 ? 'text-green-500' : 'text-red-500'" class="font-bold text-base">
            ₦ {{ amount }}
          </span>
        </template>

        <template #item-balanceBefore="{ balanceBefore }">
          <span class="text-navy-400 font-medium">₦ {{ balanceBefore }}</span>
        </template>

        <template #item-balanceAfter="{ balanceAfter }">
          <span class="text-navy-700 dark:text-white font-bold">₦ {{ balanceAfter }}</span>
        </template>

        <template #item-transactionCategoryName="{ transactionCategoryName }">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-navy-900 text-navy-500 dark:text-navy-300">
            {{ transactionCategoryName }}
          </span>
        </template>

        <template #item-postedByFullName="{ postedByFullName }">
          <div class="flex items-center gap-2">
            <div class="size-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 text-[10px] font-bold">
              {{ postedByFullName.charAt(0) }}
            </div>
            <span class="text-sm font-medium">{{ postedByFullName }}</span>
          </div>
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

const snackbar = useSnackbar()
const authStore = useAuthStore()

const userId = ref(Number(authStore.user.shopId))
const today = ref(format(new Date(), 'yyyy-MM-dd'))
const transactions = ref([])
let loading = ref(false)
let totalData = ref(null)
let totalPages = ref(0)
let pageSize = ref(10)
let error = ref(false)

let ticketsTableHeader = reactive([
  {
    label: 'Date',
    key: 'date'
  },
  {
    label: 'Amount',
    key: 'amount'
  },
  {
    label: 'Balance Before',
    key: 'balanceBefore'
  },
  {
    label: 'Balance After',
    key: 'balanceAfter'
  },
  {
    label: 'Posted',
    key: 'postedByFullName'
  },
  {
    label: 'Transacation type',
    key: 'transactionCategoryName'
  }
])

const fetchTransactions = async () => {
  try {
    const res = await axios.get(
      `report/ShopWalletTransactionsReport?ShopId=${userId.value}&Date=${today.value}`
    )
    transactions.value = res.data
    totalData.value = res.data.totalCount
    totalPages.value = res.data.totalPages
    if (transactions.value.length == 0) {
      error.value = true
    }
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

onMounted(() => {
  fetchTransactions()
})

watchEffect(() => {
  fetchTransactions()
})
</script>

<style scoped></style>
