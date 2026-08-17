<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Header -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
      <router-link :to="`/dashboard/maxi-university/sections/${sectionId}`" class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        {{ section?.title ?? 'Topics' }}
      </router-link>
      <h2 class="text-2xl font-bold text-navy-700 dark:text-white">{{ topic?.title ?? 'Training Materials' }}</h2>
      <p class="text-navy-400 font-medium mt-1">{{ topic?.description }}</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin size-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!materials.length"
      class="bg-white dark:bg-navy-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <p class="text-lg font-bold text-navy-700 dark:text-white">No training materials yet</p>
      <p class="text-navy-400 font-medium mt-1">Check back soon &mdash; more lessons are coming to this topic.</p>
    </div>

    <!-- Material list -->
    <div v-else class="space-y-3">
      <div
        v-for="m in materials"
        :key="m.id"
        @click="openMaterial(m)"
        class="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-navy-700 cursor-pointer hover:border-brand-200 dark:hover:border-brand-500/30 transition-all flex items-center gap-4"
      >
        <div class="shrink-0 size-10 rounded-xl bg-brand-50 dark:bg-navy-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-brand-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 8.25 3 2.25-3 2.25V8.25ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-navy-700 dark:text-white">{{ m.subject }}</p>
          <p class="text-sm text-navy-400 font-medium mt-1 line-clamp-2">{{ m.description }}</p>
        </div>
        <span v-if="m.attachments?.length" class="shrink-0 text-[11px] font-bold px-2 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-navy-900 dark:text-brand-400">
          {{ m.attachments.length }} file{{ m.attachments.length > 1 ? 's' : '' }}
        </span>
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
const topicId = route.params.topicId
const section = ref(null)
const topic = ref(null)
const materials = ref([])
const loading = ref(false)

const load = async () => {
  try {
    loading.value = true
    const [sectionsRes, topicsRes, materialsRes] = await Promise.all([
      axios.get('MaxiUniversity/Agent/Sections'),
      axios.get(`MaxiUniversity/Agent/Sections/${sectionId}/Topics`),
      axios.get(`MaxiUniversity/Agent/Topics/${topicId}/Materials`)
    ])
    section.value = (sectionsRes.data ?? []).find(s => s.id === sectionId) ?? null
    topic.value = (topicsRes.data ?? []).find(t => t.id === topicId) ?? null
    materials.value = materialsRes.data ?? []
  } catch (err) {
    snackbar.add({ type: 'error', text: 'Failed to load training materials' })
  } finally {
    loading.value = false
  }
}

const openMaterial = (m) => {
  router.push({ name: 'MaxiUniversityMaterialDetail', params: { sectionId, topicId, materialId: m.id } })
}

onMounted(() => {
  load()
})
</script>
