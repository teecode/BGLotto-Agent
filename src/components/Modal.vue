<template>
    <main v-if="show"
        class="backdrop overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex justify-center items-center p-4">
        <div :class="['flex flex-col space-y-6 p-8 rounded-[2rem] border border-gray-100 dark:border-navy-700 bg-white dark:bg-navy-800 shadow-2xl mx-auto w-full transform transition-all', maxWidth]">
            <slot name="icon"></slot>
            <div class="flex flex-col w-full">
                <slot name="title"></slot>
                <div class="mt-2 w-full">
                    <slot name="description"></slot>
                </div>
            </div>
            <div class="w-full">
                <slot name="buttons"></slot>
            </div>
        </div>
    </main>
</template>

<script setup>
defineProps({
    show: Boolean,
    maxWidth: {
        type: String,
        default: 'max-w-lg'
    }
})

</script>

<style scoped>
.backdrop {
    background-color: rgba(12, 1, 1, 0.5);
    height: 100vh;
    width: 100vw;
}

</style>