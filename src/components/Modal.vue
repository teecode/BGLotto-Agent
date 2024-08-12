<template>
    <main v-if="show"
        class="backdrop overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex justify-center items-center p-4">
        <div class="flex items-start lg:items-center justify-between flex-col space-y-6 p-6 rounded-md border bg-white py-4 mx-auto overflow-x-auto">
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

<style scoped>
.backdrop {
    background-color: rgba(12, 1, 1, 0.5);
    height: 100vh;
    width: 100vw;
}

</style>