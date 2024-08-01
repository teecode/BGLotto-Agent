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
                <template #item-game="{ game }">
                    {{ game.name }}
                </template>
                <template #item-view="item">
                    <div>
                        <button @click="openShowModal(item)"
                            class="bg-blue-800 dark:bg-[#7551FF] text-white py-3 px-2 rounded-lg">
                            View Ticket
                        </button>
                    </div>
                </template>
            </AppTable>
        </div>
        <Modal :show="showModal">
            <template v-slot:title>
                <div class="flex items-center justify-between bg-white">
                    <h5 class="text-[#565674] text-lg">Bet Slips</h5>
                    <div>
                        <button @click="closeModal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>

            </template>

            <template v-slot:description>
                <div class="text-[#2B3674] dark:text-white">
                    <TicketTable :betslips="ticketDetails?.betslips"></TicketTable>
                </div>
            </template>
        </Modal>
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
        label: "Won Amount",
        key: "wonAmount"
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