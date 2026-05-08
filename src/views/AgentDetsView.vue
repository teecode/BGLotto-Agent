<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <!-- Decorative background glow -->
      <div class="absolute -right-20 -top-20 size-64 bg-brand-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div class="flex items-center gap-6 z-10 w-full">
        <!-- Initial Bubble -->
        <div class="size-20 lg:size-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-brand-500/30 shrink-0">
          {{ user?.accountName ? user.accountName.charAt(0) : 'A' }}
        </div>
        
        <div class="flex-1">
          <h2 class="text-2xl lg:text-3xl font-bold text-navy-700 dark:text-white">{{ user.accountName || 'Agency Profile' }}</h2>
          <div class="flex items-center gap-2 mt-2">
            <span class="px-3 py-1 bg-brand-50 dark:bg-navy-900 text-brand-500 dark:text-brand-300 text-xs font-bold rounded-full uppercase tracking-wider">Active Agent</span>
            <span class="text-navy-400 font-medium text-sm">{{ user.shopCode || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Grid Container -->
    <div v-if="loading" class="flex justify-center p-12">
      <Spinner />
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      
      <!-- Personal Info Card -->
      <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-navy-700">
          <div class="p-2.5 rounded-xl bg-blue-50 text-blue-500 dark:bg-navy-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-navy-700 dark:text-white">Personal Info</h3>
        </div>
        
        <div class="space-y-4 flex-1">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Full Name</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.accountName || '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Email Address</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.agentEmail || '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Phone Number</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.agentPhone || '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Address</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.address || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Shop Details Card -->
      <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-navy-700">
          <div class="p-2.5 rounded-xl bg-purple-50 text-brand-500 dark:bg-navy-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.999 2.999 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-navy-700 dark:text-white">Shop Details</h3>
        </div>
        
        <div class="space-y-4 flex-1">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Shop Name</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.shopName || '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Shop Code</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.shopCode || '-' }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">State</label>
              <p class="font-bold text-navy-700 dark:text-white">{{ user.stateName || '-' }}</p>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Branch</label>
              <p class="font-bold text-navy-700 dark:text-white">{{ user.branchName || '-' }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Area Name</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.areaName || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Bank Details Card -->
      <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-navy-700">
          <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 dark:bg-navy-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-navy-700 dark:text-white">Bank Information</h3>
        </div>
        
        <div class="space-y-4 flex-1">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Primary Bank</label>
            <p class="font-bold text-navy-700 dark:text-white">{{ user.bankName || '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Account Number</label>
            <div class="flex items-center gap-2">
                <p class="font-bold text-navy-700 dark:text-white text-xl font-mono tracking-wider">{{ user.accountNumber || '-' }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-navy-700 border-dashed space-y-4">
            <div class="flex flex-col gap-1">
                <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Virtual Bank</label>
                <p class="font-bold text-navy-700 dark:text-white">{{ user.virtualAccountBank || '-' }}</p>
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-[11px] font-bold text-navy-300 uppercase tracking-widest">Virtual Account</label>
                <div class="flex items-center gap-2">
                    <p class="font-bold text-emerald-500 text-xl font-mono tracking-wider">{{ user.virtualAccountNumber || '-' }}</p>
                </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import logOut from '../services/logout';
import Spinner from '../components/Spinner.vue';
const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

// let user = reactive({}) as Record<string, any>;

// const user:Ref<User | string >  = ref("");

const user = ref([]);

const userId = ref(Number(authStore.user.shopId));
let loading = ref()

const fetchUserdets = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`Retail/shop/GetShopById?ShopId=${userId.value}`);
        user.value = res.data
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

onMounted(() => {
    fetchUserdets();
});


</script>

<style scoped></style>