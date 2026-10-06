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

    <!-- Headline figures -->
    <FigureGrid :figures="figures" :loading="loading2 && !loadedOnce" />

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-navy-700 dark:text-white">Lodgement history</h3>
        <div class="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold rounded-lg text-sm">
          {{ startDate }} to {{ endDate }}
        </div>
      </div>

      <AppTable
        :header="cashierTableHeader"
        :fields="lodgement"
        :loading="loading2"
        :empty="error"
        paginated
        :currentPage="page"
        :pageSize="pageSize"
        :totalPages="totalPages"
        :totalRecords="totalCount"
        @pageChange="goToPage"
      >
        <template #item-date="{ date }">
          <span class="font-bold text-navy-700 dark:text-navy-200">
            {{ date ? format(new Date(date), 'dd MMM, yyyy') : '-' }}
          </span>
        </template>
        <template #item-amount="{ amount }">
          <span class="font-bold text-navy-700 dark:text-white text-base">{{ moneyExact(amount) }}</span>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { moneyExact } from '@/services/format'
import { ref, reactive, computed, watchEffect } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '../stores/auth'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import AppTable from '@/components/AppTable.vue'
import FigureGrid from '@/components/ui/FigureGrid.vue'
import { format } from 'date-fns'

const snackbar = useSnackbar()
const authStore = useAuthStore()

let date = ref()
let error = ref(false)
let loading2 = ref(false)
// Stays false until the first answer, so the figures show placeholders only on arrival
const loadedOnce = ref(false)
let startDate = ref(format(new Date(), 'yyyy-MM-dd'))
let endDate = ref(format(new Date(), 'yyyy-MM-dd'))
const lodgement = ref([])

// Paging: the API returns one page at a time and says how many rows there are in all
const page = ref(1)
const pageSize = 20
const totalCount = ref(0)
const totalPages = ref(0)

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

const figures = computed(() => {
  const onPage = lodgement.value.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  return [
    { label: 'Lodgements found', value: totalCount.value.toLocaleString('en-US') },
    {
      label: totalPages.value > 1 ? 'Amount (this page)' : 'Amount lodged',
      value: moneyExact(onPage),
      note: totalPages.value > 1 ? `Page ${page.value} of ${totalPages.value}` : undefined
    }
  ]
})

const updateDateFilter = () => {
  // Clearing the picker leaves no range to read; keep the last one
  if (!date.value || !date.value[0] || !date.value[1]) return
  startDate.value = date.value[0]
  endDate.value = date.value[1]
  // A new range starts again from its first page
  page.value = 1
}

const goToPage = (next) => {
  page.value = next
}

/** Only the answer to the latest request is shown, so a slow earlier page cannot overwrite it */
let requestId = 0

const fetchLodgement = async () => {
  const request = ++requestId
  // Read here, before the first await, so that watchEffect reruns this when any of them changes
  const query = `page=${page.value}&pageSize=${pageSize}&transactionDateFrom=${startDate.value}&transactionDateTo=${endDate.value}&shopCode=${authStore.user.shopCode}&transactionCategory=2008`
  try {
    loading2.value = true
    const res = await axios.get(`RetailFinance/payment/search?${query}`)
    if (request !== requestId) return
    lodgement.value = res.data.data || []
    totalCount.value = Number(res.data.totalCount) || lodgement.value.length
    totalPages.value = Number(res.data.totalPages) || Math.ceil(totalCount.value / pageSize)
    error.value = lodgement.value.length == 0
  } catch (err) {
    if (request !== requestId) return
    console.log(err)
    lodgement.value = []
    totalCount.value = 0
    totalPages.value = 0
    error.value = true
    snackbar.add({ type: 'error', text: `Could not load lodgements: ${err.message}` })
  } finally {
    // Whatever happened, the table must stop showing "loading"
    if (request === requestId) {
      loading2.value = false
      loadedOnce.value = true
    }
  }
}

// watchEffect runs once straight away, and again whenever a filter it reads changes
watchEffect(() => {
  fetchLodgement()
})
</script>

<style lang="scss" scoped></style>
