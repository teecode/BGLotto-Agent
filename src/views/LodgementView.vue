<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Lodgements</h2>
        <p class="text-navy-400 font-medium mt-1">Track funds deposited to the company account</p>
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
    </header>

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
      <AppTable :header="cashierTableHeader" :fields="lodgement" :loading="loading2" :empty="error">
        <template #item-date="{ date }">
          <span class="font-bold text-navy-700 dark:text-navy-200">
            {{ format(new Date(date), 'dd MMM, yyyy') }}
          </span>
        </template>
        <template #item-amount="{ amount }">
          <span class="font-bold text-brand-500 text-base">₦ {{ amount }}</span>
        </template>
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
const lodgement = ref([])

let cashierTableHeader = reactive([
  {
    label: 'Date',
    key: 'date'
  },
  {
    label: 'Amount',
    key: 'amount'
  },
  {
    label: 'Posted By',
    key: 'postedFullName'
  },
  {
    label: 'Bank',
    key: 'bankName'
  }
])

const updateDateFilter = () => {
  startDate.value = date.value[0]
  endDate.value = date.value[1]
}

const fetchLodgement = async () => {
  try {
    loading2.value = true
    const res = await axios.get(
      `RetailFinance/payment/search?page=1&pageSize=10&transactionDateFrom=${startDate.value}&transactionDateTo=${endDate.value}&shopCode=${authStore.user.shopCode}&transactionCategory=2008`
    )
    lodgement.value = res.data.data
    if (lodgement.length == 0) {
      error.value = true
    }
    loading2.value = false
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  fetchLodgement()
})

watchEffect(() => {
  fetchLodgement()
})
</script>

<style lang="scss" scoped></style>
