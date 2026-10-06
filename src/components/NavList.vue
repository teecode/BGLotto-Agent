<template>
  <nav ref="nav" aria-label="Main" class="space-y-0.5">
    <template v-for="group in NAV_GROUPS" :key="group.title || 'top'">
      <p v-if="group.title" class="eyebrow px-3 pb-1 pt-3.5">{{ group.title }}</p>
      <RouterLink
        v-for="link in group.links"
        :key="link.to"
        :to="link.to"
        :aria-current="isActive(link, route.path) ? 'page' : undefined"
        class="group flex items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors"
        :class="[
          roomy ? 'py-3' : 'py-[7px]',
          isActive(link, route.path)
            ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300'
            : 'text-navy-500 hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-700 dark:hover:text-white',
        ]"
        @click="emit('navigate')"
      >
        <AppIcon
          :name="link.icon"
          class="size-5"
          :class="isActive(link, route.path) ? '' : 'text-navy-300 group-hover:text-navy-500 dark:group-hover:text-white'"
        />
        <span class="flex-1 truncate">{{ link.title }}</span>
        <span
          v-if="link.to === '/dashboard/notifications' && unread > 0"
          class="min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white"
          :aria-label="`${unread} unread`"
        >{{ unread > 99 ? '99+' : unread }}</span>
      </RouterLink>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { NAV_GROUPS, isActive } from '@/services/navigation'
import { useNotificationStore } from '@/stores/notifications'

defineProps<{
  /** Taller rows for fingers, used in the phone menu */
  roomy?: boolean
}>()
const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const notifications = useNotificationStore()
const unread = computed(() => notifications.unreadCount)

// On a short screen the menu scrolls; the current page's entry is kept in view.
// The scroll position is set directly: scrollIntoView() would also move the place
// the Tab key starts from, past the "Skip to content" link.
const nav = ref<HTMLElement | null>(null)
const revealCurrent = async () => {
  await nextTick()
  const link = nav.value?.querySelector<HTMLElement>('[aria-current="page"]')
  const scroller = nav.value?.parentElement
  if (!link || !scroller || scroller.scrollHeight <= scroller.clientHeight) return
  const box = scroller.getBoundingClientRect()
  const at = link.getBoundingClientRect()
  if (at.top < box.top) scroller.scrollTop -= box.top - at.top + 8
  else if (at.bottom > box.bottom) scroller.scrollTop += at.bottom - box.bottom + 8
}
onMounted(revealCurrent)
watch(() => route.path, revealCurrent)
</script>
