<template>
  <!-- A ranked list: each row's bar is drawn against the largest value -->
  <ol class="space-y-3.5">
    <li v-for="(item, index) in items" :key="item.label + index">
      <div class="flex items-baseline justify-between gap-4">
        <span class="min-w-0 truncate font-semibold text-navy-700 dark:text-white" :title="item.label">{{ item.label }}</span>
        <span class="tabular shrink-0 whitespace-nowrap font-bold text-navy-700 dark:text-white">{{ item.display }}</span>
      </div>
      <div class="mt-1.5 h-2 rounded bg-navy-100 dark:bg-navy-700" role="presentation">
        <div class="h-full min-w-0.5 rounded bg-chart-1" :style="{ width: `${share(item.value)}%` }"></div>
      </div>
      <p v-if="item.note" class="tabular mt-1 truncate text-xs text-navy-400">{{ item.note }}</p>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BarItem {
  label: string
  value: number
  /** The value as it should read, e.g. ₦12,400 */
  display: string
  note?: string
}

const props = defineProps<{ items: BarItem[] }>()

const largest = computed(() => Math.max(0, ...props.items.map((item) => item.value)))
const share = (value: number) => (largest.value > 0 ? Math.max(0, (value / largest.value) * 100) : 0)
</script>
