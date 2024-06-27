<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between gap-12 w-full p-3">
        <date-picker v-model:value="today" type="date" placeholder="Select date" value-type="format"
                format="YYYY-MM-DD"></date-picker>
        </div>
        <div class="p-1">
            <AppTable :header="ticketsTableHeader" :fields="transactions" :loading="loading"
                :totalPages="totalPages" :pageSize="pageSize" :totalRecords="totalData"
                :dataCount="transactions.length" :empty="error">
                <template #item-date="{ date }">
                    {{ format(new Date(date), 'MM/dd/yyyy hh:mm:ss aaaa') }}
                </template>
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

const snackbar = useSnackbar();
const authStore = useAuthStore();


const userId = ref(Number(authStore.user.shopId));
const today = ref(format(new Date(), "yyyy-MM-dd"));
const transactions = ref([]);
let loading = ref(false);
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);
let error = ref(false);

let ticketsTableHeader = reactive([
    {
        label: "Date",
        key: "date"
    },
    {
        label: "Amount",
        key: "amount"
    },
    {
        label: "Balance Before",
        key: "balanceBefore"
    },
    {
        label: "Balance After",
        key: "balanceAfter"
    },
    {
        label: "Posted",
        key: "postedByFullName"
    },
    {
        label: "Transacation type",
        key: "transactionCategoryName"
    }
]);

const fetchTransactions = async () => {
    try {
        const res = await axios.get(`report/ShopWalletTransactionsReport?ShopId=${userId.value}&Date=${today.value}`);
        transactions.value = res.data;
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        if (transactions.value.length == 0) {
            error.value = true
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        })
    }
};

onMounted(() => {
    fetchTransactions();
});

watchEffect(() => {
    fetchTransactions();
});

</script>

<style scoped></style>