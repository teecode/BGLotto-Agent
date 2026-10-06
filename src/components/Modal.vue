<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0"
        >
            <!-- On a phone the dialog sits at the bottom, within reach of the thumb -->
            <div v-if="show"
                class="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-navy-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                @mousedown.self="emit('close')">
                <div
                    ref="panel"
                    role="dialog"
                    aria-modal="true"
                    tabindex="-1"
                    :class="['pb-safe flex max-h-[92vh] w-full flex-col space-y-6 overflow-y-auto rounded-t-3xl border border-gray-100 bg-white p-6 shadow-2xl outline-none dark:border-navy-700 dark:bg-navy-800 sm:rounded-3xl sm:p-8', maxWidth]">
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
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
    show: Boolean,
    maxWidth: {
        type: String,
        default: 'max-w-lg'
    }
})

// Asked for by Escape or a click outside the dialog; the parent decides whether to close
const emit = defineEmits(['close'])

const panel = ref(null)

const onKeydown = (event) => {
    if (event.key === 'Escape') emit('close')
}

// While a dialog is open the page behind it stays put, and focus moves into the dialog
watch(() => props.show, async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
        window.addEventListener('keydown', onKeydown)
        await nextTick()
        const first = panel.value?.querySelector('input, select, textarea')
        ;(first ?? panel.value)?.focus()
    } else {
        window.removeEventListener('keydown', onKeydown)
    }
}, { immediate: true })

onBeforeUnmount(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
})
</script>
