import { defineStore } from 'pinia'
import { ref } from 'vue'

import { resolveKit } from '@/services/kits'
import { useAuthStore } from '@/stores/auth'
import type { Kit } from '@/types'

export const useKitsStore = defineStore('kits', () => {
  const activeKit = ref<Kit | null>(null)

  async function ensureKit(): Promise<Kit> {
    if (activeKit.value) return activeKit.value
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')
    activeKit.value = await resolveKit(authStore.user.uid)
    return activeKit.value
  }

  function reset() {
    activeKit.value = null
  }

  return { activeKit, ensureKit, reset }
})
