import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import { clearSession, isSignedIn } from '@/services/session';
import { useAuthStore } from '@/stores/auth';
import { locate } from '@/services/navigation';

const APP_NAME = 'MaxiLotto Agent Portal'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Back and forward return to where the agent was on the page; a new page starts at the top
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path === from.path) return undefined
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LoginView,
      meta: { title: 'Sign in' }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordView,
      meta: { title: 'Reset password' }
    },
    {
      path: '/dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
      children:[
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'agent-details',
          name: 'AgentDetails',
          component: () => import('../views/AgentDetsView.vue'),
        },
        {
          path: 'cashier-details',
          name: 'CashierDetails',
          component: () => import('../views/CashierDetsView.vue'),
        },
        {
          path: 'cashier-reports',
          name: 'CashierReports',
          component: () => import('../views/CashierReports.vue')
        },
        {
          path: 'cashier-summary-report',
          name: 'CashierSummaryReport',
          component: () => import('../views/CashierSummaryReport.vue')
        },
        {
          path: 'commission-calculator',
          name: 'DashboardCommissionCalculator',
          component: () => import('../views/CommissionCalculatorView.vue')
        },
        {
          path: 'bonus-log',
          name: 'BonusLog',
          component: () => import('../views/BonusLogView.vue')
        },
        {
          path: 'shop-statistics',
          name: 'Statistics',
          component: () => import('../views/ShopStatisticsView.vue'),
        },
        {
          path: 'game-statistics',
          name: 'GameStatistics',
          component: () => import('../views/ShopGameStatisticsView.vue'),
        },
        {
          path: 'tickets',
          name: 'Tickets',
          component: () => import('../views/TicketsView.vue')
        },
        {
          path: 'transactions',
          name: 'Transactions',
          component: () => import('../views/TransactionView.vue')
        },
        {
          path: 'payout',
          name: 'Payout',
          component: () => import('../views/PayoutView.vue')
        },
        {
          path: 'cashout',
          name: 'Cashout',
          component: () => import('../views/CashoutView.vue')
        },
        {
          path : 'terminal-statistic',
          name : 'TerminalStatistic',
          component: () => import('../views/TerminalStatisticView.vue')
        },
        {
          path: 'lodgement',
          name: 'Lodgement',
          component: () => import('../views/LodgementView.vue')
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: () => import('../views/NotificationsView.vue')
        },
        {
          path: 'maxi-university',
          name: 'MaxiUniversity',
          component: () => import('../views/MaxiUniversitySectionsView.vue')
        },
        {
          path: 'maxi-university/sections/:sectionId',
          name: 'MaxiUniversityTopics',
          component: () => import('../views/MaxiUniversityTopicsView.vue')
        },
        {
          path: 'maxi-university/sections/:sectionId/topics/:topicId',
          name: 'MaxiUniversityMaterials',
          component: () => import('../views/MaxiUniversityMaterialsView.vue')
        },
        {
          path: 'maxi-university/sections/:sectionId/topics/:topicId/materials/:materialId',
          name: 'MaxiUniversityMaterialDetail',
          component: () => import('../views/MaxiUniversityMaterialDetailView.vue')
        },
        {
          path: 'maxi-university/quiz',
          name: 'MaxiUniversityQuiz',
          component: () => import('../views/MaxiUniversityQuizView.vue')
        }
      ]
    },
    // A mistyped or outdated address lands on the dashboard (or sign-in) instead of a blank page
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach((to) => {
  const needsAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (needsAuth && !isSignedIn()) {
    // An expired token is still "a token": tell the agent why they are back at sign-in
    const expired = useAuthStore().isLoggedIn
    clearSession()
    return {
      name: 'Home',
      query: {
        ...(to.fullPath !== '/dashboard' ? { redirect: to.fullPath } : {}),
        ...(expired ? { reason: 'expired' } : {}),
      },
    }
  }

  // Already signed in: the sign-in page has nothing to offer
  if (to.name === 'Home' && isSignedIn()) return '/dashboard'

  return true
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? locate(to.path)?.link.title
  document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
})

export default router
