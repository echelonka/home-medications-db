import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { auth } from '@/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const ready = new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      resolve()
    })
  })

  const isAuthenticated = computed(() => user.value !== null)

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  return { user, ready, isAuthenticated, login, logout }
})
