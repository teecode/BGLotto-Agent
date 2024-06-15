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
      name: 'Dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView.vue'),
      beforeEnter: authGuard,
      children:[
        {
          path: '/dashboard',
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
          path: 'statistics',
          name: 'Statistics',
          component: () => import('../views/StatisticsView.vue'),
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
        }
      ]
    }
  ]
})

export default router
