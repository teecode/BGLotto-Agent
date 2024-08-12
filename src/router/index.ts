import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';

const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    next()
  } else {
    next('/')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LoginView
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordView
    },
    {
      path: '/dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
      beforeEnter: authGuard,
      children:[
        {
          path: '/dashboard',
          // name: 'Dashboard',
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
          path: 'reimbursement',
          name: 'Reimbursement',
          component: () => import('../views/ReimbursementView.vue')
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
        }
      ]
    }
  ]
})

export default router
