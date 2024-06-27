<template>
    <section class="hidden lg:block bg-white dark:bg-[#111C44] rounded-3xl w-80 h-[40rem] p-10">
        <div class="flex flex-col items-start justify-between gap-3 h-full ">
            <div class="flex flex-col mt-2 ">
                <div class="flex items-center justify-center gap-2">
                    <img class="w-1/4" src="@/assets/images/logo.png" alt="">
                    <h3 class="text-lg font-semibold text-[#2B3674] dark:text-white">Agent Dashboard</h3>
                </div>
                <div>
                    <router-link to="/dashboard" class="flex items-center gap-2 mt-8 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                        <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                            Dashboard</p>
                    </router-link>

                </div>
                <div @click="openSub(1)" class="flex items-center gap-2 mt-4 cursor-pointer">
                    <svg v-if="show" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                    <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white">Agency
                        Management</p>
                </div>
                <div v-if="show" class="ml-8 transition delay-150 duration-300 ease-in-out">
                    <router-link to="/dashboard/agent-details">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Agency Details</p>
                        </div>
                    </router-link>
                    <router-link to="/dashboard/cashier-details">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Cashier Details</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/shop-statistics">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Shop Statistics</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/game-statistics">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Game Statistics</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/tickets">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Tickets</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/transactions">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Transactions</p>
                        </div>
                    </router-link>
                </div>

                <div @click="openSub(2)" class="flex items-center gap-2 mt-4 cursor-pointer">
                    <svg v-if="show2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                    <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">Financial
                        Management</p>
                </div>
                <div v-if="show2" class="ml-8 transition delay-150 duration-300 ease-in-out">
                    <router-link to="/dashboard/reimbursement">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Request Reimbursement</p>
                        </div>
                    </router-link>

                    <div class="flex items-center gap-2 mt-4">
                        <span class="bullet  bg-black dark:bg-white"></span>
                        <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                            Cashout</p>
                    </div>
                </div>

            </div>

            <div class="pb-2 mt-2">
                <div class="flex items-center gap-2 p-1.5 rounded-lg">
                    <div class="rounded-full bg-[#01FF00] p-3 w-12 cursor-pointer">
                        <router-link to="">
                            <p class="uppercase font-semibold text-center">{{ initials }}</p>
                        </router-link>
                    </div>
                    <div>
                        <p class="text-[#2B3674] dark:text-white">{{ authStore.user.firstName }} {{
                    authStore.user.lastName }}</p>
                    </div>
                    <div>
                        <button @click="logOut">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="lg:hidden">
        <div class="" @click="showMobile = !showMobile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </div>
        <div v-if="showMobile" class="fixed z-40 top-4 w-full max-w-sm lg:w-[40rem] bg-white dark:bg-[#111C44] rounded-lg">
            <div class="flex flex-col items-start mt-2 p-2">
                <div class="flex items-center gap-2">
                    <div @click="showMobile = !showMobile">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <img class="w-1/6" src="@/assets/images/logo.png" alt="">
                    <h3 class="text-lg font-semibold text-[#2B3674] dark:text-white">Agent Dashboard</h3>
                </div>
                <div>
                    <router-link to="/dashboard" class="flex items-center gap-2 mt-8 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                        <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                            Dashboard</p>
                    </router-link>

                </div>
                <div @click="openSub(1)" class="flex items-center gap-2 mt-4 cursor-pointer">
                    <svg v-if="show" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                    <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white">Agency
                        Management</p>
                </div>
                <div v-if="show" class="ml-8 transition delay-150 duration-300 ease-in-out">
                    <router-link to="/dashboard/agent-details">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Agency Details</p>
                        </div>
                    </router-link>
                    <router-link to="/dashboard/cashier-details">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Cashier Details</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/shop-statistics">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                               Shop Statistics</p>
                        </div>
                    </router-link>
                    <router-link to="/dashboard/game-statistics">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Game Statistics</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/tickets">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Tickets</p>
                        </div>
                    </router-link>

                    <router-link to="/dashboard/transactions">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet  bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Transactions</p>
                        </div>
                    </router-link>
                </div>

                <div @click="openSub(2)" class="flex items-center gap-2 mt-4 cursor-pointer">
                    <svg v-if="show2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                    <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">Financial
                        Management</p>
                </div>
                <div v-if="show2" class="ml-8 transition delay-150 duration-300 ease-in-out">
                    <router-link to="/dashboard/reimbursement">
                        <div class="flex items-center gap-2 mt-4">
                            <span class="bullet bg-black dark:bg-white"></span>
                            <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                                Request Reimbursement</p>
                        </div>
                    </router-link>

                    <div class="flex items-center gap-2 mt-4">
                        <span class="bullet  bg-black dark:bg-white"></span>
                        <p class="dark:text-[#90909D] text-[#2B3674] hover:text-[#5063cd] dark:hover:text-white  ">
                            Cashout</p>
                    </div>
                </div>

            </div>

            <div class="pb-2 mt-2">
                <div class="flex items-center gap-2 p-1.5 rounded-lg">
                    <div class="rounded-full bg-[#01FF00] p-3 w-12 cursor-pointer">
                        <router-link to="">
                            <p class="uppercase font-semibold text-center">{{ initials }}</p>
                        </router-link>
                    </div>
                    <div>
                        <p class="text-[#2B3674] dark:text-white">{{ authStore.user.firstName }} {{
                    authStore.user.lastName }}</p>
                    </div>
                    <div>
                        <button @click="logOut">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useSnackbar } from "vue3-snackbar";
import axios from 'axios';


const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

let initials = ref("");
let show = ref(false);
let show2 = ref(false);
let showMobile = ref(false);

const openSub = (item: number) => {
    if (item === 1) {
        show.value = !show.value
    }
    if (item === 2) {
        console.log(`hi + ${item}`)
        show2.value = !show2.value
    }

};

const logOut = async () => {
    try {
        const res = await axios.post(`authenticate/Logout`)
        authStore.token = null;
        authStore.user = {};
        router.push({ name: 'Home' });
        snackbar.add({
            type: 'success',
            text: 'Successfully logged out'
        });
    } catch (err: any) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }

};

const getLetters = () => {
    initials.value = `${authStore.user.firstName.charAt(0)}${authStore.user.lastName.charAt(0)}`;
    //   id.value = parseInt(authStore.user.adminId)
}

onMounted(() => {
    getLetters();
});


</script>

<style scoped>
.bullet {
    width: 4px;
    height: 4px;
    border-radius: 100% !important;
}

/* a.router-link-active {
    color: white;
    p{
        color: white;  
    }
} */

/* a.router-link-exact-active {
    p{
        color: white;  
    }
} */

a.dark.router-link-exact-active {
    p {
        color: black;
    }
}
</style>