<template>
  <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-100 bg-white/90 px-4 backdrop-blur dark:border-navy-700 dark:bg-navy-800/90 sm:px-6 lg:px-8">
    <!-- Phone: menu button and logo -->
    <button
      type="button"
      class="-ml-2 rounded-xl p-2 text-navy-500 hover:bg-navy-50 dark:hover:bg-navy-700 lg:hidden"
      aria-label="Open menu"
      aria-controls="mobile-menu"
      @click="emit('menu')"
    >
      <AppIcon name="menu" class="size-6" />
    </button>
    <RouterLink to="/dashboard" class="lg:hidden" aria-label="Dashboard">
      <img class="h-6 w-auto" src="@/assets/images/maxilotto.png" alt="MaxiLotto">
    </RouterLink>

    <!-- Desktop: where this page sits in the menu -->
    <nav v-if="place" class="hidden min-w-0 items-center gap-2 text-sm lg:flex" aria-label="You are here">
      <template v-if="place.group">
        <span class="text-navy-400">{{ place.group }}</span>
        <AppIcon name="chevron-right" class="size-3.5 text-navy-300" />
      </template>
      <span class="truncate font-bold text-navy-700 dark:text-white">{{ place.link.title }}</span>
    </nav>

    <div class="ml-auto flex items-center gap-1">
      <RouterLink
        to="/dashboard/notifications"
        class="relative rounded-xl p-2 text-navy-500 hover:bg-navy-50 dark:hover:bg-navy-700"
        :aria-label="unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'"
        title="Notifications"
      >
        <AppIcon name="bell" class="size-6" />
        <span
          v-if="unread > 0"
          class="absolute right-0.5 top-0.5 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-[18px] text-white ring-2 ring-white dark:ring-navy-800"
        >{{ unread > 99 ? '99+' : unread }}</span>
      </RouterLink>

      <button
        type="button"
        class="rounded-xl p-2 text-navy-500 hover:bg-navy-50 dark:hover:bg-navy-700"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :title="isDark ? 'Light theme' : 'Dark theme'"
        @click="toggleDark()"
      >
        <AppIcon :name="isDark ? 'sun' : 'moon'" class="size-6" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import AppIcon from './AppIcon.vue'
import { locate } from '@/services/navigation'
import { useNotificationStore } from '@/stores/notifications'

const emit = defineEmits<{ menu: [] }>()

const route = useRoute()
const place = computed(() => locate(route.path))

const notifications = useNotificationStore()
const unread = computed(() => notifications.unreadCount)

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
