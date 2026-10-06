<template>
  <!-- Desktop: always in view down the left edge -->
  <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-100 bg-white dark:border-navy-700 dark:bg-navy-800 lg:flex">
    <RouterLink to="/dashboard" class="flex flex-col items-start gap-1 px-6 pb-3 pt-6" aria-label="MaxiLotto Agent Portal, dashboard">
      <img class="h-7 w-auto" src="@/assets/images/maxilotto.png" alt="MaxiLotto">
      <span class="eyebrow">Agent Portal</span>
    </RouterLink>

    <div class="flex-1 overflow-y-auto px-3 pb-4">
      <NavList />
    </div>

    <div class="border-t border-gray-100 p-3 dark:border-navy-700">
      <div class="flex items-center gap-3 rounded-xl p-2">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300" aria-hidden="true">{{ initials }}</div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold text-navy-700 dark:text-white">{{ fullName }}</p>
          <p class="truncate text-xs text-navy-400">{{ shopLabel }}</p>
        </div>
        <button type="button" class="rounded-lg p-2 text-navy-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400" title="Sign out" aria-label="Sign out" @click="logOut">
          <AppIcon name="logout" class="size-5" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Phone and tablet: the same menu, sliding in over the page -->
  <Transition
    enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200" leave-to-class="opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-sm lg:hidden" aria-hidden="true" @click="close"></div>
  </Transition>

  <aside
    id="mobile-menu"
    class="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-navy-800 lg:hidden"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    :inert="open ? undefined : true"
  >
    <div class="flex items-center justify-between px-5 pb-2 pt-5">
      <div class="flex flex-col items-start gap-1">
        <img class="h-6 w-auto" src="@/assets/images/maxilotto.png" alt="MaxiLotto">
        <span class="eyebrow">Agent Portal</span>
      </div>
      <button ref="closeButton" type="button" class="rounded-xl p-2 text-navy-500 hover:bg-navy-50 dark:hover:bg-navy-700" aria-label="Close menu" @click="close">
        <AppIcon name="close" class="size-6" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
      <NavList roomy @navigate="close" />
    </div>

    <div class="pb-safe border-t border-gray-100 dark:border-navy-700">
      <div class="flex items-center gap-3 p-4">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300" aria-hidden="true">{{ initials }}</div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-bold text-navy-700 dark:text-white">{{ fullName }}</p>
          <p class="truncate text-xs text-navy-400">{{ shopLabel }}</p>
        </div>
        <button type="button" class="btn bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400" @click="logOut">
          <AppIcon name="logout" class="size-5" />
          Sign out
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { clearSession } from '@/services/session';
import AppIcon from './AppIcon.vue';
import NavList from './NavList.vue';

const props = defineProps<{
    /** Whether the phone menu is showing */
    open: boolean
}>();
const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const closeButton = ref<HTMLButtonElement | null>(null);

const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' ') || 'Agent');
const initials = computed(() => {
    const first = authStore.user?.firstName?.charAt(0) ?? '';
    const last = authStore.user?.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || 'A';
});
const shopLabel = computed(() => (authStore.user?.shopCode ? `Shop ${authStore.user.shopCode}` : 'Agent account'));

const close = () => emit('update:open', false);

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
};

// While the menu is open the page behind it stays put, and Escape closes it
watch(() => props.open, async (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
        window.addEventListener('keydown', onKeydown);
        await nextTick();
        closeButton.value?.focus();
    } else {
        window.removeEventListener('keydown', onKeydown);
    }
});

// Any navigation (a link, the back button) closes the menu
watch(() => route.fullPath, close);

onBeforeUnmount(() => {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeydown);
});

const logOut = () => {
    clearSession();
    router.push({ name: 'Home' });
    snackbar.add({
        type: 'success',
        text: 'Successfully logged out'
    });
};
</script>
