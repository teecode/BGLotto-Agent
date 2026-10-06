<template>
  <!-- A row of headline figures for a report. Figures are never cut short: the grid gives way before the number does. -->
  <dl class="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6" :class="wide">
    <!-- Label then value from the top, so a tile with a note under its value stays in line with its neighbours -->
    <div
      v-for="figure in figures"
      :key="figure.label"
      class="card flex min-w-0 flex-col gap-1.5 p-4"
    >
      <dt class="eyebrow">{{ figure.label }}</dt>
      <dd>
        <span v-if="loading" class="skeleton h-7 w-4/5"></span>
        <template v-else>
          <span
            class="tabular block whitespace-nowrap text-lg font-bold sm:text-xl"
            :class="figure.negative ? 'text-red-600 dark:text-red-400' : 'text-navy-700 dark:text-white'"
          >{{ figure.value }}</span>
          <span v-if="figure.note" class="mt-0.5 block text-xs font-medium text-navy-400">{{ figure.note }}</span>
        </template>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Figure {
  label: string
  /** Already formatted, e.g. ₦419,545.00 */
  value: string
  note?: string
  /** A balance below zero is the one figure that is set apart by colour */
  negative?: boolean
}

const props = defineProps<{
  figures: Figure[]
  loading?: boolean
}>()

// Five or six figures read better as rows of three than as four and a short row
const wide = computed(() => ([5, 6, 9].includes(props.figures.length) ? 'xl:grid-cols-3' : 'xl:grid-cols-4'))
</script>
