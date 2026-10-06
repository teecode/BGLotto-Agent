<template>
  <!-- A small set of choices where one is always on. Scrolls sideways rather than wrapping on a narrow phone. -->
  <div class="max-w-full overflow-x-auto" role="group" :aria-label="label">
    <div class="inline-flex gap-0.5 rounded-xl bg-navy-100 p-1 dark:bg-navy-800">
      <button
        v-for="option in options"
        :key="option.key"
        type="button"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-bold transition-colors"
        :class="option.key === modelValue
          ? 'bg-white text-navy-700 shadow-sm dark:bg-navy-600 dark:text-white'
          : 'text-navy-500 hover:text-navy-700 dark:hover:text-white'"
        :aria-pressed="option.key === modelValue"
        @click="emit('update:modelValue', option.key)"
      >{{ option.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
defineProps<{
  options: { key: T; label: string }[]
  modelValue: T
  /** What the choice is about, for screen readers */
  label: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: T] }>()
</script>
