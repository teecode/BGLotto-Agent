<template>
  <main class="flex min-h-screen w-full bg-white dark:bg-navy-900">
    <!-- Left Section: Login Form -->
    <section class="relative flex flex-1 items-center justify-center p-6 lg:p-12">
      <!-- Theme toggle -->
      <button
        type="button"
        class="absolute right-5 top-5 rounded-xl p-2.5 text-navy-500 hover:bg-navy-50 dark:hover:bg-navy-800"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleDark()"
      >
        <AppIcon :name="isDark ? 'sun' : 'moon'" class="size-6" />
      </button>

      <div class="w-full max-w-sm">
        <img class="mb-10 h-9 w-auto" src="@/assets/images/maxilotto.png" alt="MaxiLotto">

        <h1 class="text-3xl font-extrabold tracking-tight text-navy-700 dark:text-white">Agent sign in</h1>
        <p class="mt-2 font-medium text-navy-400">Sign in to manage your shop.</p>

        <!-- Why the agent is here, when it was not their own choice -->
        <div v-if="notice" class="mt-6 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm font-medium text-navy-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-white" role="status">
          <AppIcon name="info" class="mt-0.5 size-5 text-brand-500" />
          <span>{{ notice }}</span>
        </div>

        <form class="mt-8 space-y-5" novalidate @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-bold text-navy-700 dark:text-navy-200">Email or username</label>
            <input
              id="email"
              v-model.trim="form.email"
              type="text"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              autofocus
              placeholder="name@agency.com"
              class="w-full rounded-2xl border border-navy-200 bg-white px-4 py-3.5 font-semibold text-navy-700 outline-none transition-colors placeholder:font-medium placeholder:text-navy-300 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              required
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-bold text-navy-700 dark:text-navy-200">Password</label>
              <router-link to="/forgot-password" class="text-sm font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400">Forgot password?</router-link>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Your password"
                class="w-full rounded-2xl border border-navy-200 bg-white py-3.5 pl-4 pr-12 font-semibold text-navy-700 outline-none transition-colors placeholder:font-medium placeholder:text-navy-300 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                required
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1.5 text-xs font-bold text-navy-400 hover:text-navy-700 dark:hover:text-white"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >{{ showPassword ? 'Hide' : 'Show' }}</button>
            </div>
          </div>

          <p v-if="errorMessage" class="rounded-2xl bg-red-50 p-3.5 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400" role="alert">{{ errorMessage }}</p>

          <button
            type="submit"
            :disabled="processing"
            class="btn-primary w-full rounded-2xl py-4 text-base"
          >
            <span v-if="processing" class="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            {{ processing ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="mt-10 text-sm font-medium text-navy-400">
          © {{ new Date().getFullYear() }} MaxiLotto. All rights reserved.
        </p>
      </div>
    </section>

    <!-- Right Section: what the portal is for -->
    <section class="relative hidden flex-1 overflow-hidden bg-navy-800 lg:flex">
      <img class="absolute inset-0 h-full w-full rotate-12 scale-150 object-cover opacity-40 mix-blend-overlay" src="@/assets/svg/bg.svg" alt="">

      <div class="relative z-10 flex h-full w-full flex-col justify-center p-16 xl:p-24">
        <h2 class="max-w-md text-4xl font-extrabold leading-tight text-white">Your shop, in one place.</h2>
        <ul class="mt-10 max-w-md space-y-6">
          <li v-for="point in points" :key="point.title" class="flex items-start gap-4">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <AppIcon :name="point.icon" class="size-6" />
            </span>
            <span>
              <span class="block font-bold text-white">{{ point.title }}</span>
              <span class="mt-0.5 block text-navy-200">{{ point.text }}</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>



<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSnackbar } from "vue3-snackbar";
import { useDark, useToggle } from "@vueuse/core";
import axios from 'axios';
import AppIcon from '@/components/AppIcon.vue';
import type { IconName } from '@/components/AppIcon.vue';
import { safeRedirect } from '@/services/session';

const snackbar = useSnackbar();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const showPassword = ref(false);
const processing = ref(false);
const errorMessage = ref('');

const form = reactive({
  email: "",
  password: ""
});

const points: { icon: IconName; title: string; text: string }[] = [
  { icon: 'trend', title: 'Sales and commission as they happen', text: 'See what your shop has sold and earned, by day, cashier and game.' },
  { icon: 'cash', title: 'Cash out winning tickets', text: 'Check a ticket and pay the winner in a few taps.' },
  { icon: 'users', title: 'Keep an eye on cashiers and terminals', text: 'Reports for every cashier and every terminal in your shop.' },
];

// Where to go once signed in, when the agent was sent here from another page
const redirect = computed(() => safeRedirect(route.query.redirect));

const notice = computed(() => {
  if (route.query.reason !== 'expired') return '';
  return redirect.value
    ? 'Your session expired. Sign in again to pick up where you left off.'
    : 'Your session expired. Please sign in again.';
});

const isFormValid = computed(() => {
  return !!(form.email && form.password);
});

const handleLogin = async () => {
  errorMessage.value = '';
  if (!isFormValid.value) {
    errorMessage.value = 'Enter your email or username and your password.';
    return;
  }
  try {
    processing.value = true;
    const res = await axios.post('authenticate/agentAdmin', {
      usernameOrEmail: form.email,
      password: form.password
    })
    if (res.status == 200) {
      authStore.token = res.data.token;
      authStore.user = res.data;
      snackbar.add({ type: 'success', text: 'Successfully logged in' });
      router.push(redirect.value || '/dashboard');
    }
  } catch (err: any) {
    // The API answers with either { message } or a plain sentence
    const fromServer = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : '');
    errorMessage.value = !err.response
      ? 'Could not reach the server. Check your internet connection and try again.'
      : fromServer || 'Sign in failed. Check your details and try again.';
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped></style>
