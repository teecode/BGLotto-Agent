<template>
  <main class="bg-white dark:bg-navy-900 w-full min-h-screen flex overflow-hidden">
    <!-- Left Section: Login Form -->
    <section class="flex-1 flex items-center justify-center p-6 lg:p-12 animate-in fade-in slide-in-from-left-4 duration-1000">
      <div class="w-full max-w-md space-y-12">
        <!-- Logo for Mobile -->
        <div class="lg:hidden flex justify-center mb-8">
          <img class="h-12 w-auto" src="@/assets/images/logo.png" alt="MaxiLotto Logo">
        </div>

        <!-- Dark Mode Toggle Mobile -->
        <div class="lg:hidden absolute top-8 right-8">
          <button @click="toggleDark()" class="p-3 bg-gray-100 dark:bg-navy-800 rounded-2xl text-navy-700 dark:text-white transition-all active:scale-95 shadow-sm">
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <h1 class="text-4xl lg:text-5xl font-extrabold text-navy-700 dark:text-white tracking-tight">Agent Sign In</h1>
          <p class="text-navy-400 text-lg font-medium">Powering the future of retail lottery.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <div class="space-y-6">
            <div class="space-y-2">
              <label for="email" class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">Email / Username</label>
              <div class="relative group">
                <input 
                  type="text" 
                  id="email"
                  v-model="form.email" 
                  placeholder="name@agency.com"
                  class="w-full px-5 py-4 bg-gray-50 dark:bg-navy-800 border-2 border-transparent focus:border-brand-500/20 focus:bg-white dark:focus:bg-navy-900 rounded-3xl outline-none text-navy-700 dark:text-white font-bold transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between ml-1">
                <label for="password" class="text-sm font-bold text-navy-700 dark:text-navy-300">Password</label>
                <router-link to="/forgot-password" class="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Forgot Password?</router-link>
              </div>
              <div class="relative group">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password"
                  v-model="form.password" 
                  placeholder="••••••••"
                  class="w-full px-5 py-4 bg-gray-50 dark:bg-navy-800 border-2 border-transparent focus:border-brand-500/20 focus:bg-white dark:focus:bg-navy-900 rounded-3xl outline-none text-navy-700 dark:text-white font-bold transition-all shadow-sm"
                  required
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500 transition-colors"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="!isFormValid || processing"
            class="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-5 rounded-3xl shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <span v-if="processing" class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ processing ? 'Authenticating...' : 'Sign In Now' }}
            <svg v-if="!processing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 group-hover:translate-x-1 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>

        <p class="text-center text-navy-400 font-medium pt-8">
          © {{ new Date().getFullYear() }} MaxiLotto. All rights reserved.
        </p>
      </div>
    </section>

    <!-- Right Section: Visual Banner -->
    <section class="hidden lg:flex flex-1 relative bg-navy-800 animate-in fade-in slide-in-from-right-4 duration-1000 overflow-hidden">
      <!-- Background SVG with improved styling -->
      <img class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay rotate-12 scale-150" src="@/assets/svg/bg.svg" alt="">
      
      <!-- Content Overlay -->
      <div class="relative z-10 w-full h-full flex flex-col items-center justify-center p-20 text-center">
        <div class="mb-12 flex flex-col items-center gap-6">
           <img class="h-24 w-auto drop-shadow-2xl" src="@/assets/images/logo.png" alt="MaxiLotto Logo">
           <div class="h-1.5 w-24 bg-brand-500 rounded-full"></div>
        </div>

        <div class="max-w-md space-y-6">
          <h2 class="text-5xl font-black text-white leading-tight">Empowering Global Retail Agents</h2>
          <p class="text-navy-200 text-xl font-medium leading-relaxed">Access your dashboard, manage sales, and monitor transactions with our premium agent administration portal.</p>
        </div>

        <!-- Float Stats Mockup -->
        <div class="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-sm">
           <div class="bg-white/10 backdrop-blur-3xl p-8 rounded-[40px] border border-white/20 shadow-2xl flex items-center justify-between gap-8">
              <div class="text-left">
                 <p class="text-navy-200 text-xs font-bold uppercase tracking-widest mb-1">Total Network Sales</p>
                 <p class="text-white text-3xl font-black tracking-tight">₦ 45M+</p>
              </div>
              <div class="size-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307L19.062 9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 12V9h-3" />
                </svg>
              </div>
           </div>
        </div>
      </div>

      <!-- Theme Toggle Desktop -->
      <div class="absolute top-12 right-12 z-20">
        <button 
          @click="toggleDark()" 
          class="p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-3xl text-white transition-all active:scale-95 group shadow-2xl"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 transition-transform group-hover:rotate-45">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 transition-transform group-hover:-rotate-12">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>
      </div>
    </section>
  </main>
</template>



<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSnackbar } from "vue3-snackbar";
import { useDark, useToggle } from "@vueuse/core";
import axios from 'axios';

const snackbar = useSnackbar();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const processing = ref(false);

const form = reactive({
  email: "",
  password: ""
});

const isFormValid = computed(() => {
  return !!(form.email && form.password);
});

const handleLogin = async () => {
  if (!isFormValid.value) return;
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
      router.push('/dashboard');
    }
  } catch (err: any) {
    snackbar.add({
      type: 'error',
      text: err.response?.data?.message || `Authentication failed: ${err.message}`
    });
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped></style>
