<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl p-3">
        <div class="flex items-center justify-between w-full lg:gap-24 p-2">
            <div>
                <div class="flex items-center gap-4">
                    <p>From : {{ yesterday }}</p>
                    <p>To : {{ today }} </p>
                </div>
            </div>
            <date-picker @change="updateDate" v-model:value="setNewDate" type="date" placeholder="Select date" range value-type="format"
                format="YYYY-MM-DD"></date-picker>
        </div>
        <div>
            <div class="flex gap-4 mt-4 overflow-auto p-3">
                <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 max-h-32 drop-shadow-md py-1 px-3 rounded-lg ">
                    <div class="border-b">
                        <p class="uppercase semi-bold text-lg">Sales</p>
                    </div>
                    <div class="mt-2">
                        <p class="uppercase semi-bold text-[10px] my-2">total sales</p>
                        <p class="text-base lg:text-3xl bold">₦ {{ shopStats.totalSales }}</p>
                    </div>
                </div>
                <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg ">
                    <div class="border-b">
                        <p class="uppercase semi-bold text-lg">Winnings</p>
                    </div>
                    <div class="mt-2">
                        <p class="uppercase semi-bold text-[10px] my-2">total winnings</p>
                        <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalWinnings }}</p>
                    </div>
                </div>
                <div class="bg-white dark:bg-[#1B254B] min-w-36 h-32 drop-shadow-md py-1 px-3 rounded-lg ">
                    <div class="border-b">
                        <p class="uppercase semi-bold text-lg">Commissions</p>
                    </div>
                    <div class="mt-2">
                        <p class="uppercase semi-bold text-[10px] my-2">total Commissions</p>
                        <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalCommission }}</p>
                    </div>
                </div>
                <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg ">
                    <div class="border-b">
                        <p class="uppercase semi-bold">Net Balance</p>
                    </div>
                    <div class="mt-2">
                        <p class="uppercase semi-bold text-[10px] my-2">total net balance</p>
                        <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalNetBalance }}</p>
                    </div>
                </div>
                <div class="bg-white dark:bg-[#1B254B] min-w-32 h-32 drop-shadow-md py-1 px-3 rounded-lg ">
                    <div class="border-b">
                        <p class="uppercase semi-bold text-lg">Canceled</p>
                    </div>
                    <div class="mt-2">
                        <p class="uppercase semi-bold text-[10px] my-2">total Canceled</p>
                        <p class="text-lg lg:text-3xl bold">₦ {{ shopStats.totalCanceled }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <AppTable :header="tableHeader" :fields="shopTableStats" :loading="loading"
                :dataCount="shopTableStats.length">

            </AppTable>
        </div>

    </section>
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


const authStore = useAuthStore();
const snackbar = useSnackbar();
let today = ref(format(new Date(), "yyyy-MM-dd"));
const aDayAgo = new Date();
aDayAgo.setDate(aDayAgo.getDate() - 1);
let yesterday = ref(format(new Date(aDayAgo), "yyyy-MM-dd"));
let loading = ref(false);
let setNewDate = ref(new Date());

const shopStats = ref([]);
const shopTableStats = ref([]);
const userId = ref(Number(authStore.user.shopId));

let tableHeader = reactive([
    {
        label: "Date",
        key: "date"
    },
    {
        label: "Cashier",
        key: "customerName"
    },
    {
        label: "ShopName",
        key: "shopName"
    },
    {
        label: "Sales",
        key: "sales"
    },
    {
        label: "Winnings",
        key: "winnings"
    },
    {
        label: "Commission",
        key: "commission"
    },
    {
        label: "Balance",
        key: "net_Balance"
    },
]);

const updateDate = () => {
    today.value = setNewDate.value[1];
    yesterday.value = setNewDate.value[0];
}

const fetchStats = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`report/shop/dailygame?FromDate=${yesterday.value}&ToDate=${today.value}&ShopId=${userId.value}`);
        shopStats.value = res.data;
        shopTableStats.value = res.data.items;
        loading.value = false;
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        })
    }
};


onMounted(() => {
    fetchStats();
});

watchEffect(() => {
    fetchStats();  
});

</script>

<style scoped></style>