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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-bold text-navy-400 uppercase tracking-widest ml-1">Customer ID</label>
          <input 
            v-model="form.customerId"
            type="text" 
            placeholder="Enter ID"
            class="w-full px-4 py-4 bg-gray-50 dark:bg-navy-900 border-2 border-transparent focus:border-brand-500/20 rounded-2xl outline-none text-navy-700 dark:text-white font-bold transition-all"
          />
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
        <div class="space-y-2">
          <label class="text-xs font-bold text-navy-400 uppercase tracking-widest ml-1">Terminal ID</label>
          <input 
            v-model="form.terminalId"
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
        <div class="flex items-center justify-between">
          <h5 class="text-xl font-bold text-navy-700 dark:text-white">Confirm Cashout</h5>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-navy-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>

      <template v-slot:description>
        <div class="mt-6 space-y-6">
          <div class="bg-green-50 dark:bg-green-500/10 p-6 rounded-2xl border border-green-100 dark:border-green-500/20">
             <div class="flex items-center gap-4 text-green-600 dark:text-green-400 mb-4">
               <div class="size-10 rounded-xl bg-white dark:bg-navy-800 flex items-center justify-center shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                 <p class="text-[10px] uppercase font-bold text-green-500/70">Validation Success</p>
                 <p class="text-sm font-bold">Ticket is a winner!</p>
               </div>
             </div>
             <div class="grid grid-cols-2 gap-y-4 pt-4 border-t border-green-100 dark:border-green-500/20">
                <div class="space-y-1">
                   <p class="text-[10px] uppercase font-bold text-green-500/60">Ticket ID</p>
                   <p class="text-sm font-bold text-navy-700 dark:text-white">#{{ form.ticketId }}</p>
                </div>
                <div class="space-y-1 text-right">
                   <p class="text-[10px] uppercase font-bold text-green-500/60">Winnings</p>
                   <p class="text-lg font-bold text-green-600">₦ {{ winningAmount }}</p>
                </div>
             </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">Enter Payout PIN</label>
            <input 
              v-model="form.payoutPin"
              type="password" 
              placeholder="••••"
              class="w-full px-4 py-4 bg-gray-50 dark:bg-navy-900 border-2 border-transparent focus:border-brand-500/20 rounded-2xl outline-none text-navy-700 dark:text-white font-bold text-center text-2xl tracking-[1em] transition-all"
            />
            <p class="text-[10px] text-navy-300 text-center mt-2 italic">Please ask the customer to provide their payout PIN from the SMS/Slip.</p>
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
            @click="cashoutTicket"
            :disabled="!form.payoutPin || cashoutProcessing"
            class="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Spinner v-if="cashoutProcessing" class="size-4" />
            {{ cashoutProcessing ? 'Processing...' : 'Complete Payout' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import Spinner from '@/components/Spinner.vue';
import Modal from '@/components/Modal.vue';

const snackbar = useSnackbar();
const authStore = useAuthStore();

const showModal = ref(false);
const checking = ref(false);
const cashoutProcessing = ref(false);
const winningAmount = ref(0);

const form = reactive({
    customerId: "",
    ticketId: "",
    terminalId: "",
    payoutPin: ""
});

const isCheckValid = computed(() => {
  return !!(form.customerId && form.ticketId && form.terminalId);
});

const checkTicketStatus = async () => {
    if (!isCheckValid.value) return;
    try {
        checking.value = true;
        const res = await axios.post(`Ticket/cash-out-check`, {
            customerId: form.customerId,
            ticketId: form.ticketId,
            terminalId: form.terminalId
        })
        if (res.status == 200) {
            winningAmount.value = res.data.winningAmount || 0;
            showModal.value = true;
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Ticket verification failed: ${err.message}`
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
            terminalId: form.terminalId,
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
            text: `Cashout failed: ${err.message}`
        })
    } finally {
        cashoutProcessing.value = false;
    }
};

const closeModal = () => {
    showModal.value = false;
    form.payoutPin = "";
}
</script>

<style scoped></style>