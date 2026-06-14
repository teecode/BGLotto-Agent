<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Section -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-2">
          <h2 class="text-2xl lg:text-3xl font-bold text-navy-700 dark:text-white tracking-tight">
            Welcome back, {{ authStore.user.firstName }}!
          </h2>
          <p class="text-navy-400 font-medium">Here's what's happening in your shop today.</p>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="bg-brand-50 dark:bg-navy-900 px-6 py-4 rounded-2xl border border-brand-100 dark:border-navy-700 w-full sm:w-auto">
            <p class="text-[10px] uppercase tracking-widest font-bold text-brand-400 mb-1">Wallet Balance</p>
            <p class="text-2xl font-bold text-navy-700 dark:text-white">₦ {{ walletBalance }}</p>
          </div>
          <button
            @click="showModal = true"
            class="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]"
          >
            Request Payout
          </button>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 dark:border-navy-700">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-gray-50 dark:bg-navy-900 flex items-center justify-center text-brand-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-navy-300">Account Number</p>
            <p class="text-sm font-bold text-navy-700 dark:text-navy-100">{{ authStore.user.virtualAccountNumber }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-gray-50 dark:bg-navy-900 flex items-center justify-center text-brand-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold text-navy-300">Virtual Bank</p>
            <p class="text-sm font-bold text-navy-700 dark:text-navy-100">{{ authStore.user.virtualAccountBank }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <div v-for="(stat, idx) in shopStatsList" :key="idx" 
           class="bg-white dark:bg-navy-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700 hover:border-brand-500/30 transition-all group">
        <p class="text-[10px] uppercase tracking-widest font-bold text-navy-300 mb-2 group-hover:text-brand-500 transition-colors">{{ stat.label }}</p>
        <p class="text-lg lg:text-xl font-bold text-navy-700 dark:text-white truncate">₦ {{ stat.value }}</p>
        <p v-if="stat.subLabel" class="text-[10px] text-navy-400 mt-1 font-medium italic opacity-70">{{ stat.subLabel }}</p>
      </div>
    </div>

    <!-- Inoperative Terminals Warning -->
    <div v-if="inoperativeTerminals.length > 0" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-500 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
      <div class="flex items-center gap-3 text-amber-800 dark:text-amber-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h4 class="text-lg font-bold">Terminal Repossession Warning</h4>
      </div>
      <p class="text-amber-700 dark:text-amber-400 font-medium">
        We will be repossessing the following terminals if they remain in-operative (sales less than ₦5,000 and assigned for more than 7 days).
      </p>
      <div class="flex flex-wrap gap-3">
        <div v-for="(term, idx) in inoperativeTerminals" :key="idx" class="bg-white dark:bg-navy-800 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 shadow-sm min-w-[150px]">
          <p class="text-base font-bold text-amber-500 uppercase tracking-widest mb-1">Terminal {{ term.terminalSerial }}</p>
          <p class="text-xs text-navy-600 dark:text-navy-300 font-medium mb-1 truncate">{{ term.cashierName }} (@{{ term.cashierUsername }})</p>
          <p class="text-sm font-bold text-navy-700 dark:text-white">7-Day Sales: ₦ {{ convertNumber(term.totalSales) }}</p>
          <p class="text-[10px] font-medium text-navy-400 mt-1">Assigned: {{ term.assignedDate ? format(new Date(term.assignedDate), 'dd MMM, yyyy') : 'N/A' }}</p>
        </div>
      </div>
    </div>

    <!-- Games & Results Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Games Section -->
      <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">Daily Live Sales</h4>
            <p class="text-3xl font-bold text-brand-500 mt-1">₦ {{ convertNumber(dailySales.totalSales) || 0 }}</p>
          </div>
          <div class="size-14 bg-brand-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center text-brand-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a.5.5 0 00.71 0L21.75 6.5M2.25 18V6.5h19.5V18" />
            </svg>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-sm font-bold text-navy-300 uppercase tracking-widest">Games of the day</h4>
          
          <div v-if="loading2" class="flex items-center justify-center py-10">
            <Loading />
          </div>
          
          <div v-else class="flex gap-4 overflow-x-auto pb-4 scroll-smooth custom-scrollbar">
            <div v-for="game in dailyGames" :key="game.gameId"
                 class="min-w-[160px] bg-gray-50 dark:bg-navy-900 p-4 rounded-2xl border border-transparent hover:border-brand-500/20 transition-all cursor-pointer group"
                 :class="[!game.isActive ? 'opacity-40 grayscale' : '']">
              <div class="relative mb-3">
                <img :src="game.gameImageUrl ? (game.gameImageUrl.startsWith('http') ? game.gameImageUrl : `https://maxilotto.ng/${game.gameImageUrl.replace(/^\//, '')}`) : ''" :alt="game.gameName" class="w-20 h-20 object-contain mx-auto group-hover:scale-110 transition-transform">
                <div v-if="game.isActive" class="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white dark:border-navy-900 shadow-sm animate-pulse"></div>
              </div>
              <div class="text-center space-y-1">
                <p class="text-sm font-bold text-navy-700 dark:text-white truncate">{{ game.gameName }}</p>
                <p class="text-[10px] font-bold text-brand-500">{{ game.gameCode }}</p>
                <div class="pt-2 text-[10px] font-medium text-navy-400 space-y-0.5">
                  <p>Start: {{ format(new Date(game.startDateTime), 'hh:mm a') }}</p>
                  <p>End: {{ format(new Date(game.endDateTime), 'hh:mm a') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700 overflow-hidden flex flex-col h-full">
        <h4 class="text-xl font-bold text-navy-700 dark:text-white mb-6 shrink-0">Latest Results</h4>
        
        <div v-if="loading3" class="flex-1 flex items-center justify-center py-10">
          <Loading />
        </div>
        <div v-else-if="error2 || !dailyGameResults.length" class="flex-1 flex items-center justify-center py-10 text-navy-400 font-medium">
          No results found for today.
        </div>
        <div v-else class="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2" style="max-height: 400px;">
          <div v-for="(resultItem, idx) in dailyGameResults" :key="idx" class="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-navy-900/50 border border-gray-100 dark:border-navy-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hover:bg-gray-100 dark:hover:bg-navy-900 transition-colors">
            
            <!-- Game Info -->
            <div class="flex-1">
              <p class="font-bold text-navy-700 dark:text-white text-base lg:text-lg">{{ resultItem.gameName }}</p>
              <div class="flex items-center gap-2 mt-1.5 text-xs text-navy-400 font-medium">
                <span v-if="resultItem.endDateTime" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Ended: {{ format(new Date(resultItem.endDateTime), 'hh:mm a') }}
                </span>
                <span v-else-if="resultItem.startDateTime" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Date: {{ format(new Date(resultItem.startDateTime), 'dd MMM, yyyy') }}
                </span>
              </div>
            </div>
            
            <!-- Balls -->
            <div class="space-y-3 w-full sm:w-auto">
              <!-- Winning Balls -->
              <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <span class="text-[10px] sm:text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-md">Win</span>
                <div class="flex gap-2 sm:gap-2.5">
                  <span v-for="i in 5" :key="`w-${i}`" class="size-8 sm:size-10 rounded-full bg-brand-500 text-white text-sm sm:text-base font-bold flex items-center justify-center shadow-md shadow-brand-500/20">
                    {{ resultItem.result[`winningBall${i}`] }}
                  </span>
                </div>
              </div>
              
              <!-- Machine Balls -->
              <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <span class="text-[10px] sm:text-xs font-bold text-navy-400 uppercase tracking-widest bg-gray-100 dark:bg-navy-800 px-2 py-1 rounded-md">Mac</span>
                <div class="flex gap-2 sm:gap-2.5">
                  <span v-for="i in 5" :key="`m-${i}`" class="size-8 sm:size-10 rounded-full bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-300 border border-gray-200 dark:border-navy-700 text-sm sm:text-base font-bold flex items-center justify-center shadow-sm">
                    {{ resultItem.result[`machineBall${i}`] }}
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Main Stats Table -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <AppTable
        :header="tableHeader"
        :fields="userStats"
        :loading="loading"
        :totalPages="totalPages"
        :pageSize="pageSize"
        :totalRecords="totalData"
        :empty="error"
        :dateFilter="true"
        @dateUpdated="updateDateChanged"
        :dataCount="userStats.length"
      >
        <template #tableheadertext>Shop Performance History</template>
        <template #item-dateFromLong="{ dateFromLong }">
          <span class="font-bold text-navy-700 dark:text-navy-200">
            {{ format(new Date(dateFromLong), 'dd MMM, yyyy') }}
          </span>
        </template>
        <template #item-sales="{ sales }">₦ {{ convertNumber(sales) }}</template>
        <template #item-cancelled="{ cancelled }">₦ {{ convertNumber(cancelled) }}</template>
        <template #item-netSales="{ netSales }">₦ {{ convertNumber(netSales) }}</template>
        <template #item-commission="{ commission }">₦ {{ convertNumber(commission) }}</template>
        <template #item-claimed="{ claimed }">₦ {{ convertNumber(claimed) }}</template>
        <template #item-balance="{ balance }">
          <span :class="balance < 0 ? 'text-red-500' : 'text-green-500'" class="font-bold">
            ₦ {{ convertNumber(balance) }}
          </span>
        </template>
      </AppTable>
    </div>

    <!-- Shop Activities Table -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h4 class="text-xl font-bold text-navy-700 dark:text-white">Recent Shop Activities</h4>
          <p class="text-sm font-medium text-navy-400 mt-1">Audit log of actions performed by your cashiers</p>
        </div>
      </div>
      <AppTable
        :header="activityTableHeader"
        :fields="shopActivities"
        :loading="loadingActivities"
        :empty="shopActivities.length === 0"
      >
        <template #item-dateCreated="{ dateCreated }">
          <span class="font-bold text-navy-700 dark:text-navy-200">
            {{ format(new Date(dateCreated), 'dd MMM, yyyy hh:mm a') }}
          </span>
        </template>
        <template #item-userName="{ userName }">
           <span class="font-medium text-navy-600 dark:text-navy-300">{{ userName }}</span>
        </template>
        <template #item-action="{ action }">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-500 dark:bg-navy-900 dark:text-brand-300">
            {{ action }}
          </span>
        </template>
        <template #item-details="{ details }">
           <span class="text-sm text-navy-500 dark:text-navy-400">{{ details }}</span>
        </template>
      </AppTable>
    </div>

    <!-- Payout Modal -->
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:title>
        <h5 class="text-xl font-bold text-navy-700 dark:text-white">Create Payout Request</h5>
      </template>

      <template v-slot:description>
        <div class="mt-6 space-y-4">
          <div class="bg-brand-50 dark:bg-navy-900 p-4 rounded-2xl flex justify-between items-center mb-6">
            <span class="text-sm font-medium text-navy-400">Available Balance</span>
            <span class="text-lg font-bold text-navy-700 dark:text-white">₦ {{ walletBalance }}</span>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">Desired Amount</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 font-bold">₦</span>
              <input
                v-model.number="amount"
                type="number"
                placeholder="0.00"
                class="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-navy-900 border-2 border-transparent focus:border-brand-500/20 rounded-2xl outline-none text-navy-700 dark:text-white font-bold transition-all"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-slot:buttons>
        <div class="flex gap-4 mt-8 w-full">
          <button
            @click="closeModal"
            class="flex-1 py-4 px-6 rounded-2xl font-bold text-navy-500 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitPayout"
            :disabled="!isFormValid || processing"
            class="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]"
          >
            {{ processing ? 'Processing...' : 'Submit Request' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect, computed } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import AppTable from '@/components/AppTable.vue'
import Modal from '@/components/Modal.vue'
import Loading from '../components/Loading.vue'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const router = useRouter()

const convertNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

const userStats = ref([])
const userId = ref(Number(authStore.user.shopId))
const loading = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const showModal = ref(false)
const error = ref(false)
const error2 = ref(false)
const amount = ref('')
const processing = ref(false)
const totalData = ref(null)
const totalPages = ref(0)
const pageSize = ref(10)
const startDate = ref('')
const endDate = ref('')
const shopStats = ref({})
const walletData = ref({})
const dailyGames = ref([])
const dailySales = ref({ totalSales: 0 })
const dailyGameResults = ref([])
const shopActivities = ref([])
const inoperativeTerminals = ref([])
const loadingActivities = ref(false)

const today = ref(format(new Date(), 'yyyy-MM-dd'))
const aDayAgo = new Date()
aDayAgo.setDate(aDayAgo.getDate() - 1)
const yesterday = ref(format(new Date(aDayAgo), 'yyyy-MM-dd'))

const shopStatsList = computed(() => {
  return [
    { label: 'Total Sales', value: convertNumber(shopStats.value?.totalSales) || '0', subLabel: 'Today\'s total sales' },
    { label: 'Cancelled', value: convertNumber(shopStats.value?.totalCanceled) || '0', subLabel: 'Today\'s cancelled tickets' },
    { label: 'Net Sales', value: convertNumber(shopStats.value?.totalNetSales) || '0', subLabel: 'Today\'s net sales' },
    { label: 'Claimed', value: convertNumber(shopStats.value?.totalClaimed) || '0', subLabel: 'Today\'s payouts' },
    { label: 'Commission', value: convertNumber(shopStats.value?.totalCommission) || '0', subLabel: 'Today\'s earnings' },
    { label: 'Net Balance', value: convertNumber(shopStats.value?.totalNetBalance) || '0', subLabel: 'Today\'s net balance' },
  ]
})

const tableHeader = [
  { label: 'Date', key: 'dateFromLong' },
  { label: 'Stake', key: 'sales' },
  { label: 'Cancelled', key: 'cancelled' },
  { label: 'Net Sales', key: 'netSales' },
  { label: 'Commission', key: 'commission' },
  { label: 'Claimed', key: 'claimed' },
  { label: 'Balance', key: 'balance' }
]


const activityTableHeader = [
  { label: 'Date', key: 'dateCreated' },
  { label: 'User', key: 'userName' },
  { label: 'Action', key: 'action' },
  { label: 'Details', key: 'details' }
]

const fetchUserStats = async () => {
  try {
    loading.value = true
    const res = await axios.get(
      `/statistics/shop/ticket/dashboard?FromDate=${yesterday.value}&ToDate=${today.value}&ShopId=${userId.value}&Period=Custom`
    )
    userStats.value = res.data
    error.value = userStats.value.length === 0
    loading.value = false
  } catch (err) {
    loading.value = false
    snackbar.add({ type: 'error', text: `Failed to fetch stats: ${err.message}` })
  }
}

const fetchStats = async () => {
  try {
    const res = await axios.get(
      `report/shop/dailygame?FromDate=${today.value}&ToDate=${today.value}&ShopId=${userId.value}`
    )
    shopStats.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const submitPayout = async () => {
  if (!amount.value || amount.value <= 0) return
  try {
    processing.value = true
    const res = await axios.post(`/RetailFinance/payment/PayoutRequest`, {
      amount: Number(amount.value)
    })
    if (res.status === 200) {
      snackbar.add({ type: 'success', text: `Payout Request Successful` })
      showModal.value = false
      amount.value = ''
      fetchWalletBalance()
    }
  } catch (err) {
    snackbar.add({ type: 'error', text: `Payout request failed: ${err.message}` })
  } finally {
    processing.value = false
  }
}

const fetchWalletBalance = async () => {
  try {
    const res = await axios.get(`Retail/shop/GetShopById?ShopId=${userId.value}`)
    walletData.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchDailyGames = async () => {
  try {
    loading2.value = true
    const res = await axios.get(`dailygame/get`)
    dailyGames.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading2.value = false
  }
}

const fetchDailySales = async () => {
  try {
    const res = await axios.get(
      `report/customerterminal/dailygame?fromDate=${today.value}&shopCode=${authStore.user.shopCode}`
    )
    dailySales.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchGamesResult = async () => {
  try {
    loading3.value = true
    const res = await axios.get(
      `DailyGameResult/AllGamesPerPeriodPerGame?StartDate=${today.value}&EndDate=${today.value}`
    )
    dailyGameResults.value = res.data.data
    error2.value = !dailyGameResults.value || dailyGameResults.value.length === 0
  } catch (err) {
    console.error(err)
  } finally {
    loading3.value = false
  }
}

const fetchActivities = async () => {
  try {
    loadingActivities.value = true
    const res = await axios.get(`Retail/shop/${userId.value}/activities?Page=1&PageSize=10`)
    if(res.data && res.data.data) {
      shopActivities.value = res.data.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingActivities.value = false
  }
}

const fetchInoperativeTerminals = async () => {
  try {
    const res = await axios.get(`report/terminals/inoperative-warning?shopId=${userId.value}&days=7&threshold=5000`)
    if(res.data) {
      inoperativeTerminals.value = res.data
    }
  } catch (err) {
    console.error(err)
  }
}

const isFormValid = computed(() => amount.value > 0)

const walletBalance = computed(() => {
  const amount = walletData.value?.walletBalance || 0
  return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
})

const closeModal = () => {
  amount.value = ''
  showModal.value = false
}

const updateDateChanged = (updateDate) => {
  if (updateDate) {
    startDate.value = updateDate[0]
    endDate.value = updateDate[1]
  }
}

onMounted(() => {
  fetchUserStats()
  fetchStats()
  fetchWalletBalance()
  fetchDailyGames()
  fetchDailySales()
  fetchGamesResult()
  fetchActivities()
  fetchInoperativeTerminals()
})

watchEffect(() => {
  fetchUserStats()
  fetchDailySales()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-brand-500/10 rounded-full hover:bg-brand-500/20 transition-colors;
}
</style>
