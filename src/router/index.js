import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { getCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' },
    },
    {
      path: '/login',
      component: LoginView,
      name: 'login',
    },
    {
      path: '/dashboard',
      component: DashboardView,
      name: 'dashboard',
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !currentUser) {
    next('login')
  } else if (!requiresAuth && currentUser) {
    next('dashboard')
  } else {
    next()
  }
})

export default router
