<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Filters Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Ticket History</h2>
          <p class="text-navy-400 font-medium">View and manage shop ticket records</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div class="flex-1 md:flex-none min-w-[200px]">
            <select 
              v-model="selectedCashier"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-900 border-none rounded-xl text-sm text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled selected>Choose a Cashier</option>
              <option v-for="cash in cashierDets" :key="cash.id" :value="cash.id">
                {{ cash.firstname }} {{ cash.lastname }}
              </option>
            </select>
          </div>
          
          <div class="flex-1 md:flex-none">
            <date-picker 
              v-model:value="today" 
              type="date" 
              placeholder="Select date" 
              value-type="format"
              format="YYYY-MM-DD"
              class="custom-datepicker"
            ></date-picker>
          </div>
        </div>
      </div>
    </header>

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700">
      <AppTable 
        :header="ticketsTableHeader" 
        :fields="tickets" 
        :loading="loading" 
        :paginated="true"
        @pageChange="updatePage" 
        :totalPages="totalPages" 
        :pageSize="pageSize" 
        :totalRecords="totalData"
        :dataCount="tickets.length" 
        :empty="error"
        @rowClicked="openShowModal"
      >
        <template #item-gameDate="{ gameDate }">
          <span class="font-bold text-navy-700 dark:text-navy-200">
            {{ format(new Date(gameDate), 'dd MMM, yyyy') }}
          </span>
          <p class="text-[10px] text-navy-300">{{ format(new Date(gameDate), 'hh:mm a') }}</p>
        </template>
        
        <template #item-game="{ game }">
          <div class="flex items-center gap-2">
            <div class="size-2 rounded-full bg-brand-500"></div>
            <span class="font-bold">{{ game.name }}</span>
          </div>
        </template>

        <template #item-amount="{ amount }">
          <span class="font-bold">₦ {{ amount }}</span>
        </template>



        <template #item-view="item">
          <button 
            @click.stop="openShowModal(item)"
            class="px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-navy-900 dark:hover:bg-navy-700 text-brand-500 font-bold rounded-xl text-xs transition-all active:scale-[0.95]"
          >
            View Ticket
          </button>
        </template>
      </AppTable>
    </div>

    <!-- Ticket Modal -->
    <Modal :show="showModal" @close="closeModal" maxWidth="max-w-6xl">
      <template v-slot:title>
        <div class="flex items-center justify-between">
          <h5 class="text-xl font-bold text-navy-700 dark:text-white">Ticket Details</h5>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-navy-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>

      <template v-slot:description>
        <div class="mt-6 space-y-6">
          <div v-if="ticketDetails" class="relative overflow-hidden flex flex-col md:grid md:grid-cols-2 gap-6 bg-gradient-to-r from-brand-900 to-brand-700 dark:from-navy-900 dark:to-navy-800 p-6 md:p-8 rounded-3xl border border-brand-800 shadow-xl">
            <div class="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-32 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <div class="relative z-10 flex flex-col">
              <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">Ticket ID</p>
              <p class="text-lg font-bold text-white mt-1">#{{ ticketDetails.id }}</p>
            </div>
            <div class="md:text-right relative z-10 flex flex-col md:items-end">
              <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">Played By</p>
              <div class="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-sm w-fit">
                 <div class="size-5 rounded-full bg-brand-500 flex items-center justify-center">
                    <svg class="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </div>
                 <p class="text-sm font-bold text-white">{{ ticketDetails.playedBy }}</p>
              </div>
            </div>
            <div class="mt-2 md:mt-4 relative z-10">
              <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest">Total Stake</p>
              <p class="text-3xl font-black text-white mt-1">₦ {{ ticketDetails.amount }}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <h6 class="text-sm font-bold text-navy-700 dark:text-white mb-4 ml-1">Bet Slips</h6>
            <div class="bg-white/50 dark:bg-navy-800/50 rounded-3xl overflow-hidden">
              <TicketTable :betslips="ticketDetails?.betslips"></TicketTable>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:buttons>
        <div class="mt-8 flex justify-end">
          <button 
            @click="closeModal"
            class="px-8 py-3 bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-white font-bold rounded-2xl hover:bg-navy-200 dark:hover:bg-navy-700 transition-all active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import AppTable from '@/components/AppTable.vue';
import Modal from '@/components/Modal.vue';
import TicketTable from '@/components/TicketTable.vue'

const snackbar = useSnackbar();
const authStore = useAuthStore();


const userId = ref(Number(authStore.user.shopId));
const today = ref(format(new Date(), "yyyy-MM-dd"));
const tickets = ref([]);
let cashierDets = reactive([]);
let loading = ref(false);
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);
let selectedCashier = ref("");
let error = ref(false);
let showModal = ref(false);
let ticketDetails = ref([]);


let ticketsTableHeader = reactive([
    {
        label: "Date",
        key: "gameDate"
    },
    {
        label: "Ticket Id",
        key: "id"
    },
    {
        label: "Cashier",
        key: "playedBy"
    },
    {
        label: "Game",
        key: "game"
    },
    {
        label: "Amount",
        key: "amount"
    },

    {
        label: "View Ticket",
        key: "view"
    }
]);

const fetchTickets = async () => {
    try {
        const res = await axios.get(`/Ticket/registered-tickets?Date=${today.value}&CustomerId=${selectedCashier.value}&Page=1&PageSize=${pageSize.value}`);
        tickets.value = res.data.data
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        if (tickets.value.length == 0) {
            error.value = true
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        })
    }
};

const fetchCasheirs = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`Retail/cashiers?ShopId=${userId.value}`);
        cashierDets = res.data.data;
        loading.value = false;
    } catch (err) {
        console.log(err)
        if (err?.response?.status == 401) {
            console.log(`this ran`)
            logOut()
        }
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }
};

const openShowModal = (item) => {
    showModal.value = !showModal.value;
    console.log(item)
    ticketDetails.value = item;
};

const closeModal = () => {
    showModal.value = !showModal.value
    ticketDetails.value = [];
};

const updatePage = () => {

};

onMounted(() => {
    fetchTickets();
    fetchCasheirs();
});

watchEffect(() => {
    fetchTickets();
});

</script>

<style scoped></style>