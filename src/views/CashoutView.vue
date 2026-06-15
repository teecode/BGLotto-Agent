<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Section -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex items-center gap-6">
        <div class="size-16 bg-brand-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center text-brand-500 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Ticket Cashout</h2>
          <p class="text-navy-400 font-medium">Verify and payout winning tickets instantly</p>
        </div>
      </div>
    </header>

    <!-- Check Form Section -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2 relative">
          <label class="text-xs font-bold text-navy-400 uppercase tracking-widest ml-1">Principal Agent</label>
          <div 
            class="w-full px-4 py-4 bg-gray-100 dark:bg-navy-800 border-2 border-transparent rounded-2xl cursor-not-allowed transition-all flex items-center justify-between opacity-80"
          >
            <span class="text-navy-700 dark:text-white font-bold">
              {{ authStore.user.firstName }} {{ authStore.user.lastName }} ({{ authStore.user.customerId }})
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold text-navy-400 uppercase tracking-widest ml-1">Ticket ID</label>
          <input 
            v-model="form.ticketId"
            type="text" 
            placeholder="Enter ID"
            class="w-full px-4 py-4 bg-gray-50 dark:bg-navy-900 border-2 border-transparent focus:border-brand-500/20 rounded-2xl outline-none text-navy-700 dark:text-white font-bold transition-all"
          />
        </div>
      </div>
      
      <div class="mt-8">
        <button 
          @click="checkTicketStatus"
          :disabled="!isCheckValid || checking"
          class="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Spinner v-if="checking" class="size-5" />
          {{ checking ? 'Verifying Ticket...' : 'Verify Winning Ticket' }}
        </button>
      </div>
    </div>

    <!-- Info Alert -->
    <div class="bg-navy-900 dark:bg-brand-500/5 p-6 rounded-3xl border border-navy-700 dark:border-brand-500/20 border-dashed">
      <div class="flex gap-4">
        <div class="text-brand-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <div class="space-y-1">
          <p class="text-sm font-bold text-white dark:text-brand-400">Security Requirement</p>
          <p class="text-xs text-navy-300 dark:text-navy-400">Ensure the winning ticket is physically present and valid before processing. Cashouts above shop limit will require admin approval.</p>
        </div>
      </div>
    </div>

    <!-- Cashout Modal -->
    <Modal :show="showModal" @close="closeModal">
      <template v-slot:title>
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-navy-700 w-full">
          <h5 class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-navy-700 to-navy-500 dark:from-white dark:to-gray-300">Confirm Cashout</h5>
          <button @click="closeModal" class="p-2 bg-gray-50 hover:bg-gray-200 dark:bg-navy-900 dark:hover:bg-navy-700 rounded-full transition-all text-navy-500 dark:text-navy-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>

      <template v-slot:description>
        <div class="mt-4 space-y-8 w-full">
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/5 p-6 rounded-3xl border border-green-100 dark:border-green-500/20 shadow-inner">
             <div class="flex items-center gap-4 text-green-600 dark:text-green-400 mb-6">
               <div class="size-12 rounded-2xl bg-white dark:bg-navy-800 flex items-center justify-center shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 text-green-500">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                 <p class="text-xs uppercase tracking-widest font-black text-green-500/80">Validation Success</p>
                 <p class="text-lg font-bold">Ticket is a winner!</p>
               </div>
             </div>
             <div class="grid grid-cols-2 gap-y-4 pt-5 border-t border-green-200 dark:border-green-500/20">
                <div class="space-y-1">
                   <p class="text-[10px] uppercase tracking-widest font-bold text-green-600/60 dark:text-green-400/60">Ticket ID</p>
                   <p class="text-base font-bold text-navy-700 dark:text-white">#{{ form.ticketId }}</p>
                </div>
                <div class="space-y-1 text-right">
                   <p class="text-[10px] uppercase tracking-widest font-bold text-green-600/60 dark:text-green-400/60">Winnings</p>
                   <p class="text-2xl font-black text-green-600 dark:text-green-400 drop-shadow-sm">₦ {{ winningAmount.toLocaleString() }}</p>
                </div>
             </div>
             
             <div v-if="ticketDetails" class="mt-5 pt-4 border-t border-green-200 dark:border-green-500/20">
               <div class="bg-white/50 dark:bg-navy-900/50 rounded-xl p-4 border border-green-100 dark:border-green-500/10">
                 <p class="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
                   This ticket will be registered as cashed out under the principal agent <strong class="text-navy-800 dark:text-white font-black">{{ ticketDetails.payoutByFullName || authStore.user.firstName + ' ' + authStore.user.lastName }}</strong> and the terminal serial <strong class="text-navy-800 dark:text-white font-black">{{ ticketDetails.payoutByTerminalId || 'N/A' }}</strong>.
                 </p>
               </div>
             </div>
          </div>

          <div class="space-y-3">
            <label class="text-xs font-bold text-navy-500 dark:text-navy-300 ml-2 uppercase tracking-widest">Enter Payout PIN</label>
            <input 
              v-model="form.payoutPin"
              type="password" 
              placeholder="••••"
              class="w-full px-6 py-5 bg-gray-50 dark:bg-navy-900 border-2 border-gray-100 dark:border-navy-900 focus:border-brand-500/50 rounded-2xl outline-none text-navy-700 dark:text-white font-black text-center text-3xl tracking-[0.5em] transition-all shadow-inner placeholder:text-gray-300 dark:placeholder:text-navy-700"
            />
            <p class="text-xs text-navy-400 text-center font-medium mt-3">Please ask the customer to provide their payout PIN from the SMS/Slip.</p>
          </div>
        </div>
      </template>

      <template v-slot:buttons>
        <div class="flex gap-4 mt-8 w-full">
          <button
            @click="closeModal"
            class="flex-1 py-4 px-6 rounded-2xl font-bold text-navy-600 dark:text-navy-300 bg-gray-50 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-navy-700 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            @click="cashoutTicket"
            :disabled="!form.payoutPin || cashoutProcessing"
            class="flex-[2] bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-brand-500/50 disabled:to-brand-600/50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Spinner v-if="cashoutProcessing" class="size-5" />
            <span class="text-lg">{{ cashoutProcessing ? 'Processing...' : 'Complete Payout' }}</span>
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { onClickOutside } from '@vueuse/core'
import Spinner from '@/components/Spinner.vue';
import Modal from '@/components/Modal.vue';

const snackbar = useSnackbar();
const authStore = useAuthStore();

const showModal = ref(false);
const checking = ref(false);
const cashoutProcessing = ref(false);
const winningAmount = ref(0);
const ticketDetails = ref(null);

const form = reactive({
    customerId: "",
    ticketId: "",
    payoutPin: ""
});

const isCheckValid = computed(() => {
  return !!(form.customerId && form.ticketId);
});

const checkTicketStatus = async () => {
    if (!isCheckValid.value) return;
    try {
        checking.value = true;
        const res = await axios.post(`Ticket/cash-out-check`, {
            customerId: form.customerId,
            ticketId: form.ticketId
        })
        if (res.status == 200) {
            winningAmount.value = res.data.data.wonAmount || 0;
            ticketDetails.value = res.data.data;
            showModal.value = true;
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: err?.response?.data?.message || err.message || 'Ticket verification failed'
        })
    } finally {
        checking.value = false;
    }
};

const cashoutTicket = async () => {
    if (!form.payoutPin) return;
    try {
        cashoutProcessing.value = true;
        const res = await axios.post(`Ticket/cash-out`, {
            customerId: form.customerId,
            ticketId: form.ticketId,
            payoutPin: form.payoutPin
        })
        if (res.status == 200) {
            snackbar.add({
                type: 'success',
                text: `Ticket successfully Cashout`
            })
            showModal.value = false;
            // Clear form
            form.ticketId = "";
            form.payoutPin = "";
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: err?.response?.data?.message || err.message || 'Cashout failed'
        })
    } finally {
        cashoutProcessing.value = false;
    }
};

const closeModal = () => {
    showModal.value = false;
    form.payoutPin = "";
    ticketDetails.value = null;
}

onMounted(() => {
    form.customerId = authStore.user.customerId;
});
</script>

<style scoped></style>