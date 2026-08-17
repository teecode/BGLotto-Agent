<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <!-- Breadcrumb -->
    <router-link :to="`/dashboard/maxi-university/sections/${sectionId}/topics/${topicId}`" class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      Back to materials
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin size-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Not available -->
    <div v-else-if="!material"
      class="bg-white dark:bg-navy-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <p class="text-lg font-bold text-navy-700 dark:text-white">Material not available</p>
      <p class="text-navy-400 font-medium mt-1">This lesson may have been unpublished or removed.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">{{ material.subject }}</h2>
        <p class="text-navy-400 font-medium mt-2 whitespace-pre-line">{{ material.description }}</p>
      </header>

      <!-- Media -->
      <div v-if="material.link" class="bg-white dark:bg-navy-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-navy-700">
        <div v-if="embed.type === 'youtube' || embed.type === 'vimeo'" class="rounded-2xl overflow-hidden bg-black">
          <iframe :src="embed.embedUrl" class="w-full aspect-video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div v-else-if="embed.type === 'soundcloud'" class="rounded-2xl overflow-hidden">
          <iframe :src="embed.embedUrl" class="w-full" height="166" frameborder="0" allow="autoplay"></iframe>
        </div>
        <a v-else :href="material.link" target="_blank" rel="noopener"
          class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-50 dark:bg-navy-900 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-100 dark:hover:bg-navy-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Open in new tab
        </a>
      </div>

      <!-- Attachments -->
      <div v-if="material.attachments?.length" class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700">
        <p class="font-bold text-navy-700 dark:text-white mb-4">Attachments</p>
        <div class="space-y-2">
          <a
            v-for="a in material.attachments"
            :key="a.id"
            :href="a.url"
            target="_blank"
            rel="noopener"
            download
            class="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-navy-900 hover:bg-brand-50 dark:hover:bg-navy-700 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="shrink-0 size-9 rounded-lg bg-white dark:bg-navy-800 flex items-center justify-center border border-gray-100 dark:border-navy-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-brand-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-navy-700 dark:text-white truncate">{{ a.fileName }}</p>
                <p class="text-xs text-navy-400 font-medium">{{ formatBytes(a.bytes) }}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-navy-300 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </a>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { getEmbed, formatBytes } from '@/services/mediaEmbed'

const route = useRoute()
const snackbar = useSnackbar()

const sectionId = route.params.sectionId
const topicId = route.params.topicId
const materialId = route.params.materialId

const material = ref(null)
const loading = ref(false)

const embed = computed(() => getEmbed(material.value?.link))

const load = async () => {
  try {
    loading.value = true
    const res = await axios.get(`MaxiUniversity/Agent/Materials/${materialId}`)
    material.value = res.data ?? null
    if (material.value) recordView()
  } catch (err) {
    material.value = null
  } finally {
    loading.value = false
  }
}

const recordView = async () => {
  try {
    await axios.post(`MaxiUniversity/Agent/Materials/${materialId}/View`)
  } catch {
    // View tracking must never break content viewing - fail silently.
  }
}

onMounted(() => {
  load()
})
</script>
