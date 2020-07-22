import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

Vue.use(VueRouter)

import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Medications from '@/pages/Dashboard/Medications'
import Category from '@/pages/Dashboard/Category'
import Archive from '@/pages/Dashboard/Archive'
import Settings from '@/pages/Dashboard/Settings'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'Login' }
    },
    {
      path: '/login',
      component: Login,
      name: 'Login'
    },
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'Dashboard',
      meta: {
        requiresAuth: true
      },
      redirect: { name: 'Medications' },
      children: [
        {
          path: '/dashboard/medications',
          component: Medications,
          name: 'Medications'
        },
        {
          path: '/dashboard/medications/:category',
          component: Category,
          name: 'Category'
        },
        {
          path: '/dashboard/archive',
          component: Archive,
          name: 'Archive'
        },
        {
          path: '/dashboard/settings',
          component: Settings,
          name: 'Settings'
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('dashboard/medications')
  else next()
})

export default router
