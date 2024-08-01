<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
            <h2 class="text-base lg:text-2xl font-semibold">Agency Payout</h2>
            <button @click="showModal = !showModal"
                class="bg-blue-800 dark:bg-[#7551FF] text-white py-3 px-2 rounded-lg">Request Payout</button>
        </div>
        <div class="px-3 lg:px-10 py-2 lg:py-5 space-y-3">
            <AppTable :header="tableHeader" :fields="userPayouts" :loading="loading" :paginated="true"
                @pageChange="updatePage" :totalPages="totalPages" :pageSize="pageSize" :totalRecords="totalData"
                :dataCount="userPayouts.length" :empty="error" :dateFilter="true" :dateFilterRange="true" @dateUpdated="updateDateChanged">
                <template #item-requestedDate="{ requestedDate }">
                    {{ format(new Date(requestedDate), 'dd/MM/yyyy hh:mm:ss aaaa') }}
                </template>

            </AppTable>
        </div>

        <Modal :show="showModal">

            <template v-slot:title>
                <h5 class="text-[#565674] text-lg">Create Payout Request</h5>
            </template>

            <template v-slot:description>
                <div class="text-[#2B3674] dark:text-white">
                    <label for="">Enter Desired Amount</label>
                    <input v-model.number="amount" type="text" name="password" placeholder="Enter Amount"
                        class="bg-transparent border border-[#A3AED0] rounded-md pl-3 w-full py-3 outline-none text-sm focus:border-blue-700" />
                </div>
            </template>

            <template v-slot:buttons>
                <div class="w-full flex gap-2 ">
                    <button @click="submitPayout" type="submit" :disabled="!isFormValid"
                        :class="[!isFormValid ? 'cursor-not-allowed opacity-50' : 'bg-blue-800 dark:bg-[#7551FF]  border-none']"
                        class="flex items-center justify-center text-sm space-x-3 cursor-pointer rounded-md border border-[#A3AED0] w-full py-3">
                        <span class="font-bold text-lg" :class="[isFormValid ? 'text-white' : 'text-[#2B3674]']">{{
                processing ? 'processing...' : 'Submit Request' }}</span>
                    </button>
                    <button @click="closeModal"
                        class="text-sm border px-6 py-2.5 font-medium text-white rounded-lg w-full bg-red-600">
                        Cancel
                    </button>
                </div>
            </template>

        </Modal>
    </section>
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

// let user = reactive({}) as Record<string, any>;

// const user:Ref<User | string >  = ref("");

let tableHeader = reactive([
    {
        label: "Date",
        key: "requestedDate"
    },
    {
        label: "ShopName",
        key: "shopName"
    },
    {
        label: "Amount",
        key: "amount"
    },
    {
        label: "Account Name",
        key: "accountName"
    },
    {
        label: "Account Number",
        key: "accountNumber"
    },
    {
        label: "Bank",
        key: "bank"
    },
    {
        label: "Status",
        key: "isPaid"
    }

]);

const userPayouts = ref([]);

const userId = ref(Number(authStore.user.shopId));
let loading = ref();
let showModal = ref(false);
let error = ref(false);
let amount = ref("");
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);
let startDate = ref("");
let endDate = ref("");
let processing = ref(false);


const fetchUserPayout = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`RetailFinance/Payouts?ShopId=${userId.value}&startDate=${startDate.value}&endDate=${endDate.value}`);
        userPayouts.value = res.data.data;
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        loading.value = false;
    } catch (err) {
        console.log(err)
        loading.value = false;
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }
};

const submitPayout = async () => {
    try {
        processing.value = true;
        const res = await axios.post(`/RetailFinance/payment/PayoutRequest`, {
            amount: Number(amount.value)
        })
        if (res.status == 200) {
            processing.value = false;
            snackbar.add({
                type: 'success',
                text: `Payout Request Successful`
            });
            showModal.value = !showModal.value;
            fetchUserPayout();
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }
};

const closeModal = () => {
    amount.value = "";
    showModal.value = !showModal.value
};

const isFormValid = computed(() => {
    return amount.value ? true : false;
})

const updateDateChanged = (updateDate) => {
    startDate.value = updateDate[0];
    endDate.value = updateDate[1];
};

onMounted(() => {
    fetchUserPayout();
});

watchEffect(() => {
    fetchUserPayout();
})


</script>

<style scoped></style>