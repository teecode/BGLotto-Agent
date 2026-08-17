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
        <span class="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-navy-900 dark:text-brand-400 mb-2">
          {{ material.type }}
        </span>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">{{ material.subject }}</h2>
        <p class="text-navy-400 font-medium mt-2 whitespace-pre-line">{{ material.description }}</p>
      </header>

      <!-- Text lesson content -->
      <div v-if="material.type === 'Text' && material.content"
        class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
        <div class="md-content" v-html="renderedContent"></div>
      </div>

      <!-- Media -->
      <div v-if="material.type !== 'Text' && material.link" class="bg-white dark:bg-navy-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-navy-700">
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

      <!-- Previous / Next -->
      <div v-if="prevEntry || nextEntry" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          v-if="prevEntry"
          type="button"
          @click="goTo(prevEntry)"
          class="flex items-center gap-3 p-5 rounded-2xl bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-md transition-all text-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-navy-300 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <div class="min-w-0">
            <p class="text-[11px] font-bold uppercase tracking-wider text-navy-300">Previous</p>
            <p class="font-bold text-navy-700 dark:text-white truncate">{{ prevEntry.subject }}</p>
          </div>
        </button>
        <div v-else class="hidden sm:block"></div>

        <button
          v-if="nextEntry"
          type="button"
          @click="goTo(nextEntry)"
          class="flex items-center justify-end gap-3 p-5 rounded-2xl bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-md transition-all text-right"
        >
          <div class="min-w-0">
            <p class="text-[11px] font-bold uppercase tracking-wider text-navy-300">Next</p>
            <p class="font-bold text-navy-700 dark:text-white truncate">{{ nextEntry.subject }}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5 text-navy-300 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      <div v-else-if="curriculum.loaded" class="text-center py-4">
        <p class="text-sm font-medium text-navy-400">You've reached the end of the course. Nice work.</p>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'
import { getEmbed, formatBytes } from '@/services/mediaEmbed'
import { renderMarkdown } from '@/services/markdown'
import { useMaxiUniversityStore } from '@/stores/maxiUniversity'

const route = useRoute()
const router = useRouter()
const snackbar = useSnackbar()
const curriculum = useMaxiUniversityStore()

// Computed, not plain consts - Previous/Next navigate within this same
// component instance (Vue Router reuses it when only params change), so
// these need to track the route reactively rather than freeze at first mount.
const sectionId = computed(() => route.params.sectionId)
const topicId = computed(() => route.params.topicId)
const materialId = computed(() => route.params.materialId)

const material = ref(null)
const loading = ref(false)

const embed = computed(() => getEmbed(material.value?.link))
const renderedContent = computed(() => renderMarkdown(material.value?.content))

const adjacent = computed(() => curriculum.getAdjacent(materialId.value))
const prevEntry = computed(() => adjacent.value.prev)
const nextEntry = computed(() => adjacent.value.next)

const load = async () => {
  try {
    loading.value = true
    const res = await axios.get(`MaxiUniversity/Agent/Materials/${materialId.value}`)
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
    await axios.post(`MaxiUniversity/Agent/Materials/${materialId.value}/View`)
  } catch {
    // View tracking must never break content viewing - fail silently.
  }
}

const goTo = (entry) => {
  if (!entry) return
  router.push({
    name: 'MaxiUniversityMaterialDetail',
    params: { sectionId: entry.sectionId, topicId: entry.topicId, materialId: entry.materialId },
  })
}

watch(
  () => route.params.materialId,
  () => {
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

onMounted(() => {
  load()
  curriculum.ensureLoaded()
})
</script>

<style scoped>
.md-content :deep(h1),
.md-content :deep(h2),
.md-content :deep(h3) {
  font-weight: 700;
  color: rgb(51 65 85 / 1);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.dark .md-content :deep(h1),
.dark .md-content :deep(h2),
.dark .md-content :deep(h3) {
  color: white;
}
.md-content :deep(h1:first-child),
.md-content :deep(h2:first-child),
.md-content :deep(h3:first-child) {
  margin-top: 0;
}
.md-content :deep(h1) { font-size: 1.375rem; }
.md-content :deep(h2) { font-size: 1.2rem; }
.md-content :deep(h3) { font-size: 1.05rem; }
.md-content :deep(p) {
  margin: 0.85em 0;
  line-height: 1.65;
}
.md-content :deep(ul),
.md-content :deep(ol) {
  margin: 0.85em 0;
  padding-left: 1.4em;
  line-height: 1.65;
}
.md-content :deep(ul) { list-style: disc; }
.md-content :deep(ol) { list-style: decimal; }
.md-content :deep(li) { margin: 0.3em 0; }
.md-content :deep(strong) { font-weight: 700; }
.md-content :deep(em) { font-style: italic; }
.md-content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  padding: 0.15em 0.4em;
  border-radius: 0.35em;
  background: rgb(244 247 254 / 1);
}
.dark .md-content :deep(code) { background: rgb(17 28 68 / 1); }
.md-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.9em;
}
.md-content :deep(th),
.md-content :deep(td) {
  text-align: left;
  padding: 0.55em 0.75em;
  border: 1px solid rgb(243 244 246 / 1);
}
.dark .md-content :deep(th),
.dark .md-content :deep(td) {
  border-color: rgb(48 44 84 / 1);
}
.md-content :deep(th) {
  font-weight: 700;
  background: rgb(244 247 254 / 1);
}
.dark .md-content :deep(th) { background: rgb(17 28 68 / 1); }
</style>
