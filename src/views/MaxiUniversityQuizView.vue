<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

    <router-link to="/dashboard/maxi-university" class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      Maxi University
    </router-link>

    <!-- Loading -->
    <div v-if="phase === 'loading'" class="flex items-center justify-center py-16">
      <div class="animate-spin size-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Intro: start or resume -->
    <div v-else-if="phase === 'intro'" class="bg-white dark:bg-navy-800 rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 bg-brand-50 dark:bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-brand-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Ready to test your knowledge?</h2>
      <p class="text-navy-400 font-medium mt-2 max-w-md mx-auto">
        20 questions drawn at random from everything you've studied. Score 70% or higher to pass and earn your certificate.
      </p>
      <p class="text-sm font-bold mt-4" :class="attemptsRemaining > 1 ? 'text-brand-500' : 'text-amber-500'">
        {{ attemptsRemaining }} attempt{{ attemptsRemaining === 1 ? '' : 's' }} remaining
      </p>
      <button
        @click="startQuiz"
        class="mt-6 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors active:scale-[0.98]"
      >
        {{ hasInProgress ? 'Resume Quiz' : 'Start Quiz' }}
      </button>
    </div>

    <!-- Exhausted -->
    <div v-else-if="phase === 'exhausted'" class="bg-white dark:bg-navy-800 rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-navy-700 dark:text-white">No attempts remaining</h2>
      <p class="text-navy-400 font-medium mt-2 max-w-md mx-auto">
        You've used all 3 of your attempts without reaching 70%. Speak to your agent or admin to have your attempts reset.
      </p>
    </div>

    <!-- Already passed -->
    <div v-else-if="phase === 'alreadyPassed'" class="bg-white dark:bg-navy-800 rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-green-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 1.5c0 5.385-4.365 9.75-9.75 9.75S1.5 16.635 1.5 11.25 5.865 1.5 11.25 1.5c1.6 0 3.109.383 4.443 1.062" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-navy-700 dark:text-white">You've already passed!</h2>
      <p class="text-navy-400 font-medium mt-2">Scored {{ passedResult?.score }}/{{ passedResult?.totalQuestions }} on your assessment.</p>
      <button
        @click="downloadCertificate(myCertificateId)"
        class="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download Certificate
      </button>
    </div>

    <!-- Quiz in progress -->
    <template v-else-if="phase === 'quiz' && currentQuestion">
      <div class="bg-white dark:bg-navy-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-navy-700">
        <div class="flex items-center justify-between text-sm font-bold text-navy-400 mb-2">
          <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
          <span>{{ Math.round(((currentIndex + 1) / questions.length) * 100) }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-100 dark:bg-navy-900 rounded-full overflow-hidden">
          <div class="h-full bg-brand-500 rounded-full transition-all duration-300" :style="{ width: `${((currentIndex + 1) / questions.length) * 100}%` }"></div>
        </div>
      </div>

      <div class="bg-white dark:bg-navy-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-navy-700">
        <h3 class="text-lg font-bold text-navy-700 dark:text-white mb-6">{{ currentQuestion.questionText }}</h3>

        <div class="space-y-3">
          <button
            v-for="opt in currentQuestion.options"
            :key="opt.id"
            type="button"
            :disabled="revealed"
            @click="selectOption(opt.id)"
            class="w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3"
            :class="optionClasses(opt.id)"
          >
            <span class="font-medium">{{ opt.text }}</span>
            <svg v-if="revealed && opt.id === feedback?.correctOptionId" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-5 text-green-600 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <svg v-else-if="revealed && opt.id === selectedOptionId" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-5 text-red-500 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Feedback -->
        <div v-if="revealed" class="mt-5 p-4 rounded-2xl" :class="feedback?.isCorrect ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20'">
          <p class="font-bold mb-1" :class="feedback?.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ feedback?.isCorrect ? 'Correct!' : 'Not quite.' }}
          </p>
          <p class="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">{{ feedback?.explanation }}</p>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            v-if="!revealed"
            type="button"
            :disabled="!selectedOptionId"
            @click="submitAnswer"
            class="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
          >
            Submit Answer
          </button>
          <button
            v-else
            type="button"
            @click="nextQuestion"
            class="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors active:scale-[0.98]"
          >
            {{ isLastQuestion ? 'See Results' : 'Continue' }}
          </button>
        </div>
      </div>
    </template>

    <!-- Results -->
    <div v-else-if="phase === 'results'" class="bg-white dark:bg-navy-800 rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-navy-700 text-center">
      <div class="size-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        :class="results?.passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'">
        <svg v-if="results?.passed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-green-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 1.5c0 5.385-4.365 9.75-9.75 9.75S1.5 16.635 1.5 11.25 5.865 1.5 11.25 1.5c1.6 0 3.109.383 4.443 1.062" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-amber-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75c0-1.036 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .857-.708 1.58-1.673 1.803-.51.12-.827.55-.827 1.05v.6m0 3.75h.008v.008H12v-.008Zm9-2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-navy-700 dark:text-white">{{ results?.passed ? 'You passed!' : 'Not this time' }}</h2>
      <p class="text-navy-400 font-medium mt-2">
        You scored {{ results?.score }}/{{ results?.totalQuestions }} ({{ results?.percentage }}%) - {{ results?.passed ? 'above' : 'below' }} the 70% pass mark.
      </p>

      <template v-if="results?.passed">
        <p class="text-sm text-green-600 dark:text-green-400 font-semibold mt-4">Your certificate has been emailed to you.</p>
        <button
          @click="downloadCertificate(results?.certificateId)"
          class="mt-4 inline-flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download Certificate
        </button>
      </template>
      <template v-else>
        <p class="text-sm font-bold mt-4" :class="attemptsRemaining > 0 ? 'text-brand-500' : 'text-amber-500'">
          {{ attemptsRemaining }} attempt{{ attemptsRemaining === 1 ? '' : 's' }} remaining
        </p>
        <button
          v-if="attemptsRemaining > 0"
          @click="startQuiz"
          class="mt-4 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors active:scale-[0.98]"
        >
          Try Again
        </button>
        <p v-else class="text-navy-400 font-medium mt-4 max-w-md mx-auto">
          Speak to your agent or admin to have your attempts reset.
        </p>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useSnackbar } from 'vue3-snackbar'

const snackbar = useSnackbar()

const phase = ref('loading') // loading | intro | quiz | results | exhausted | alreadyPassed
const attemptsRemaining = ref(0)
const hasInProgress = ref(false)
const myCertificateId = ref(null)
const passedResult = ref(null)

const attemptId = ref(null)
const questions = ref([])
const currentIndex = ref(0)
const selectedOptionId = ref(null)
const revealed = ref(false)
const feedback = ref(null)
const results = ref(null)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1)

const optionClasses = (optionId) => {
  if (!revealed.value) {
    return optionId === selectedOptionId.value
      ? 'border-brand-500 bg-brand-50 dark:bg-navy-700 text-navy-700 dark:text-white'
      : 'border-gray-100 dark:border-navy-700 text-navy-700 dark:text-white hover:border-brand-200'
  }
  if (optionId === feedback.value?.correctOptionId) {
    return 'border-green-400 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
  }
  if (optionId === selectedOptionId.value) {
    return 'border-red-300 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
  }
  return 'border-gray-100 dark:border-navy-700 text-navy-300 dark:text-navy-500 opacity-60'
}

const loadIntro = async () => {
  try {
    const res = await axios.get('Quiz/Agent/Attempts/Mine')
    attemptsRemaining.value = res.data?.attemptsRemaining ?? 0
    myCertificateId.value = res.data?.certificateId ?? null
    const attempts = res.data?.attempts ?? []
    hasInProgress.value = attempts.some((a) => a.status === 'InProgress')

    if (myCertificateId.value) {
      passedResult.value = attempts.find((a) => a.passed) ?? null
      phase.value = 'alreadyPassed'
    } else if (attemptsRemaining.value <= 0 && !hasInProgress.value) {
      phase.value = 'exhausted'
    } else {
      phase.value = 'intro'
    }
  } catch {
    snackbar.add({ type: 'error', text: 'Failed to load your quiz status' })
  }
}

const startQuiz = async () => {
  try {
    phase.value = 'loading'
    const res = await axios.post('Quiz/Agent/Start')
    if (!res.data?.attemptId) {
      phase.value = 'exhausted'
      return
    }
    attemptId.value = res.data.attemptId
    questions.value = res.data.questions
    attemptsRemaining.value = res.data.attemptsRemaining

    const firstUnanswered = questions.value.findIndex((q) => q.selectedOptionId == null)
    if (firstUnanswered === -1) {
      await finishQuiz()
      return
    }
    currentIndex.value = firstUnanswered
    selectedOptionId.value = null
    revealed.value = false
    feedback.value = null
    phase.value = 'quiz'
  } catch {
    snackbar.add({ type: 'error', text: 'Failed to start the quiz' })
    phase.value = 'intro'
  }
}

const selectOption = (optionId) => {
  if (revealed.value) return
  selectedOptionId.value = optionId
}

const submitAnswer = async () => {
  if (!selectedOptionId.value) return
  try {
    const res = await axios.post(`Quiz/Agent/Attempts/${attemptId.value}/Answer`, {
      questionId: currentQuestion.value.id,
      selectedOptionId: selectedOptionId.value
    })
    feedback.value = res.data
    revealed.value = true
  } catch {
    snackbar.add({ type: 'error', text: 'Failed to submit your answer' })
  }
}

const nextQuestion = async () => {
  if (isLastQuestion.value) {
    await finishQuiz()
    return
  }
  currentIndex.value++
  selectedOptionId.value = null
  revealed.value = false
  feedback.value = null
}

const finishQuiz = async () => {
  try {
    phase.value = 'loading'
    const res = await axios.post(`Quiz/Agent/Attempts/${attemptId.value}/Complete`)
    results.value = res.data
    myCertificateId.value = res.data?.certificateId ?? null
    attemptsRemaining.value = await refreshAttemptsRemaining()
    phase.value = 'results'
  } catch {
    snackbar.add({ type: 'error', text: 'Failed to complete the quiz' })
  }
}

const refreshAttemptsRemaining = async () => {
  try {
    const res = await axios.get('Quiz/Agent/Attempts/Mine')
    return res.data?.attemptsRemaining ?? 0
  } catch {
    return attemptsRemaining.value
  }
}

const downloadCertificate = async (certificateId) => {
  if (!certificateId) return
  try {
    const res = await axios.get(`Quiz/Agent/Certificates/${certificateId}/Download`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'Maxilotto-Certificate.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch {
    snackbar.add({ type: 'error', text: 'Failed to download certificate' })
  }
}

onMounted(() => {
  loadIntro()
})
</script>
