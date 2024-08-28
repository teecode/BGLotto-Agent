<template>
  <section class="bg-white dark:bg-[#111C44] rounded-2xl">
    <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
      <h2 class="text-base lg:text-2xl font-semibold">Cashier Reports</h2>
    </div>
    <div class="px-3 lg:px-10 py-2 lg:py-5 space-y-3">
      <div class="flex items-center justify-between gap-2 lg:gap-8">
        <div>
          <div class="p-2" v-if="loading">
            <Spinner />
          </div>
          <select v-else v-model="cashierId" class="border rounded-md p-2">
            <option disabled value="">Select Cashier</option>
            <option v-for="cashier in cashierDets" :key="cashier.id" :value="cashier.id">
              {{ cashier.username }}
            </option>
          </select>
        </div>
        <date-picker
          v-model:value="date"
          type="date"
          range
          placeholder="Select date range"
          value-type="format"
          format="YYYY-MM-DD"
          @change="updateDateFilter"
        ></date-picker>
      </div>
      <AppTable
        :header="cashierTableHeader"
        :fields="selectedCashier"
        :loading="loading2"
        :empty="error"
      >
        <!-- <template #item-action="item">
                    <div class="flex items-center justify-center gap-3">
                        <button @click="editCashier(item)"
                            class="py-2 px-3 bg-blue-800 dark:bg-[#7551FF] text-white rounded-md">Edit
                            Cashier</button>
                    </div>
                </template> -->
      </AppTable>
    </div>
  </section>
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
