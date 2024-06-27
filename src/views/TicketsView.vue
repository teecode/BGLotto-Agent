<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between gap-12 w-full p-3">
            <select class="text-black border border-gray-400 rounded-lg p-1" v-model="selectedCashier">
                <option value="" disabled selected>Choose a Cashier</option>
                <option :value="cash.id" v-for="cash in cashierDets">{{ cash.firstname }} {{ cash.lastname }}</option>

            </select>
            <date-picker v-model:value="today" type="date" placeholder="Select date" value-type="format"
                format="YYYY-MM-DD"></date-picker>
        </div>
        <div class="p-1">
            <AppTable :header="ticketsTableHeader" :fields="tickets" :loading="loading" :paginated="true"
                @pageChange="updatePage" :totalPages="totalPages" :pageSize="pageSize" :totalRecords="totalData"
                :dataCount="tickets.length" :empty="error">
                <template #item-gameDate="{ gameDate }">
                    {{ format(new Date(gameDate), 'MM/dd/yyyy hh:mm:ss aaaa') }}
                </template>
                <template #item-game="{game}">
                        {{ game.name }}
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
const tickets = ref([]);
let cashierDets = reactive([]);
let loading = ref(false);
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);
let selectedCashier = ref("");
let error = ref(false);


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
        label: "Won Amount",
        key: "wonAmount"
    }
]);

const fetchTickets = async () => {
    try {
        const res = await axios.get(`/Ticket/registered-tickets?Date=${today.value}&CustomerId=${selectedCashier.value}&Page=1&PageSize=${pageSize.value}`);
        tickets.value = res.data.data
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        console.log(res)
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
        console.log(res.data)
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

onMounted(() => {
    fetchTickets();
    fetchCasheirs();
});

watchEffect(() => {
    fetchTickets();
});

</script>

<style scoped></style>