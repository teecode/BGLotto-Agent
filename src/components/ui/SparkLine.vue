<template>
  <!-- A small line showing the shape of a figure over time. Colour comes from the caller's text colour. -->
  <svg v-if="points" viewBox="0 0 100 32" preserveAspectRatio="none" class="block h-8 w-full overflow-visible" aria-hidden="true">
    <polyline :points="points" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ values: number[] }>()

// Nothing is drawn for fewer than two points: one day has no shape
const points = computed(() => {
  const values = props.values
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 30 - ((value - min) / span) * 26
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
})
</script>
