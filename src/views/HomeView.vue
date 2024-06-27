<template>
    <main class="bg-[#F4F7FE] dark:bg-[#0B1437] w-full h-screen max-h-screen px-4 py-10 lg:p-10 lg:overflow-auto">
        <div class="dark:text-white ">
            <div>
                <img v-if="isDark" src="@/assets/svg/sun.svg" alt="Switch to dark mode"
                    class="absolute top-10 lg:top-8 right-8 sm:top-6  cursor-pointer" @click="toggleDark()" />
                <img v-if="!isDark" src="@/assets/svg/moon.svg" alt="Switch to dark mode"
                    class="absolute top-10 lg:top-8 right-8  cursor-pointer" @click="toggleDark()" />
            </div>
            <section class="flex flex-col lg:flex-row w-full gap-8">
                <SideNavigation  class="w-80"/>
                <RouterView></RouterView>
            </section>

        </div>
    </main>

</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import SideNavigation from '../components/SideNavigation.vue';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style></style>