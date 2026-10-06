<template>
  <div>
    <!-- Legend: names sit beside a colour swatch, never in the colour itself -->
    <ul class="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-navy-600 dark:text-navy-200">
      <li v-for="(line, index) in series" :key="line.name" class="flex items-center gap-2">
        <span class="size-2.5 rounded-sm" :class="COLOURS[index % 2].bg" aria-hidden="true"></span>
        {{ line.name }}
      </li>
    </ul>

    <div
      ref="frame"
      class="relative w-full touch-pan-y select-none"
      :style="{ height: `${height}px` }"
      role="img"
      :aria-label="summary"
      @pointermove="onPointer"
      @pointerdown="onPointer"
      @pointerleave="onLeave"
    >
      <svg v-if="width > 0" :width="width" :height="height" class="block overflow-visible">
        <!-- Horizontal grid and the value axis -->
        <g v-for="tick in ticks" :key="tick">
          <line :x1="pad.left" :x2="width - pad.right" :y1="y(tick)" :y2="y(tick)" class="stroke-navy-100 dark:stroke-navy-700" stroke-width="1" />
          <text :x="pad.left - 8" :y="y(tick) + 4" text-anchor="end" class="fill-navy-400 text-[11px]">{{ formatAxis(tick) }}</text>
        </g>

        <!-- Day labels, thinned out to what fits -->
        <template v-for="(label, index) in labels" :key="`x-${index}`">
          <text v-if="showsLabel(index)" :x="x(index)" :y="height - 6" text-anchor="middle" class="fill-navy-400 text-[11px]">{{ label }}</text>
        </template>

        <!-- Where the pointer is -->
        <line v-if="active !== null" :x1="x(active)" :x2="x(active)" :y1="pad.top" :y2="height - pad.bottom" class="stroke-navy-300" stroke-width="1" />

        <g v-for="(line, index) in series" :key="line.name">
          <polyline
            v-if="count > 1"
            :points="line.values.map((value, i) => `${x(i)},${y(value)}`).join(' ')"
            fill="none" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"
            :class="COLOURS[index % 2].stroke"
          />
          <!-- A dot for each day while there are few enough to tell apart -->
          <template v-if="count <= 12">
            <circle
              v-for="(value, i) in line.values" :key="i"
              :cx="x(i)" :cy="y(value)" r="3.5" stroke-width="2"
              class="fill-white dark:fill-navy-800" :class="COLOURS[index % 2].stroke"
            />
          </template>
          <circle
            v-if="active !== null"
            :cx="x(active)" :cy="y(line.values[active] ?? 0)" r="5" stroke-width="2"
            class="stroke-white dark:stroke-navy-800" :class="COLOURS[index % 2].fill"
          />
        </g>
      </svg>

      <!-- Values for the day under the pointer -->
      <div
        v-if="active !== null"
        class="pointer-events-none absolute top-1 z-10 min-w-36 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm shadow-lg dark:border-navy-600 dark:bg-navy-700"
        :style="tooltipStyle"
      >
        <p class="mb-1 font-bold text-navy-700 dark:text-white">{{ labels[active] }}</p>
        <p v-for="(line, index) in series" :key="line.name" class="flex items-center justify-between gap-4 text-navy-500">
          <span class="flex items-center gap-2">
            <span class="size-2 rounded-sm" :class="COLOURS[index % 2].bg" aria-hidden="true"></span>
            {{ line.name }}
          </span>
          <span class="tabular font-bold text-navy-700 dark:text-white">{{ formatValue(line.values[active] ?? 0) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside, useElementSize } from '@vueuse/core'

export interface TrendSeries {
  name: string
  values: number[]
}

const props = withDefaults(defineProps<{
  /** One label per point, oldest first */
  labels: string[]
  /** One or two lines, sharing one value axis */
  series: TrendSeries[]
  height?: number
  /** How a value reads in the tooltip */
  formatValue?: (value: number) => string
  /** How a value reads on the axis, where space is tight */
  formatAxis?: (value: number) => string
}>(), {
  height: 280,
  formatValue: (value: number) => value.toLocaleString('en-US'),
  formatAxis: (value: number) => value.toLocaleString('en-US'),
})

// Written out in full so Tailwind keeps the classes
const COLOURS = [
  { stroke: 'stroke-chart-1', fill: 'fill-chart-1', bg: 'bg-chart-1' },
  { stroke: 'stroke-chart-2', fill: 'fill-chart-2', bg: 'bg-chart-2' },
]

const frame = ref<HTMLElement | null>(null)
const { width } = useElementSize(frame)
const pad = { top: 10, right: 14, bottom: 26, left: 52 }

const count = computed(() => props.labels.length)
const plotWidth = computed(() => Math.max(0, width.value - pad.left - pad.right))
const plotHeight = computed(() => props.height - pad.top - pad.bottom)

/** A round number of the same order, so the axis reads 0, 50K, 100K rather than 0, 47,312, ... */
function niceStep(rough: number): number {
  if (rough <= 0) return 1
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const fraction = rough / power
  return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * power
}

const ticks = computed(() => {
  const highest = Math.max(0, ...props.series.flatMap((line) => line.values))
  const step = niceStep(highest / 4)
  const top = Math.max(step, Math.ceil(highest / step) * step)
  const out: number[] = []
  for (let value = 0; value <= top + step / 2; value += step) out.push(value)
  return out
})
const top = computed(() => ticks.value[ticks.value.length - 1] || 1)

const x = (index: number) => pad.left + (count.value <= 1 ? plotWidth.value / 2 : (index * plotWidth.value) / (count.value - 1))
const y = (value: number) => pad.top + plotHeight.value - (Math.max(0, value) / top.value) * plotHeight.value

// As many day labels as fit, counted back from the newest so that it is always named
const labelStep = computed(() => Math.max(1, Math.ceil(count.value / Math.max(1, Math.floor(plotWidth.value / 62)))))
const showsLabel = (index: number) => (count.value - 1 - index) % labelStep.value === 0

const active = ref<number | null>(null)

function onPointer(event: PointerEvent) {
  if (!frame.value || count.value === 0) return
  const left = frame.value.getBoundingClientRect().left
  const position = event.clientX - left - pad.left
  const index = count.value <= 1 ? 0 : Math.round((position / plotWidth.value) * (count.value - 1))
  active.value = Math.min(count.value - 1, Math.max(0, index))
}

// A mouse leaving clears the read-out; a finger lifting leaves it up until the next tap elsewhere
function onLeave(event: PointerEvent) {
  if (event.pointerType === 'mouse') active.value = null
}
onClickOutside(frame, () => { active.value = null })

const tooltipStyle = computed(() => {
  if (active.value === null) return {}
  const at = x(active.value)
  return at > width.value / 2 ? { right: `${width.value - at + 12}px` } : { left: `${at + 12}px` }
})

const summary = computed(() => {
  if (count.value === 0) return 'No data'
  const parts = props.series.map((line) => `${line.name}: ${props.formatValue(line.values.reduce((sum, value) => sum + value, 0))} in total`)
  return `Line chart, ${props.labels[0]} to ${props.labels[count.value - 1]}. ${parts.join('. ')}.`
})
</script>
