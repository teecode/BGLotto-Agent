<template>
  <!-- Phone and tablet: the pages an agent reaches for most, under the thumb -->
  <nav class="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur dark:border-navy-700 dark:bg-navy-800/95 lg:hidden" aria-label="Quick access">
    <div class="mx-auto grid max-w-lg grid-cols-5">
      <RouterLink
        v-for="tab in BOTTOM_TABS"
        :key="tab.to"
        :to="tab.to"
        :aria-current="isActive(tab, route.path) ? 'page' : undefined"
        class="relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors"
        :class="isActive(tab, route.path) ? 'text-brand-600 dark:text-brand-300' : 'text-navy-400 hover:text-navy-700 dark:hover:text-white'"
      >
        <span v-if="isActive(tab, route.path)" class="absolute inset-x-5 top-0 h-0.5 rounded-full bg-brand-500" aria-hidden="true"></span>
        <AppIcon :name="tab.icon" class="size-6" />
        {{ tab.title }}
      </RouterLink>

      <button
        type="button"
        class="relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors"
        :class="onOtherPage ? 'text-brand-600 dark:text-brand-300' : 'text-navy-400 hover:text-navy-700 dark:hover:text-white'"
        aria-controls="mobile-menu"
        @click="emit('menu')"
      >
        <span v-if="onOtherPage" class="absolute inset-x-5 top-0 h-0.5 rounded-full bg-brand-500" aria-hidden="true"></span>
        <span class="relative">
          <AppIcon name="menu" class="size-6" />
          <span v-if="unread > 0" class="absolute -right-1 -top-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-navy-800" aria-hidden="true"></span>
        </span>
        Menu
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { BOTTOM_TABS, isActive } from '@/services/navigation'
import { useNotificationStore } from '@/stores/notifications'

const emit = defineEmits<{ menu: [] }>()

const route = useRoute()
// A page that has no tab of its own lives under Menu, so Menu is the one that lights up
const onOtherPage = computed(() => !BOTTOM_TABS.some((tab) => isActive(tab, route.path)))

const notifications = useNotificationStore()
const unread = computed(() => notifications.unreadCount)
</script>
