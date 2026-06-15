<template>
    <section class="hidden lg:block bg-white dark:bg-navy-800 rounded-3xl w-full max-w-80 h-full max-h-max p-8 drop-shadow-xl border border-gray-100 dark:border-navy-700">
        <div class="flex flex-col items-start justify-between gap-3 h-full ">
            <div class="flex flex-col mt-2 w-full">
                <div class="flex flex-col items-center justify-center mb-10 mt-2">
                    <img class="w-32 object-contain" src="@/assets/images/maxilotto.png" alt="Maxilotto Logo">
                    <h3 class="text-xs font-bold text-navy-400 tracking-widest uppercase mt-1">Agent Portal</h3>
                </div>
                
                <div class="space-y-4 w-full">
                    <router-link to="/dashboard" class="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-brand-50 dark:hover:bg-navy-700">
                        <div class="p-2 rounded-lg bg-brand-50 dark:bg-navy-700 group-hover:bg-brand-500 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </div>
                        <p class="font-medium text-navy-700 dark:text-navy-300 group-hover:text-brand-500 dark:group-hover:text-white">Dashboard</p>
                    </router-link>

                    <router-link to="/dashboard/notifications" class="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-brand-50 dark:hover:bg-navy-700">
                        <div class="relative p-2 rounded-lg bg-brand-50 dark:bg-navy-700 group-hover:bg-brand-500 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                                {{ unreadCount > 9 ? '9+' : unreadCount }}
                            </span>
                        </div>
                        <p class="font-medium text-navy-700 dark:text-navy-300 group-hover:text-brand-500 dark:group-hover:text-white">
                            Notifications
                            <span v-if="unreadCount > 0" class="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold rounded-full">
                                {{ unreadCount }}
                            </span>
                        </p>
                    </router-link>

                    <!-- Agency Management -->
                    <div class="w-full">
                        <div @click="openSub(1)" class="group flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-brand-50 dark:hover:bg-navy-700">
                            <div class="flex items-center gap-3">
                                <div class="p-2 rounded-lg bg-brand-50 dark:bg-navy-700 group-hover:bg-brand-500 group-hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a5.97 5.97 0 0 0-.94 3.197M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                                <p class="font-medium text-navy-700 dark:text-navy-300 group-hover:text-brand-500 dark:group-hover:text-white text-sm">Agency Management</p>
                            </div>
                            <svg :class="{'rotate-180': show}" class="size-4 shrink-0 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        
                        <div v-if="show" class="ml-10 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out">
                            <router-link v-for="(link, idx) in agencyLinks" :key="idx" :to="link.to" class="block py-2 px-3 text-sm font-medium text-navy-400 dark:text-navy-400 hover:text-brand-500 dark:hover:text-white transition-colors relative">
                                <span class="absolute left-[-15px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-200 dark:bg-navy-600"></span>
                                {{ link.label }}
                            </router-link>
                        </div>
                    </div>

                    <!-- Financial Management -->
                    <div class="w-full">
                        <div @click="openSub(2)" class="group flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-brand-50 dark:hover:bg-navy-700">
                            <div class="flex items-center gap-3">
                                <div class="p-2 rounded-lg bg-brand-50 dark:bg-navy-700 group-hover:bg-brand-500 group-hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.107c.19.074.399.025.534-.127L21.787 18m-19.537 0a60.07 60.07 0 0 0 12.016-1.921c.256-.068.528.016.711.228l2.25 2.608M2.25 18.75V16.5a1.5 1.5 0 0 1 1.5-1.5h1.5m.75-3.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.375 18.75h1.5m1.5-1.5v-1.125m0-3.75V12m0 0a3.375 3.375 0 1 0-6.75 0 3.375 3.375 0 0 0 6.75 0Zm0 0a3.375 3.375 0 0 0 6.75 0 3.375 3.375 0 0 0-6.75 0Z" />
                                    </svg>
                                </div>
                                <p class="font-medium text-navy-700 dark:text-navy-300 group-hover:text-brand-500 dark:group-hover:text-white text-sm">Financial Management</p>
                            </div>
                            <svg :class="{'rotate-180': show2}" class="size-4 shrink-0 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        
                        <div v-if="show2" class="ml-10 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out">
                            <router-link v-for="(link, idx) in financialLinks" :key="idx" :to="link.to" class="block py-2 px-3 text-sm font-medium text-navy-400 dark:text-navy-400 hover:text-brand-500 dark:hover:text-white transition-colors relative">
                                <span class="absolute left-[-15px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-200 dark:bg-navy-600"></span>
                                {{ link.label }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full pt-4 border-t border-gray-100 dark:border-navy-700">
                <div class="flex items-center justify-between p-2 rounded-2xl bg-brand-50 dark:bg-navy-900/50">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">
                            {{ initials }}
                        </div>
                        <div class="flex flex-col">
                            <p class="text-sm font-bold text-navy-700 dark:text-white truncate max-w-[120px]">
                                {{ authStore.user.firstName }} {{ authStore.user.lastName }}
                            </p>
                            <p class="text-[10px] text-navy-400 uppercase tracking-wider font-semibold">Agent</p>
                        </div>
                    </div>
                    <button @click="logOut" class="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Logout">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Mobile Navigation -->
    <header class="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-navy-800 shadow-sm sticky top-0 z-40">
        <div class="flex flex-col items-start gap-0.5">
            <img class="w-24 object-contain" src="@/assets/images/maxilotto.png" alt="Maxilotto Logo">
            <h3 class="text-[10px] font-bold text-navy-400 uppercase tracking-widest pl-1">Agent Portal</h3>
        </div>
        <div class="flex items-center gap-2">
            <!-- Notification Bell (mobile header) -->
            <button @click="changeMobileRoute('/dashboard/notifications')" class="relative p-2 rounded-xl bg-brand-50 dark:bg-navy-700 text-brand-500 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
            </button>
            <!-- Hamburger -->
            <button @click="showMobile = !showMobile" class="p-2 rounded-xl bg-brand-50 dark:bg-navy-700 text-brand-500 dark:text-white">
                <svg v-if="!showMobile" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Mobile Drawer Overlay -->
        <div v-show="showMobile" @click="showMobile = false" class="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
        
        <!-- Mobile Drawer -->
        <aside :class="showMobile ? 'translate-x-0' : '-translate-x-full'" 
               class="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-navy-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl p-6 flex flex-col">
            
            <div class="flex flex-col items-center gap-2 mb-8 mt-2 pb-4 border-b border-gray-100 dark:border-navy-700">
                <img class="w-28 object-contain" src="@/assets/images/maxilotto.png" alt="Maxilotto Logo">
                <h3 class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Agent Portal</h3>
            </div>

            <div class="flex-1 overflow-y-auto overflow-x-hidden space-y-2">
                <div @click="changeMobileRoute('dashboard')" class="flex items-center gap-4 p-4 rounded-xl cursor-pointer bg-brand-50 dark:bg-navy-700 text-brand-500 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span class="font-bold">Dashboard</span>
                </div>

                <div @click="changeMobileRoute('/dashboard/notifications')" class="flex items-center justify-between gap-4 p-4 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700">
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-navy-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {{ unreadCount > 9 ? '9+' : unreadCount }}
                            </span>
                        </div>
                        <span class="font-semibold text-navy-700 dark:text-white">Notifications</span>
                    </div>
                    <span v-if="unreadCount > 0" class="px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">
                        {{ unreadCount }}
                    </span>
                </div>

                <!-- Agency Submenu Mobile -->
                <div class="space-y-1">
                    <div @click="openSub(1)" class="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-navy-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a5.97 5.97 0 0 0-.94 3.197M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span class="font-semibold text-navy-700 dark:text-white">Agency Management</span>
                        </div>
                        <svg :class="{'rotate-180': show}" class="size-4 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <div v-show="show" class="ml-10 space-y-2 py-2">
                        <div v-for="(link, idx) in agencyLinks" :key="idx" @click="changeMobileRoute(link.to)" 
                             class="py-2 text-navy-500 dark:text-navy-400 font-medium">
                            {{ link.label }}
                        </div>
                    </div>
                </div>

                <!-- Financial Submenu Mobile -->
                <div class="space-y-1">
                    <div @click="openSub(2)" class="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-navy-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.107c.19.074.399.025.534-.127L21.787 18m-19.537 0a60.07 60.07 0 0 0 12.016-1.921c.256-.068.528.016.711.228l2.25 2.608M2.25 18.75V16.5a1.5 1.5 0 0 1 1.5-1.5h1.5m.75-3.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.375 18.75h1.5m1.5-1.5v-1.125m0-3.75V12m0 0a3.375 3.375 0 1 0-6.75 0 3.375 3.375 0 0 0 6.75 0Zm0 0a3.375 3.375 0 0 0 6.75 0 3.375 3.375 0 0 0-6.75 0Z" />
                            </svg>
                            <span class="font-semibold text-navy-700 dark:text-white">Financials</span>
                        </div>
                        <svg :class="{'rotate-180': show2}" class="size-4 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <div v-show="show2" class="ml-10 space-y-2 py-2">
                        <div v-for="(link, idx) in financialLinks" :key="idx" @click="changeMobileRoute(link.to)" 
                             class="py-2 text-navy-500 dark:text-navy-400 font-medium">
                            {{ link.label }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-auto pt-6 border-t border-gray-100 dark:border-navy-700">
                <div class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-navy-900/50 mb-4">
                    <div class="size-12 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30 text-lg">
                        {{ initials }}
                    </div>
                    <div>
                        <p class="font-bold text-navy-700 dark:text-white">{{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
                        <p class="text-xs text-navy-400">Agent Account</p>
                    </div>
                </div>
                <button @click="logOut" class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notifications';
import { useRouter } from 'vue-router';
import { useSnackbar } from "vue3-snackbar";

const snackbar = useSnackbar();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const initials = ref("");
const show = ref(false);
const show2 = ref(false);
const showMobile = ref(false);

const unreadCount = computed(() => notificationStore.unreadCount);

const agencyLinks = [
    { label: 'Agency Details', to: '/dashboard/agent-details' },
    { label: 'Cashier Details', to: '/dashboard/cashier-details' },
    { label: 'Cashier Reports', to: '/dashboard/cashier-reports' },
    { label: 'Cashier Summary', to: '/dashboard/cashier-summary-report' },
    { label: 'Shop Statistics', to: '/dashboard/shop-statistics' },
    { label: 'Game Statistics', to: '/dashboard/game-statistics' },
    { label: 'Tickets', to: '/dashboard/tickets' },
    { label: 'Transactions', to: '/dashboard/transactions' },
    { label: 'Terminal Statistics', to: '/dashboard/terminal-statistic' },
    { label: 'Lodgement', to: '/dashboard/lodgement' },
];

const financialLinks = [
    { label: 'Payouts', to: '/dashboard/payout' },
    { label: 'Cashout', to: '/dashboard/cashout' },
];

const openSub = (item: number) => {
    if (item === 1) show.value = !show.value;
    if (item === 2) show2.value = !show2.value;
};

const changeMobileRoute = (to: string) => {
    router.push(to.startsWith('/') ? to : `/${to}`);
    showMobile.value = false;
};

const logOut = () => {
    authStore.token = null;
    authStore.user = {};
    router.push({ name: 'Home' });
    snackbar.add({
        type: 'success',
        text: 'Successfully logged out'
    });
};

const getLetters = () => {
    if (authStore.user?.firstName && authStore.user?.lastName) {
        initials.value = `${authStore.user.firstName.charAt(0)}${authStore.user.lastName.charAt(0)}`.toUpperCase();
    }
}

onMounted(() => {
    getLetters();
    const shopId = Number(authStore.user?.shopId ?? 0);
    notificationStore.fetchUnreadCount(shopId);
});
</script>

<style scoped>
.router-link-exact-active {
    @apply bg-brand-50 text-brand-500 !important;
}
.dark .router-link-exact-active {
    @apply bg-navy-700 text-white !important;
}

.router-link-exact-active div {
    @apply bg-brand-500 text-white !important;
}

aside {
    border-top-right-radius: 2rem;
    border-bottom-right-radius: 2rem;
}
</style>