<template>
  <main class="bg-white dark:bg-[#0B1437] w-full h-screen  max-h-screen">
    <section class="w-full flex justify-between items-center">
      <div class="p-8 lg:pl-64">
        <div class="flex items-start flex-col gap-6">
          <div class="lg:hidden">
            <img class="w-3/5 mx-auto" src="@/assets/images/logo.png" alt="">
          </div>
          <div class="lg:hidden">
            <img v-if="isDark" src="@/assets/svg/sun.svg" alt="Switch to dark mode"
              class="absolute top-14 right-8 sm:top-6  cursor-pointer" @click="toggleDark()" />
            <img v-if="!isDark" src="@/assets/svg/moon.svg" alt="Switch to dark mode"
              class="absolute top-14 right-8 sm:top-6 cursor-pointer" @click="toggleDark()" />
          </div>
          <div>
            <h1 class="text-[#2B3674] dark:text-white font-bold text-lg lg:text-4xl">Sign In</h1>
            <p class="text-[#A3AED0] text-sm lg:text-base">Enter your email and password to sign in!</p>
          </div>
          <div class="w-full flex flex-col gap-2 text-[#2B3674] dark:text-white">
            <label for="email" class="font-semibold text-sm">Email <span
                class="text-[#4318FF] dark:text-[#7551FF]">*</span></label>
            <input type="email" name="email" v-model="form.email" placeholder="Please enter email"
              class="bg-transparent border border-[#A3AED0]  rounded-md pl-3 w-full py-3  text-sm outline-none focus:border-blue-700" />
          </div>
          <div class="w-full space-y-1 relative text-[#2B3674] dark:text-white">
            <label for="password" class="font-semibold text-sm">Password <span
                class="text-[#4318FF] dark:text-[#7551FF]">*</span></label>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" name="password"
              placeholder="Please enter password"
              class="bg-transparent border border-[#A3AED0] rounded-md pl-3 w-full py-3 outline-none text-sm focus:border-blue-700" />
            <img v-if="showPassword" @click="showPassword = false" class="absolute top-8 right-4 cursor-pointer"
              src="@/assets/svg/showPassword.svg" alt="" />
            <img v-if="!showPassword" @click="showPassword = true" class="absolute top-8 right-4 cursor-pointer"
              src="@/assets/svg/eye.svg" alt="" />
          </div>
          <div class="flex justify-end items-end">
            <router-link to="/forgot-password" class="font-bold text-sm text-[#2B3674] dark:text-white">Forgot
              Password?</router-link>
          </div>

          <button @click="handleLogin" type="submit" :disabled="!isFormValid"
            :class="[!isFormValid ? 'cursor-not-allowed opacity-50' : 'bg-blue-800 dark:bg-[#7551FF]  border-none']"
            class="flex items-center justify-center text-sm space-x-3 cursor-pointer rounded-md border border-[#A3AED0] w-full py-3">
            <span class="font-bold text-lg" :class="[isFormValid ? 'text-white' : 'text-[#2B3674]']">{{
              processing ? 'processing...' : 'Login' }}</span>
          </button>
        </div>
      </div>
      <div class="relative">
        <img class="hidden lg:block h-full max-h-screen" src="@/assets/svg/bg.svg" alt="">
        <div class="absolute top-14 right-8">
          <img class="w-2/5 mx-auto" src="@/assets/images/logo.png" alt="">
        </div>
        <div>
          <img v-if="isDark" src="@/assets/svg/sun.svg" alt="Switch to dark mode"
            class="absolute top-14 right-8 sm:top-6  cursor-pointer" @click="toggleDark()" />
          <img v-if="!isDark" src="@/assets/svg/moon.svg" alt="Switch to dark mode"
            class="absolute top-14 right-8 sm:top-6 cursor-pointer" @click="toggleDark()" />
        </div>

      </div>
    </section>
  </main>
</template>


<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSnackbar } from "vue3-snackbar";
const snackbar = useSnackbar();

import { useDark, useToggle } from "@vueuse/core";
import axios from 'axios';

const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const authStore = useAuthStore();

let showPassword = ref(false);
let processing = ref(false);

const form = reactive({
  email: "",
  password: ""
});

const isFormValid = computed(() => {
  return form?.email && form?.password ? true : false;
});

interface Result {
  data: {
    token: string
  }
  status: number,
}

const handleLogin = async (): Promise< Result | void > => {
  try {
    processing.value = true;
    const res = await axios.post('authenticate/agentAdmin', {
      usernameOrEmail: form.email,
      password: form.password
    })
    console.log(res)
    if (res.status == 200) {
      router.push({ name: 'Dashboard' })
      processing.value = false;
      snackbar.add({
        type: 'success',
        text: 'Successfully logged in'
      });
      authStore.token = res.data.token;
      authStore.user = res.data;
    }
  } catch (err: any) {
    snackbar.add({
      type: 'error',
      text: `Please contact support ${err.message}`
    });
    if (err.response.status == 500) {
      snackbar.add({
        type: 'error',
        text: 'Please contact support'
      });
    }
  }
}

</script>
