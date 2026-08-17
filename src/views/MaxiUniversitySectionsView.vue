<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <div class="flex items-center gap-4">
        <div class="size-14 rounded-2xl bg-brand-50 dark:bg-navy-700 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-brand-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Maxi University</h2>
          <p class="text-navy-400 font-medium mt-1">Learn the platform &mdash; browse training sections below</p>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin size-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!sections.length"
      class="bg-white dark:bg-navy-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <p class="text-lg font-bold text-navy-700 dark:text-white">No sections yet</p>
      <p class="text-navy-400 font-medium mt-1">Check back soon &mdash; training content is on its way.</p>
    </div>

    <!-- Section cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="s in sections"
        :key="s.id"
        @click="openSection(s)"
        class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 cursor-pointer hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-md transition-all"
      >
        <div class="size-11 rounded-xl bg-brand-50 dark:bg-navy-900 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-brand-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <p class="font-bold text-navy-700 dark:text-white">{{ s.title }}</p>
        <p class="text-sm text-navy-400 font-medium mt-1 line-clamp-2">{{ s.description }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'

const router = useRouter()
const snackbar = useSnackbar()

const sections = ref([])
const loading = ref(false)

const load = async () => {
  try {
    loading.value = true
    const res = await axios.get('MaxiUniversity/Agent/Sections')
    sections.value = res.data ?? []
  } catch (err) {
    snackbar.add({ type: 'error', text: 'Failed to load Maxi University sections' })
  } finally {
    loading.value = false
  }
}

const openSection = (s) => {
  router.push({ name: 'MaxiUniversityTopics', params: { sectionId: s.id } })
}

onMounted(() => {
  load()
})
</script>
