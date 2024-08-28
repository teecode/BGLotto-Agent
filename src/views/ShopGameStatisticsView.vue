<template>
  <section class="bg-white dark:bg-[#111C44] rounded-2xl p-3">
    <div class="flex items-center justify-between w-full lg:gap-24 p-2">
      <div>
        <div class="flex items-center gap-4">
          <p>From : {{ yesterday }}</p>
          <p>To : {{ today }}</p>
        </div>
      </div>
      <date-picker
        @change="updateDate"
        v-model:value="setNewDate"
        type="date"
        placeholder="Select date"
        range
        value-type="format"
        format="YYYY-MM-DD"
      ></date-picker>
    </div>
    <div>
      <div class="flex gap-4 mt-4 overflow-auto p-3">
        <div
          class="bg-white dark:bg-[#1B254B] min-w-32 h-32 max-h-32 drop-shadow-md py-1 px-3 rounded-lg"
        >
          <div class="border-b">
            <p class="uppercase semi-bold text-lg">Sales</p>
          </div>
          <div class="mt-2">
            <p class="uppercase semi-bold text-[10px] my-2">total sales</p>
            <p class="text-base lg:text-3xl bold">₦ {{ convertNumber(shopStats.totalSales) }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg">
          <div class="border-b">
            <p class="uppercase semi-bold text-lg">Canceled</p>
          </div>
          <div class="mt-2">
            <p class="uppercase semi-bold text-[10px] my-2">total Canceled</p>
            <p class="text-lg lg:text-3xl bold">₦ {{ convertNumber(shopStats.totalCanceled) }}</p>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#1B254B] min-w-32 h-32 max-h-32 drop-shadow-md py-1 px-3 rounded-lg"
        >
          <div class="border-b">
            <p class="uppercase semi-bold text-lg">Net Sales</p>
          </div>
          <div class="mt-2">
            <p class="uppercase semi-bold text-[10px] my-2">total Net sales</p>
            <p class="text-base lg:text-3xl bold">₦ {{ convertNumber(shopStats.totalNetSales) }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1B254B] min-w-36 h-32 drop-shadow-md py-1 px-3 rounded-lg">
          <div class="border-b">
            <p class="uppercase semi-bold text-lg">Commissions</p>
          </div>
          <div class="mt-2">
            <p class="uppercase semi-bold text-[10px] my-2">total Commissions</p>
            <p class="text-lg lg:text-3xl bold">₦ {{ convertNumber(shopStats.totalCommission) }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg">
          <div class="border-b">
            <p class="uppercase semi-bold text-lg">Claimed</p>
          </div>
          <div class="mt-2">
            <p class="uppercase semi-bold text-[10px] my-2">total winnings</p>
            <p class="text-lg lg:text-3xl bold">₦ {{ convertNumber(shopStats.totalWinnings) }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg">
          <div class="border-b">
            <p class="uppercase semi-bold">Net Balance</p>
          </div>
          <div class="mt-2">
            <p class="uppercase semi-bold text-[10px] my-2">total net balance</p>
            <p class="text-lg lg:text-3xl bold">₦ {{ convertNumber(shopStats.totalNetBalance) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <AppTable
        :header="tableHeader"
        :fields="shopTableStats"
        :loading="loading"
        :dataCount="shopTableStats.length"
        :empty="error"
      >
      </AppTable>
    </div>
  </section>
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
const userCode = ref(authStore.user.shopCode)

let tableHeader = reactive([
  {
    label: 'Date',
    key: 'date'
  },
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
    label: 'Winnings',
    key: 'winnings'
  },
  {
    label: 'Commission',
    key: 'commision'
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

const fetchShopGameStats = async () => {
  try {
    loading.value = true
    const res = await axios.get(
      `report/DailyGameReportByShop?FromDate=${yesterday.value}&ToDate=${today.value}&ShopCode=${userCode.value}`
    )
    shopStats.value = res.data
    shopTableStats.value = res.data.items
    loading.value = false
    if (shopTableStats.value.length == 0) {
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
  fetchShopGameStats()
})

watchEffect(() => {
  fetchShopGameStats()
})
</script>

<style scoped></style>

<!-- const fetchShopGameStats = async() => {
    try{
    const res = await axios.get(`report/DailyGameReportByShop?FromDate=2024-06-05&ToDate=2024-06-09&ShopCode=LAG/UNISOFT `)
    console.log(res)
    } catch(err){

    }
}; -->
