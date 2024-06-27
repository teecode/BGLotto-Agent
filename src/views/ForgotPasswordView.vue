<template>
    <main class="bg-white dark:bg-[#0B1437] w-full h-screen  max-h-screen">
        <section class="w-full flex justify-between items-center">
            <div class="p-8 lg:pl-64">
                <div v-if="showCode" class="flex flex-col gap-4 space-y-2">
                    <div class="flex flex-col items-start">
                        <label for="" class="font-bold text-sm text-[#2B3674] dark:text-white mb-4">Enter Pin
                            Recieved</label>
                        <OtpPad :length="6" @entered="(v: string) => otpValue = v" />
                    </div>
                    <div>
                        <label for="" class="font-bold text-sm text-[#2B3674] dark:text-white mb-4">Enter New
                            Password</label>
                    </div>
                    <div class="w-full space-y-1 relative text-[#2B3674] dark:text-white">

                        <label for="password" class="font-semibold text-sm">Password <span
                                class="text-[#4318FF] dark:text-[#7551FF]">*</span></label>
                        <input v-model="passwordForm.password" :type="showPassword ? 'text' : 'password'"
                            name="password" placeholder="Please enter new password"
                            class="bg-transparent border border-[#A3AED0] rounded-md pl-3 w-full py-3 outline-none text-sm focus:border-blue-700" />
                        <img v-if="showPassword" @click="showPassword = false"
                            class="absolute top-8 right-4 cursor-pointer" src="@/assets/svg/showPassword.svg" alt="" />
                        <img v-if="!showPassword" @click="showPassword = true"
                            class="absolute top-8 right-4 cursor-pointer" src="@/assets/svg/eye.svg" alt="" />
                    </div>
                    <div class="w-full space-y-1 relative text-[#2B3674] dark:text-white">
                        <label for="password" class="font-semibold text-sm">Confirm Password <span
                                class="text-[#4318FF] dark:text-[#7551FF]">*</span></label>
                        <input v-model="passwordForm.confrimPassword" :type="showPassword ? 'text' : 'password'"
                            name="password" placeholder="Please re-enter new password"
                            class="bg-transparent border border-[#A3AED0] rounded-md pl-3 w-full py-3 outline-none text-sm focus:border-blue-700" />
                        <img v-if="showPassword" @click="showPassword = false"
                            class="absolute top-8 right-4 cursor-pointer" src="@/assets/svg/showPassword.svg" alt="" />
                        <img v-if="!showPassword" @click="showPassword = true"
                            class="absolute top-8 right-4 cursor-pointer" src="@/assets/svg/eye.svg" alt="" />
                    </div>
                    <div v-if="error">
                        <p class="text-[#2B3674] dark:text-white">Please check passwords and ensure they match</p>
                    </div>
                    <div>
                        <button @click="submitNewPassword" type="submit" :disabled="!isPasswordFormValid"
                            :class="[!isPasswordFormValid ? 'cursor-not-allowed opacity-50' : 'bg-blue-800 dark:bg-[#7551FF]  border-none']"
                            class="flex items-center justify-center text-sm space-x-3 cursor-pointer rounded-md border border-[#A3AED0] w-full py-3">
                            <span class="font-bold text-lg"
                                :class="[isPasswordFormValid ? 'text-white' : 'text-[#2B3674]']">{{
                    processing ? 'processing...' : 'Submit' }}</span>
                        </button>
                    </div>
                </div>
                <div v-else class="flex items-start flex-col gap-6">
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
                        <h1 class="text-[#2B3674] dark:text-white font-bold text-lg lg:text-4xl">Forgot Password</h1>
                        <p class="text-[#A3AED0] text-sm lg:text-base">No worries, we will send to your email
                            password-reset information.</p>
                    </div>
                    <div class="w-full flex flex-col gap-2 text-[#2B3674] dark:text-white">
                        <label for="email" class="font-semibold text-sm">Email or Username <span
                                class="text-[#4318FF] dark:text-[#7551FF]">*</span></label>
                        <input type="email" name="email" v-model="form.email" placeholder="Please enter email"
                            class="bg-transparent border border-[#A3AED0]  rounded-md pl-3 w-full py-3  text-sm outline-none focus:border-blue-700" />
                    </div>
                    <button @click="handleReset" type="submit" :disabled="!isFormValid"
                        :class="[!isFormValid ? 'cursor-not-allowed opacity-50' : 'bg-blue-800 dark:bg-[#7551FF]  border-none']"
                        class="flex items-center justify-center text-sm space-x-3 cursor-pointer rounded-md border border-[#A3AED0] w-full py-3">
                        <span class="font-bold text-lg" :class="[isFormValid ? 'text-white' : 'text-[#2B3674]']">{{
                    processing ? 'processing...' : 'Submit' }}</span>
                    </button>

                    <div class="flex justify-end items-end">
                        <router-link to="/" class="font-bold text-sm text-[#2B3674] dark:text-white">Back to
                            Login</router-link>
                    </div>
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
import OtpPad from '../components/OtpPad.vue'
const snackbar = useSnackbar();

import { useDark, useToggle } from "@vueuse/core";
import axios from 'axios';

const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const authStore = useAuthStore();

let showCode = ref(false);
let showCodeFinal = ref(false);
let showPassword = ref(false);
let processing = ref(false);

const form = reactive({
    email: "",
});

const passwordForm = reactive({
    password: "",
    confrimPassword: "",
});

const isFormValid = computed(() => {
    return form?.email ? true : false;
});

const isPasswordFormValid = computed(() => {
    return passwordForm?.password && passwordForm?.confrimPassword ? true : false;
});

interface Result {
    data: {
        token: string
    }
    status: number,
};


const otpValue = ref("");
let error = ref(false);

const handleReset = async (): Promise<Result | void> => {
    try {
        processing.value = true;
        const res = await axios.post('authenticate/forgot-password', {
            usernameOrEmail: form.email,
        })
        console.log(res)
        if (res.status == 200) {
            showCode.value = !showCode.value;
            processing.value = false;
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
};

const submitNewPassword = async () => {
    if (passwordForm.password === passwordForm.confrimPassword) {
        try {
            processing.value = true;
            const res = await axios.post('authenticate/forgot-password-complete', {
                usernameOrEmail: form.email,
                otp: otpValue.value,
                newPassword: passwordForm.confrimPassword
            })
            console.log(res)
            if (res.status == 200) {
                showCode.value = !showCode.value;
                snackbar.add({
                    type: 'success',
                    text: `Your password has been changed succesfully`
                });
                router.push({name: "Home"});
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
    } else {
        error.value = true;
        processing.value = false;
    }

};

</script>