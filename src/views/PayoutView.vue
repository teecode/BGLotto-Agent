<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Section -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Agency Payouts</h2>
          <p class="text-navy-400 font-medium">Manage and track your withdrawal requests</p>
        </div>
        <button 
          @click="showModal = true"
          class="w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]"
        >
          Request Payout
        </button>
      </div>
    </header>

    <!-- Table Section -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700">
      <AppTable 
        :header="tableHeader" 
        :fields="userPayouts" 
        :loading="loading" 
        :paginated="true"
        @pageChange="updatePage" 
        :totalPages="totalPages" 
        :pageSize="pageSize" 
        :totalRecords="totalData"
        :dataCount="userPayouts.length" 
        :empty="error" 
        :dateFilter="true" 
        :dateFilterRange="true" 
        @dateUpdated="updateDateChanged"
      >
        <template #item-requestedDate="{ requestedDate }">
          <div class="space-y-0.5">
            <span class="font-bold text-navy-700 dark:text-navy-200">
              {{ format(new Date(requestedDate), 'dd MMM, yyyy') }}
            </span>
            <p class="text-[10px] text-navy-300">{{ format(new Date(requestedDate), 'hh:mm a') }}</p>
          </div>
        </template>

        <template #item-amount="{ amount }">
          <span class="font-bold text-navy-700 dark:text-white">₦ {{ amount }}</span>
        </template>

        <template #item-isPaid="{ isPaid }">
          <span 
            :class="[
              isPaid 
                ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' 
                : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
            ]"
            class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            {{ isPaid ? 'Paid' : 'Pending' }}
          </span>
        </template>

        <template #item-accountNumber="{ accountNumber, bank }">
          <div class="space-y-0.5">
            <p class="text-sm font-bold text-navy-700 dark:text-white">{{ accountNumber }}</p>
            <p class="text-[10px] text-navy-400 font-medium">{{ bank }}</p>
          </div>
        </template>
      </AppTable>
    </div>

    <!-- Payout Modal -->
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:title>
        <div class="flex items-center justify-between">
          <h5 class="text-xl font-bold text-navy-700 dark:text-white">Create Payout Request</h5>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-navy-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>

      <template v-slot:description>
        <div class="mt-6 space-y-4">
          <div class="bg-brand-50 dark:bg-navy-900 p-6 rounded-2xl border border-brand-100 dark:border-navy-700">
             <div class="flex items-center gap-4 text-brand-500 mb-4">
               <div class="size-10 rounded-xl bg-white dark:bg-navy-800 flex items-center justify-center shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                 </svg>
               </div>
               <div>
                 <p class="text-[10px] uppercase font-bold text-navy-300">Target Bank Account</p>
                 <p class="text-sm font-bold text-navy-700 dark:text-white">Settlement Account</p>
               </div>
             </div>
             <p class="text-xs text-navy-400 leading-relaxed">Your payout will be processed to the settlement bank account associated with your shop profile.</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">Desired Withdrawal Amount</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 font-bold">₦</span>
              <input
                v-model.number="amount"
                type="number"
                placeholder="0.00"
                class="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-navy-900 border-2 border-transparent focus:border-brand-500/20 rounded-2xl outline-none text-navy-700 dark:text-white font-bold transition-all"
              />
            </div>
            <p class="text-[10px] text-navy-300 ml-1 italic">* Transaction fees may apply based on your plan.</p>
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
import { ref, reactive, onMounted, watchEffect, computed } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import AppTable from '@/components/AppTable.vue';
import Modal from '@/components/Modal.vue';

const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

const tableHeader = [
  { label: "Date", key: "requestedDate" },
  { label: "ShopName", key: "shopName" },
  { label: "Amount", key: "amount" },
  { label: "Account Name", key: "accountName" },
  { label: "Account Number", key: "accountNumber" },
  { label: "Status", key: "isPaid" }
];

const userPayouts = ref([]);
const userId = ref(Number(authStore.user.shopId));
const loading = ref(false);
const showModal = ref(false);
const error = ref(false);
const amount = ref("");
const totalData = ref(null);
const totalPages = ref(0);
const pageSize = ref(10);
const startDate = ref("");
const endDate = ref("");
const processing = ref(false);

const fetchUserPayout = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`RetailFinance/Payouts?ShopId=${userId.value}&startDate=${startDate.value}&endDate=${endDate.value}`);
        userPayouts.value = res.data.data;
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        error.value = userPayouts.value.length === 0;
    } catch (err) {
        snackbar.add({ type: 'error', text: `Failed to fetch payouts: ${err.message}` });
    } finally {
        loading.value = false;
    }
};

const submitPayout = async () => {
    if (!amount.value || amount.value <= 0) return;
    try {
        processing.value = true;
        const res = await axios.post(`/RetailFinance/payment/PayoutRequest`, {
            amount: Number(amount.value)
        })
        if (res.status == 200) {
            snackbar.add({ type: 'success', text: `Payout Request Successful` });
            showModal.value = false;
            amount.value = "";
            fetchUserPayout();
        }
    } catch (err) {
        snackbar.add({ type: 'error', text: `Payout request failed: ${err.message}` });
    } finally {
        processing.value = false;
    }
};

const closeModal = () => {
    amount.value = "";
    showModal.value = false;
};

const isFormValid = computed(() => amount.value > 0);

const updateDateChanged = (updateDate) => {
    if (updateDate) {
        startDate.value = updateDate[0];
        endDate.value = updateDate[1];
    }
};

const updatePage = (page) => {
    // Implement pagination if API supports it
    fetchUserPayout();
};

onMounted(() => {
    fetchUserPayout();
});

watchEffect(() => {
    fetchUserPayout();
})
</script>

<style scoped></style>