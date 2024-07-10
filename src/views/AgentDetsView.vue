<template>
    <section class="bg-white dark:bg-[#111C44] lg:w-[40rem] rounded-2xl">
        <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
            <h2 class="text-base lg:text-2xl font-semibold">Agency Details</h2>
            <button class="bg-blue-800 dark:bg-[#7551FF] text-white py-3 px-2 rounded-lg">Edit Profile</button>
        </div>
        <div>
            <div v-if="loading" class="p-2">
                <Spinner />
            </div>
            <div v-else class="px-10 py-5 space-y-3">
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Full name: </label>
                    <p class="font-semibold">{{ user.accountName }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Address: </label>
                    <p class=" font-semibold">{{ user.address }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Email: </label>
                    <p class=" font-semibold">{{ user.agentEmail }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Phone Number: </label>
                    <p class=" font-semibold">{{ user.agentPhone }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Shop name: </label>
                    <p class=" font-semibold">{{ user.shopName }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Shop code: </label>
                    <p class=" font-semibold">{{ user.shopCode }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">State: </label>
                    <p class=" font-semibold">{{ user.stateName }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Branch name: </label>
                    <p class=" font-semibold">{{ user.branchName }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Area name: </label>
                    <p class=" font-semibold">{{ user.areaName }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Bank: </label>
                    <p class=" font-semibold">{{ user.bankName }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32">Account Number: </label>
                    <p class=" font-semibold">{{ user.accountNumber }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32"> Virtual Account Number: </label>
                    <p class=" font-semibold">{{ user.virtualAccountNumber }}</p>
                </div>
                <div class="flex items-center gap-2 lg:gap-12">
                    <label class="text-[#565674] w-32"> Virtual Bank: </label>
                    <p class=" font-semibold">{{ user.virtualAccountBank }}</p>
                </div>
            </div>
        </div>
    </section>
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