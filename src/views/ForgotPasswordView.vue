<template>
  <main class="bg-white dark:bg-navy-900 w-full min-h-screen flex overflow-hidden">
    <!-- Left Section: Reset Form -->
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </button>
        </div>

        <div v-if="showCode" class="space-y-8 animate-in zoom-in duration-500">
          <div class="space-y-2">
            <h1 class="text-3xl font-black text-navy-700 dark:text-white">Verify Identity</h1>
            <p class="text-navy-400 font-medium">We've sent a 6-digit PIN to your registered email.</p>
          </div>

          <div class="space-y-6">
            <div class="space-y-2 text-center">
              <label class="text-xs font-bold text-navy-400 uppercase tracking-widest">Activation PIN</label>
              <OtpPad :length="6" @entered="(v: string) => otpValue = v" />
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">New Password</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.password" 
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full px-5 py-4 bg-gray-50 dark:bg-navy-800 border-2 border-transparent focus:border-brand-500/20 rounded-3xl outline-none text-navy-700 dark:text-white font-bold transition-all shadow-sm"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-5 top-1/2 -translate-y-1/2 text-navy-300">
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

              <div class="space-y-2">
                <label class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">Confirm Password</label>
                <input 
                  v-model="passwordForm.confrimPassword" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full px-5 py-4 bg-gray-50 dark:bg-navy-800 border-2 border-transparent focus:border-brand-500/20 rounded-3xl outline-none text-navy-700 dark:text-white font-bold transition-all shadow-sm"
                />
              </div>
            </div>

            <div v-if="error" class="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 animate-bounce">
              <p class="text-xs font-bold text-red-500 text-center">Passwords do not match. Please verify.</p>
            </div>

            <button 
              @click="submitNewPassword" 
              :disabled="!isPasswordFormValid || processing"
              class="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-3xl shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {{ processing ? 'Updating...' : 'Set New Password' }}
            </button>
          </div>
        </div>

        <div v-else class="space-y-12">
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-5xl font-extrabold text-navy-700 dark:text-white tracking-tight">Forgot Password?</h1>
            <p class="text-navy-400 text-lg font-medium leading-relaxed">Enter your registered email below, and we'll send you a PIN to reset your access.</p>
          </div>

          <form @submit.prevent="handleReset" class="space-y-8">
            <div class="space-y-2">
              <label for="email" class="text-sm font-bold text-navy-700 dark:text-navy-300 ml-1">Email / Username</label>
              <input 
                v-model="form.email"
                type="text" 
                id="email"
                placeholder="Enter your email"
                class="w-full px-5 py-5 bg-gray-50 dark:bg-navy-800 border-2 border-transparent focus:border-brand-500/20 rounded-3xl outline-none text-navy-700 dark:text-white font-bold transition-all shadow-sm"
                required
              />
            </div>

            <div class="space-y-6">
              <button 
                type="submit" 
                :disabled="!isFormValid || processing"
                class="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-3xl shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98]"
              >
                {{ processing ? 'Sending PIN...' : 'Reset Password' }}
              </button>
              
              <div class="text-center">
                <router-link to="/" class="text-sm font-bold text-brand-500 hover:text-brand-600 flex items-center justify-center gap-2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 group-hover:-translate-x-1 transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back to Security Login
                </router-link>
              </div>
            </div>
          </form>
        </div>

        <p class="text-center text-navy-400 font-medium pt-8">
          © {{ new Date().getFullYear() }} MaxiLotto. All rights reserved.
        </p>
      </div>
    </section>

    <!-- Right Section: Visual Banner -->
    <section class="hidden lg:flex flex-1 relative bg-navy-800 animate-in fade-in slide-in-from-right-4 duration-1000 overflow-hidden">
      <img class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay -rotate-12 scale-150" src="@/assets/svg/bg.svg" alt="">
      
      <div class="relative z-10 w-full h-full flex flex-col items-center justify-center p-20 text-center">
        <div class="mb-12">
           <img class="h-24 w-auto drop-shadow-2xl" src="@/assets/images/logo.png" alt="MaxiLotto Logo">
        </div>

        <div class="max-w-md space-y-6">
          <h2 class="text-5xl font-black text-white leading-tight underline decoration-brand-500 underline-offset-8">Security First</h2>
          <p class="text-navy-200 text-xl font-medium leading-relaxed">Protecting your agent account is our top priority. Follow the multi-factor recovery process to regain access safely.</p>
        </div>
      </div>

      <!-- Theme Toggle -->
      <div class="absolute top-12 right-12 z-20">
        <button @click="toggleDark()" class="p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-3xl text-white transition-all active:scale-95 shadow-2xl">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
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
import OtpPad from '../components/OtpPad.vue';
import { useDark, useToggle } from "@vueuse/core";
import axios from 'axios';

const snackbar = useSnackbar();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const authStore = useAuthStore();

const showCode = ref(false);
const showPassword = ref(false);
const processing = ref(false);
const otpValue = ref("");
const error = ref(false);

const form = reactive({
    email: "",
});

const passwordForm = reactive({
    password: "",
    confrimPassword: "",
});

const isFormValid = computed(() => !!form.email);
const isPasswordFormValid = computed(() => !!(passwordForm.password && passwordForm.confrimPassword && otpValue.value));

const handleReset = async () => {
    try {
        processing.value = true;
        const res = await axios.post('authenticate/forgot-password', {
            usernameOrEmail: form.email,
        })
        if (res.status == 200) {
            showCode.value = true;
            snackbar.add({ type: 'success', text: 'Reset code sent to your email' });
        }
    } catch (err: any) {
        snackbar.add({ type: 'error', text: err.response?.data?.message || `Failed to send reset code: ${err.message}` });
    } finally {
        processing.value = false;
    }
};

const submitNewPassword = async () => {
    if (passwordForm.password !== passwordForm.confrimPassword) {
        error.value = true;
        return;
    }
    error.value = false;
    try {
        processing.value = true;
        const res = await axios.post('authenticate/forgot-password-complete', {
            usernameOrEmail: form.email,
            otp: otpValue.value,
            newPassword: passwordForm.password
        })
        if (res.status == 200) {
            snackbar.add({ type: 'success', text: 'Your password has been changed successfully' });
            router.push('/');
        }
    } catch (err: any) {
        snackbar.add({ type: 'error', text: err.response?.data?.message || `Failed to reset password: ${err.message}` });
    } finally {
        processing.value = false;
    }
};
</script>

<style scoped></style>

</script>