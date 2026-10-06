<template>
    <div class="min-h-screen bg-navy-50 dark:bg-navy-900">
        <a href="#main" class="sr-only z-50 rounded-xl bg-brand-500 px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>

        <SideNavigation v-model:open="menuOpen" />

        <div class="lg:pl-64">
            <TopBar @menu="menuOpen = true" />
            <!-- min-w-0 keeps a wide table scrolling inside its own card instead of stretching the page -->
            <main id="main" class="mx-auto w-full min-w-0 max-w-[1500px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10">
                <RouterView></RouterView>
            </main>
        </div>

        <BottomTabs @menu="menuOpen = true" />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notifications';
import SideNavigation from '../components/SideNavigation.vue';
import TopBar from '../components/TopBar.vue';
import BottomTabs from '../components/BottomTabs.vue';

const menuOpen = ref(false);

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const refreshUnread = () => {
    if (document.visibilityState === 'visible') {
        notificationStore.fetchUnreadCount(Number(authStore.user?.shopId ?? 0));
    }
};

// The unread badge is checked on arrival and again whenever the agent comes back to this tab
onMounted(() => {
    refreshUnread();
    document.addEventListener('visibilitychange', refreshUnread);
});
onBeforeUnmount(() => document.removeEventListener('visibilitychange', refreshUnread));
</script>
