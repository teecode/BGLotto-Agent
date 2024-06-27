<template>
    <main v-if="show"
        class="backdrop overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex justify-center items-center p-4">
        <div class="flex justify-between flex-col space-y-6 b-white p-6 rounded-md border bg-white py-4 w-full lg:w-4/12 md:max-w-4/12 mx-auto">
            <slot name="icon"></slot>
            <div class="flex justify-center flex-col space-y-1">
                <slot name="title"></slot>
                <slot name="description"></slot>
            </div>
            <slot name="buttons"></slot>
        </div>
    </main>
</template>

<script setup>
defineProps({
    show: Boolean
})

</script>

<style lang="scss" scoped>

</style>