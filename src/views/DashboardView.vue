<template>
  <section class="bg-white dark:bg-[#111C44] rounded-2xl">
    <div class="flex items-center justify-between lg:gap-12 border-b border-[#2B2B40] px-10 py-5">
      <h2 class="text-base lg:text-2xl font-semibold">
        Welcome {{ authStore.user.firstName }} {{ authStore.user.lastName }}
      </h2>
      <h3 class="text-base lg:text-2xl font-semibold">Wallet Balance : ₦ {{ walletBalance }}</h3>
      <button
        @click="showModal = !showModal"
        class="bg-blue-800 dark:bg-[#7551FF] text-white py-3 px-2 rounded-lg"
      >
        Request Payout
      </button>
    </div>
    <div class="flex items-center gap-2 justify-end py-2 px-10">
      <div class="flex items-center gap-2 lg:gap-6">
        <label class="text-xs lg:text-base text-[#565674]"> Virtual Account Number: </label>
        <p class="font-semibold">{{ authStore.user.virtualAccountNumber }}</p>
      </div>
      <div class="flex items-center gap-2 lg:gap-6">
        <label class="text-xs lg:text-base text-[#565674]"> Virtual Bank: </label>
        <p class="font-semibold">{{ authStore.user.virtualAccountBank }}</p>
      </div>
    </div>
    <div class="px-3 lg:px-10 py-2 lg:py-5 space-y-3">
      <div>
        <div class="w-full flex justify-evenly gap-4 mt-4 overflow-auto p-3">
          <div
            class="bg-white dark:bg-[#1B254B] min-w-32 h-32 max-h-32 drop-shadow-md py-1 px-3 rounded-lg"
          >
            <div class="border-b">
              <p class="uppercase semi-bold text-lg">Sales</p>
            </div>
            <div class="mt-2">
              <p class="uppercase semi-bold text-[10px] my-2">total sales</p>
              <p class="text-base lg:text-3xl bold">₦ {{ shopStats.totalSales }}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg">
            <div class="border-b">
              <p class="uppercase semi-bold text-lg">Canceled</p>
            </div>
            <div class="mt-2">
              <p class="uppercase semi-bold text-[10px] my-2">total Canceled</p>
              <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalCanceled }}</p>
            </div>
          </div>

          <div
            class="bg-white dark:bg-[#1B254B] min-w-32 h-32 max-h-32 drop-shadow-md py-1 px-3 rounded-lg"
          >
            <div class="border-b">
              <p class="uppercase semi-bold text-lg">Net Sales</p>
            </div>
            <div class="mt-2">
              <p class="uppercase semi-bold text-[10px] my-2">Sales - Cancelled</p>
              <p class="text-base lg:text-3xl bold">₦ {{ shopStats.totalNetSales }}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg">
            <div class="border-b">
              <p class="uppercase semi-bold text-lg">Claimed</p>
            </div>
            <div class="mt-2">
              <p class="uppercase semi-bold text-[10px] my-2">total cashout</p>
              <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalWinnings }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-[#1B254B] min-w-36 h-32 drop-shadow-md py-1 px-3 rounded-lg">
            <div class="border-b">
              <p class="uppercase semi-bold text-lg">Commissions</p>
            </div>
            <div class="mt-2">
              <p class="uppercase semi-bold text-[10px] my-2">total Commissions</p>
              <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalCommission }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg">
            <div class="border-b">
              <p class="uppercase semi-bold">Net Balance</p>
            </div>
            <div class="mt-2">
              <p class="uppercase semi-bold text-[10px] my-2">total net balance</p>
              <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalNetBalance }}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h4 class="font-bold">Daily Live Sales</h4>
          <p class="text-base lg:text-2xl font-semibold">{{ dailySales.totalSales }}</p>
        </div>
      </div>
      <div>
        <div>
          <h4 class="font-bold">Games of the day</h4>
          <div>
            <div v-if="loading2">
              <Loading />
            </div>
            <div class="flex gap-4 items-center justify-between w-full mt-3 overflow-auto p-2">
              <div v-for="game in dailyGames" :key="game.gameId">
                <div
                  class="bg-white dark:bg-[#1B254B] flex flex-col items-center min-w-32 max-h-full drop-shadow-md py-1 px-3 rounded-lg"
                  :class="[!game.isActive ? 'opacity-50 cursor-none' : 'opacity-100']"
                >
                  <div>
                    <img
                      :src="`data:image/png;base64,${game.gameBackgroundImageUrl}`"
                      alt=""
                      class="w-24"
                    />
                  </div>
                  <div class="text-center my-2">
                    <h4>{{ game.gameName }}</h4>
                    <h4>{{ game.gameCode }}</h4>
                    <p>
                      <span class="font-bold">Start time </span>:
                      {{ format(new Date(game.startDateTime), 'hh:mm:ss aaaa') }}
                    </p>
                    <p>
                      <span class="font-bold">End time </span>:
                      {{ format(new Date(game.endDateTime), 'hh:mm:ss aaaa') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AppTable
          :fields="dailyGameResults"
          :header="resultTableHeader"
          :loading="loading3"
          :empty="error2"
        >
          <template #item-date="{ date }">
            {{ format(new Date(date), 'MM/dd/yyyy') }}
          </template>
          <template #item-startDateTime="{ startDateTime }">
            {{ format(new Date(startDateTime), 'hh:mm:ss aaaa') }}
          </template>
          <template #item-endDateTime="{ endDateTime }">
            {{ format(new Date(endDateTime), 'hh:mm:ss aaaa') }}
          </template>
          <template #item-result="{ result }">
            <div>
              <p>
                Winnings NOs : {{ result.winningBall1 }} - {{ result.winningBall2 }} -
                {{ result.winningBall3 }} - {{ result.winningBall4 }} - {{ result.winningBall5 }}
              </p>
              <p>
                Machine NOs : {{ result.machineBall1 }} - {{ result.machineBall2 }} -
                {{ result.machineBall3 }} - {{ result.machineBall4 }} - {{ result.machineBall5 }}
              </p>
            </div>
          </template>
        </AppTable>
      </div>

      <div>
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
          <template #item-dateFromLong="{ dateFromLong }">
            {{ format(new Date(dateFromLong), 'dd/MM/yyyy') }}
          </template>
        </AppTable>
      </div>
    </div>

    <Modal :show="showModal">
      <template v-slot:title>
        <h5 class="text-[#565674] text-lg">Create Payout Request</h5>
      </template>

      <template v-slot:description>
        <div class="text-[#2B3674] dark:text-white">
          <label for="">Enter Desired Amount</label>
          <input
            v-model.number="amount"
            type="text"
            name="password"
            placeholder="Enter Amount"
            class="bg-transparent border border-[#A3AED0] rounded-md pl-3 w-full py-3 outline-none text-sm focus:border-blue-700"
          />
        </div>
      </template>

      <template v-slot:buttons>
        <div class="w-full flex gap-2">
          <button
            @click="submitPayout"
            type="submit"
            :disabled="!isFormValid"
            :class="[
              !isFormValid
                ? 'cursor-not-allowed opacity-50'
                : 'bg-blue-800 dark:bg-[#7551FF]  border-none'
            ]"
            class="flex items-center justify-center text-sm space-x-3 cursor-pointer rounded-md border border-[#A3AED0] w-full py-3"
          >
            <span
              class="font-bold text-lg"
              :class="[isFormValid ? 'text-white' : 'text-[#2B3674]']"
              >{{ processing ? 'processing...' : 'Submit Request' }}</span
            >
          </button>
          <button
            @click="closeModal"
            class="text-sm border px-6 py-2.5 font-medium text-white rounded-lg w-full bg-red-600"
          >
            Cancel
          </button>
        </div>
      </template>
    </Modal>
  </section>
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
import { convertNumber } from '../services/convertNumber'
import Loading from '../components/Loading.vue'
const snackbar = useSnackbar()
const authStore = useAuthStore()
const router = useRouter()

// let user = reactive({}) as Record<string, any>;

// const user:Ref<User | string >  = ref("");

let tableHeader = reactive([
  {
    label: 'Date',
    key: 'dateFromLong'
  },
  {
    label: 'Stake',
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
    label: 'Balance',
    key: 'balance'
  }
])

const resultTableHeader = reactive([
  {
    label: 'Date',
    key: 'date'
  },
  {
    label: 'Game name',
    key: 'gameName'
  },
  {
    label: 'Game day',
    key: 'gameDay'
  },
  {
    label: 'Game code',
    key: 'gameCode'
  },
  {
    label: 'Start time',
    key: 'startDateTime'
  },
  {
    label: 'End time',
    key: 'endDateTime'
  },
  {
    label: 'Results',
    key: 'result'
  }
])

const userStats = ref([])

const userId = ref(Number(authStore.user.shopId))
let loading = ref()
let loading2 = ref()
let loading3 = ref(false)
let showModal = ref(false)
let error = ref(false)
let error2 = ref(false)
let amount = ref('')
let processing = ref(false)
let totalData = ref(null)
let totalPages = ref(0)
let pageSize = ref(10)
let startDate = ref('')
let endDate = ref('')
const shopStats = ref([])
let today = ref(format(new Date(), 'yyyy-MM-dd'))
const aDayAgo = new Date()
aDayAgo.setDate(aDayAgo.getDate() - 1)
let yesterday = ref(format(new Date(aDayAgo), 'yyyy-MM-dd'))
const walletData = ref([])
let dailyGames = ref()
let dailySales = ref([])
let dailyGameResults = ref([])

const fetchUserStats = async () => {
  try {
    loading.value = true
    const res = await axios.get(
      `/statistics/shop/ticket/dashboard?FromDate=${yesterday.value}&ToDate=${today.value}&ShopId=${userId.value}&Period=Custom`
    )
    userStats.value = res.data
    if (userStats.value.length == 0) {
      error.value = true
    }
    loading.value = false
  } catch (err) {
    loading.value = false
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const fetchStats = async () => {
  try {
    loading.value = true
    const res = await axios.get(
      `report/shop/dailygame?FromDate=${yesterday.value}&ToDate=${today.value}&ShopId=${userId.value}`
    )
    shopStats.value = res.data
    loading.value = false
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const submitPayout = async () => {
  try {
    processing.value = true
    const res = await axios.post(`/RetailFinance/payment/PayoutRequest`, {
      amount: Number(amount.value)
    })
    if (res.status == 200) {
      processing.value = false
      snackbar.add({
        type: 'success',
        text: `Payout Request Successful`
      })
      showModal.value = !showModal.value
      fetchUserPayout()
    }
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const fetchWalletBalance = async () => {
  try {
    const res = await axios.get(`Retail/shop/GetShopById?ShopId=${userId.value}`)
    walletData.value = res.data
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const fetchDailyGAmes = async () => {
  try {
    loading2.value = true
    const res = await axios.get(`dailygame/get`)
    dailyGames.value = res.data
    loading2.value = false
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const fetchDailySales = async () => {
  try {
    const res = await axios.get(
      `report/customerterminal/dailygame?fromDate=${today.value}&shopCode=${authStore.user.shopCode}`
    )
    dailySales.value = res.data
  } catch (err) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const fetchGamesResult = async () => {
  try {
    loading3.value = true
    const res = await axios.get(
      `DailyGameResult/AllGamesPerPeriodPerGame?StartDate=${today.value}&EndDate=${today.value}`
    )
    dailyGameResults.value = res.data.data
    if (dailyGameResults.length == 0) {
      error2.value = true
    }
    loading3.value = false
  } catch (err) {
    console.log(err)
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    })
  }
}

const isFormValid = computed(() => {
  return amount.value ? true : false
})

const walletBalance = computed(() => {
  let walletAmount = `${walletData.value.walletBalance}`
  return walletAmount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
})

const closeModal = () => {
  amount.value = ''
  showModal.value = !showModal.value
}

const updateDateChanged = (updateDate) => {
  startDate.value = updateDate[0]
  endDate.value = updateDate[1]
}

onMounted(() => {
  fetchUserStats()
  fetchStats()
  fetchWalletBalance()
  fetchDailyGAmes()
  fetchDailySales()
  fetchGamesResult()
})

watchEffect(() => {
  fetchUserStats()
  fetchDailySales()
})
</script>

<style scoped></style>
