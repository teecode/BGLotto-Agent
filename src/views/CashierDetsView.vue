<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
            <h2 class="text-base lg:text-2xl font-semibold">Cashier Details</h2>
        </div>
        <div class="px-3 lg:px-10 py-2 lg:py-5 space-y-3">
            <AppTable :header="cashierTableHeader" :fields="cashierDets" :loading="loading" :paginated="true"
                @pageChange="updatePage" :totalPages="totalPages" :pageSize="pageSize" :totalRecords="totalData"
                :dataCount="cashierDets.length" :empty="error">

                <template #item-action="item">
                    <div>
                        <button @click="editCashier(item)"
                            class="py-2 px-3 bg-blue-800 dark:bg-[#7551FF] text-white rounded-md">Edit
                            Cashier</button>
                    </div>
                </template>
            </AppTable>
        </div>
        <Modal :show="showModal">
            <!-- <template v-slot:icon>
                <button @click="showModal = !showModal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6 dark:bg-black">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            </template> -->

            <template v-slot:title>
                <h5 class="text-[#565674] text-lg">Update {{editCashDets.firstname}} Cashier</h5>
            </template>

            <template v-slot:description>
                <div>
                    <div class="flex items-center gap-2">
                        <label for="" class="dark:text-[#565674]">Cashier Active Status </label>
                        <input type="checkbox" v-model="editCashDets.isActive">
                    </div>
                    <div class="flex items-center gap-2">
                        <label for="" class="dark:text-[#565674]">Deletion Status </label>
                        <input type="checkbox" v-model="editCashDets.canDelete">
                    </div>
                    <div class="flex items-center gap-2">
                        <label for="" class="dark:text-[#565674]">Cashout Status </label>
                        <input type="checkbox" v-model="editCashDets.canCashout">
                    </div>
                    <div class="flex items-center gap-2">
                        <label for="" class="dark:text-[#565674]">Bet Placing Status </label>
                        <input type="checkbox" v-model="editCashDets.canPlaceBet">
                    </div>
                    <div class="flex items-center gap-2">
                        <label for="" class="dark:text-[#565674]">Stake Limit</label>
                        <input type="text" class="text-black border border-[#A3AED0] rounded-sm"
                            v-model="editCashDets.maxStakeLimit">
                    </div>
                </div>
            </template>

            <template v-slot:buttons>
                <div class="w-full flex gap-2 ">
                    <button @click="updateCashier"
                        class="text-sm border px-6 py-2.5 font-medium text-white rounded-lg w-full bg-blue-800 dark:bg-[#7551FF]">Save
                        Changes</button>
                    <button class="text-sm border px-6 py-2.5 font-medium text-white rounded-lg w-full bg-red-600"
                        @click="closeModal">
                        Cancel
                    </button>
                </div>
            </template>

        </Modal>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import logOut from '../services/logout';
import AppTable from '@/components/AppTable.vue';
import Modal from '@/components/Modal.vue'
const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

// let user = reactive({}) as Record<string, any>;

// const user:Ref<User | string >  = ref("");

let cashierDets = reactive([]);

const userId = ref(Number(authStore.user.shopId));

let cashierTableHeader = reactive([
    {
        label: "FirstName",
        key: "firstname"
    },
    {
        label: "LastName",
        key: "firstname"
    },
    {
        label: "ShopName",
        key: "shopName"
    },
    {
        label: "Phone Number",
        key: "phonenumber"
    },
    {
        label: "Action",
        key: "action"
    }
]);

let loading = ref(false);
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);
let showModal = ref(false);
let editCashDets = reactive({});
let error = ref(false);

const fetchCasheirs = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`Retail/cashiers?ShopId=${userId.value}`);
        cashierDets = res.data.data;
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        loading.value = false;
        if (cashierDets.length == 0) {
            error.value = true
        }
    } catch (err) {
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

const updatePage = (pageNumber) => {
    currentPage.value = pageNumber;
};

const editCashier = (item) => {
    showModal.value = !showModal.value;
    editCashDets = item;
};

const closeModal = () => {
    showModal.value = !showModal.value;
    editCashDets = {};
}

const updateCashier = async () => {
    try {
        const res = await axios.put(`Retail/agent-cashier-update`, {
            id: editCashDets.id,
            isActive: editCashDets.isActive,
            canDeleteTicket: editCashDets.canDelete,
            canCashout: editCashDets.canCashout,
            canPlaceBet: editCashDets.canPlaceBet,
            maxStakeLimit: editCashDets.maxStakeLimit
        });
        if(res.status == 200){
            closeModal();
            snackbar.add({
            type: 'success',
            text: `Cashier successfully updated`
        });
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }
};

onMounted(() => {
    fetchCasheirs();
});



</script>

<style scoped></style>