<template>
  <div
    class="flex h-full flex-col gap-1 rounded-3xl border p-4 shadow-sm sm:p-5"
    :class="lead
      ? 'border-transparent bg-brand-600 text-white'
      : 'border-gray-100 bg-white dark:border-navy-700 dark:bg-navy-800'"
    :title="hint"
  >
    <p class="text-sm font-semibold" :class="lead ? 'text-white/80' : 'text-navy-400'">{{ label }}</p>

    <template v-if="loading">
      <span class="skeleton mt-1 h-8 w-3/4" :class="lead ? '!bg-white/20' : ''"></span>
      <span class="skeleton mt-2 h-4 w-1/2" :class="lead ? '!bg-white/20' : ''"></span>
    </template>

    <template v-else>
      <p class="tabular whitespace-nowrap text-2xl font-bold tracking-tight sm:text-[1.7rem]" :class="lead ? 'text-white' : 'text-navy-700 dark:text-white'">{{ value }}</p>

      <div class="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 text-sm" :class="lead ? 'text-white/80' : 'text-navy-400'">
        <!-- The arrow and the sign carry the meaning; colour only supports it -->
        <span v-if="change" class="tabular inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold" :class="pillClass">
          <span v-if="change.direction !== 'flat'" aria-hidden="true">{{ change.direction === 'up' ? '▲' : '▼' }}</span>
          {{ change.text }}
        </span>
        <span v-if="previous" class="tabular whitespace-nowrap">was {{ previous }}</span>
        <span v-else-if="!change">{{ emptyText }}</span>
      </div>

      <div v-if="$slots.default" class="text-sm" :class="lead ? 'text-white/80' : 'text-navy-400'">
        <slot />
      </div>

      <div v-if="trend && trend.length > 1" class="mt-auto pt-2" :class="lead ? 'text-white/85' : 'text-chart-1'">
        <SparkLine :values="trend" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SparkLine from './SparkLine.vue'
import type { Change } from '@/services/format'

const props = withDefaults(defineProps<{
  label: string
  value: string
  /** How the figure moved against the period before */
  change?: Change | null
  /** The earlier figure, already formatted */
  previous?: string
  /** Whether going up is good news, bad news, or just a fact */
  upIs?: 'good' | 'bad' | 'neutral'
  /** The figure day by day, for the small line */
  trend?: number[]
  /** The one tile the eye should land on first */
  lead?: boolean
  loading?: boolean
  hint?: string
  emptyText?: string
}>(), { upIs: 'neutral', emptyText: 'Nothing in either period' })

const pillClass = computed(() => {
  if (props.lead) return 'bg-white/20 text-white'
  const direction = props.change?.direction
  const good = (direction === 'up' && props.upIs === 'good') || (direction === 'down' && props.upIs === 'bad')
  const bad = (direction === 'up' && props.upIs === 'bad') || (direction === 'down' && props.upIs === 'good')
  if (good) return 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400'
  if (bad) return 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400'
  return 'bg-navy-100 text-navy-500 dark:bg-navy-700'
})
</script>
