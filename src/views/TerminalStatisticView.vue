<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Terminal Statistics</h2>
        <p class="text-navy-400 font-medium mt-1">View performance metrics for all shop terminals</p>
      </div>
      
      <div class="w-full md:w-auto">
        <date-picker v-model:value="date" type="date" range placeholder="Select date range" value-type="format"
            format="YYYY-MM-DD" @change="updateDateFilter" class="custom-datepicker w-full"></date-picker>
      </div>
    </header>

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-navy-700 dark:text-white">Terminal Report</h3>
            <div class="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold rounded-lg text-sm">
                {{ startDate }} to {{ endDate }}
            </div>
        </div>
        
        <AppTable :header="cashierTableHeader" :fields="terminals" :loading="loading2" :empty="error">
            <template #item-sales="{ sales }">₦ {{ convertNumber(sales) }}</template>
            <template #item-cancelled="{ cancelled }">₦ {{ convertNumber(cancelled) }}</template>
            <template #item-netSales="{ sales, cancelled }">₦ {{ convertNumber(sales - cancelled) }}</template>
            <template #item-commision="{ commision }">₦ {{ convertNumber(commision) }}</template>
            <template #item-paid="{ paid }">₦ {{ convertNumber(paid) }}</template>
            <template #item-claimedCount="{ claimedCount }">{{ claimedCount ?? 0 }}</template>
            <template #item-lotto590Sales="{ lotto590Sales }">₦ {{ convertNumber(lotto590Sales) }}</template>
            <template #item-lotto590Commission="{ lotto590Commission }">₦ {{ convertNumber(lotto590Commission) }}</template>
            <template #item-lotto590Winnings="{ lotto590Winnings }">₦ {{ convertNumber(lotto590Winnings) }}</template>
            <template #item-accumulatorSales="{ accumulatorSales }">₦ {{ convertNumber(accumulatorSales) }}</template>
            <template #item-accumulatorCommission="{ accumulatorCommission }">₦ {{ convertNumber(accumulatorCommission) }}</template>
            <template #item-accumulatorWinnings="{ accumulatorWinnings }">₦ {{ convertNumber(accumulatorWinnings) }}</template>
            <template #item-net_Balance="{ net_Balance }">
                <span :class="net_Balance < 0 ? 'text-red-500' : 'text-green-500'" class="font-bold">
                    ₦ {{ convertNumber(net_Balance) }}
                </span>
            </template>
        </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import AppTable from '@/components/AppTable.vue';
import { format } from 'date-fns';
import { convertNumber } from '../services/convertNumber';

const snackbar = useSnackbar();
const authStore = useAuthStore();

let date = ref([format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')]);
let loading2 = ref(false);
let error = ref(false);
let startDate = ref(format(new Date(), 'yyyy-MM-dd'));
let endDate = ref(format(new Date(), 'yyyy-MM-dd'));
const terminals = ref([]);

let cashierTableHeader = reactive([
    {
        label: "Terminal ID",
        key: "terminal"
    },
    {
        label: "Sales",
        key: "sales"
    },
    {
        label: "Cancelled",
        key: "cancelled"
    },
    {
        label: "Net Sales",
        key: "netSales"
    },
    {
        label: "Commission",
        key: "commision"
    },
    {
        label: "Claimed",
        key: "paid"
    },
    {
        label: "Claimed Count",
        key: "claimedCount"
    },
    {
        label: "5/90 Sales",
        key: "lotto590Sales"
    },
    {
        label: "5/90 Comm.",
        key: "lotto590Commission"
    },
    {
        label: "5/90 Claimed",
        key: "lotto590Winnings"
    },
    {
        label: "Accum. Sales",
        key: "accumulatorSales"
    },
    {
        label: "Accum. Comm.",
        key: "accumulatorCommission"
    },
    {
        label: "Accum. Claimed",
        key: "accumulatorWinnings"
    },
    {
        label: "Balance",
        key: "net_Balance"
    },
]);

const updateDateFilter = () => {
    if (date.value && date.value.length === 2) {
        startDate.value = date.value[0];
        endDate.value = date.value[1]; 
    }
};

const fetchTerminalStats = async() => {
    try{
        loading2.value = true;
        error.value = false;
        const res = await axios.get(`report/terminal/dailygame?fromDate=${startDate.value}&toDate=${endDate.value}&shopCode=${authStore.user.shopCode}`)
        terminals.value = res.data.items || [];
        if (terminals.value.length === 0) {
            error.value = true;
        }
        loading2.value = false; 
    } catch(err){
        console.log(err)
        loading2.value = false;
        error.value = true;
        snackbar.add({
            type: 'error',
            text: `Failed to load stats: ${err.message}`
        });
    }
}

watchEffect(() => {
    fetchTerminalStats();
})

</script>

<style scoped>

</style>