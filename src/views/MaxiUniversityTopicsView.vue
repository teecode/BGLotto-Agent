<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <router-link to="/dashboard/maxi-university" class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Maxi University
      </router-link>
      <h2 class="text-2xl font-bold text-navy-700 dark:text-white">{{ section?.title ?? 'Topics' }}</h2>
      <p class="text-navy-400 font-medium mt-1">{{ section?.description }}</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin size-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!topics.length"
      class="bg-white dark:bg-navy-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <p class="text-lg font-bold text-navy-700 dark:text-white">No topics yet</p>
      <p class="text-navy-400 font-medium mt-1">Check back soon &mdash; more content is coming to this section.</p>
    </div>

    <!-- Topic list -->
    <div v-else class="space-y-3">
      <div
        v-for="t in topics"
        :key="t.id"
        @click="openTopic(t)"
        class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-navy-700 cursor-pointer hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex items-center justify-between gap-4"
      >
        <div class="min-w-0">
          <p class="font-bold text-navy-700 dark:text-white">{{ t.title }}</p>
          <p class="text-sm text-navy-400 font-medium mt-1 line-clamp-2">{{ t.description }}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-navy-300 shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'

const route = useRoute()
const router = useRouter()
const snackbar = useSnackbar()

const sectionId = route.params.sectionId
const section = ref(null)
const topics = ref([])
const loading = ref(false)

const load = async () => {
  try {
    loading.value = true
    const [sectionsRes, topicsRes] = await Promise.all([
      axios.get('MaxiUniversity/Agent/Sections'),
      axios.get(`MaxiUniversity/Agent/Sections/${sectionId}/Topics`)
    ])
    section.value = (sectionsRes.data ?? []).find(s => s.id === sectionId) ?? null
    topics.value = topicsRes.data ?? []
  } catch (err) {
    snackbar.add({ type: 'error', text: 'Failed to load topics' })
  } finally {
    loading.value = false
  }
}

const openTopic = (t) => {
  router.push({ name: 'MaxiUniversityMaterials', params: { sectionId, topicId: t.id } })
}

onMounted(() => {
  load()
})
</script>
