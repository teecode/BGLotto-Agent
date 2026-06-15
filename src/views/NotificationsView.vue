<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Notifications</h2>
          <p class="text-navy-400 font-medium mt-1">
            {{ unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-sm font-medium text-navy-500 dark:text-navy-300 cursor-pointer">
            <input type="checkbox" v-model="onlyUnread" @change="load()" class="w-4 h-4 accent-brand-500" />
            Unread only
          </label>
          <button
            v-if="unreadCount > 0"
            @click="markAllRead"
            :disabled="markingAll"
            class="text-sm font-bold text-brand-500 hover:text-brand-600 disabled:opacity-50 transition-colors"
          >
            {{ markingAll ? 'Marking...' : 'Mark all as read' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin size-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!notifications.length"
      class="bg-white dark:bg-navy-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 bg-brand-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-brand-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      </div>
      <p class="text-lg font-bold text-navy-700 dark:text-white">No notifications</p>
      <p class="text-navy-400 font-medium mt-1">{{ onlyUnread ? 'No unread notifications.' : 'You have no notifications yet.' }}</p>
    </div>

    <!-- Notification list -->
    <div v-else class="space-y-3">
      <div
        v-for="n in notifications"
        :key="n.id"
        :class="[
          'bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border transition-all cursor-pointer',
          n.isRead
            ? 'border-gray-100 dark:border-navy-700 opacity-75'
            : 'border-brand-200 dark:border-brand-500/30 ring-1 ring-brand-100 dark:ring-brand-500/10'
        ]"
        @click="openDetail(n)"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div :class="['shrink-0 size-10 rounded-xl flex items-center justify-center', typeIcon(n.type).bg]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" :class="['size-5', typeIcon(n.type).text]">
              <path stroke-linecap="round" stroke-linejoin="round" :d="typeIcon(n.type).path" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-bold text-navy-700 dark:text-white truncate">{{ n.title }}</p>
                  <span :class="['text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', typeBadge(n.type)]">{{ n.type }}</span>
                  <span v-if="!n.isRead" class="size-2 rounded-full bg-brand-500 shrink-0"></span>
                </div>
                <p class="text-sm text-navy-400 font-medium mt-1 line-clamp-2">{{ n.message }}</p>
              </div>
              <span class="shrink-0 text-[11px] text-navy-300 font-medium whitespace-nowrap">{{ formatDate(n.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between bg-white dark:bg-navy-800 rounded-2xl px-5 py-4 shadow-sm border border-gray-100 dark:border-navy-700">
      <span class="text-sm text-navy-400 font-medium">Page {{ page }} of {{ totalPages }}</span>
      <div class="flex gap-2">
        <button
          @click="changePage(page - 1)"
          :disabled="page <= 1"
          class="px-4 py-2 text-sm font-bold rounded-xl bg-gray-50 dark:bg-navy-900 text-navy-500 dark:text-navy-300 disabled:opacity-40 hover:bg-brand-50 dark:hover:bg-navy-700 transition-colors"
        >← Prev</button>
        <button
          @click="changePage(page + 1)"
          :disabled="page >= totalPages"
          class="px-4 py-2 text-sm font-bold rounded-xl bg-gray-50 dark:bg-navy-900 text-navy-500 dark:text-navy-300 disabled:opacity-40 hover:bg-brand-50 dark:hover:bg-navy-700 transition-colors"
        >Next →</button>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" @click="closeDetail"></div>
        <div class="relative w-full max-w-lg bg-white dark:bg-navy-800 rounded-3xl shadow-2xl p-8 z-10 animate-in zoom-in-95 duration-200">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
              <div :class="['size-10 rounded-xl flex items-center justify-center shrink-0', typeIcon(selected.type).bg]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" :class="['size-5', typeIcon(selected.type).text]">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="typeIcon(selected.type).path" />
                </svg>
              </div>
              <div>
                <span :class="['text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', typeBadge(selected.type)]">{{ selected.type }}</span>
                <h3 class="text-lg font-bold text-navy-700 dark:text-white mt-1">{{ selected.title }}</h3>
              </div>
            </div>
            <button @click="closeDetail" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700 text-navy-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p class="text-navy-600 dark:text-navy-300 leading-relaxed whitespace-pre-line mb-6">{{ selected.message }}</p>

          <div class="flex items-center justify-between text-xs text-navy-300 pt-4 border-t border-gray-100 dark:border-navy-700">
            <span>{{ formatDate(selected.createdAt) }}</span>
            <span v-if="selected.isRead && selected.readAt" class="text-green-500 font-medium">Read {{ formatDate(selected.readAt) }}</span>
            <span v-else class="text-brand-400 font-medium">Unread</span>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { useNotificationStore } from '@/stores/notifications'
import { useAuthStore } from '@/stores/auth'
import { format, formatDistanceToNow } from 'date-fns'

const snackbar = useSnackbar()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const shopId = computed(() => Number(authStore.user?.shopId ?? 0))

const notifications = ref([])
const totalRecords = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const onlyUnread = ref(false)
const markingAll = ref(false)
const selected = ref(null)

const unreadCount = computed(() => notificationStore.unreadCount)
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))

const load = async () => {
  try {
    loading.value = true
    const res = await axios.get(
      `Notification/ShopNotifications?shopId=${shopId.value}&onlyUnread=${onlyUnread.value}&page=${page.value}&pageSize=${pageSize.value}`
    )
    notifications.value = res.data?.data ?? []
    totalRecords.value = res.data?.totalRecords ?? 0
  } catch (err) {
    snackbar.add({ type: 'error', text: 'Failed to load notifications' })
  } finally {
    loading.value = false
  }
}

const openDetail = async (n) => {
  selected.value = n
  if (!n.isRead) {
    try {
      await axios.put(`Notification/ShopNotifications/${n.id}/Read?shopId=${shopId.value}`)
      n.isRead = true
      notificationStore.decrement()
    } catch {
      // silently fail
    }
  }
}

const closeDetail = () => {
  selected.value = null
}

const markAllRead = async () => {
  try {
    markingAll.value = true
    await axios.put(`Notification/ShopNotifications/ReadAll?shopId=${shopId.value}`)
    notifications.value.forEach(n => (n.isRead = true))
    notificationStore.reset()
    snackbar.add({ type: 'success', text: 'All notifications marked as read' })
  } catch {
    snackbar.add({ type: 'error', text: 'Failed to mark all as read' })
  } finally {
    markingAll.value = false
  }
}

const changePage = (p) => {
  page.value = p
  load()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const diffMs = Date.now() - d.getTime()
    if (diffMs < 86400000) return formatDistanceToNow(d, { addSuffix: true })
    return format(d, 'dd MMM yyyy, hh:mm a')
  } catch {
    return dateStr
  }
}

const typeIcon = (type) => {
  if (type === 'ALERT') return {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-500',
    path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
  }
  if (type === 'FINANCIAL') return {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-500',
    path: 'M2.25 18.75a60.07 60.07 0 0 1 15.797 2.107c.19.074.399.025.534-.127L21.787 18m-19.537 0a60.07 60.07 0 0 0 12.016-1.921c.256-.068.528.016.711.228l2.25 2.608'
  }
  return {
    bg: 'bg-brand-50 dark:bg-navy-900',
    text: 'text-brand-500',
    path: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
  }
}

const typeBadge = (type) => {
  if (type === 'ALERT') return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  if (type === 'FINANCIAL') return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  return 'bg-brand-50 text-brand-600 dark:bg-navy-900 dark:text-brand-400'
}

onMounted(() => {
  load()
  notificationStore.fetchUnreadCount(shopId.value)
})
</script>
