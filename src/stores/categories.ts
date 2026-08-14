import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { listCategories } from '@/services/categories'
import type { Category } from '@/types'

export const useCategoriesStore = defineStore('categories', () => {
  const items = ref<Category[]>([])
  const loaded = ref(false)

  const byId = computed(() => new Map(items.value.map((category) => [category.id, category])))

  function nameOf(categoryId: string): string {
    return byId.value.get(categoryId)?.name ?? 'unknown'
  }

  async function ensureLoaded() {
    if (loaded.value) return
    items.value = await listCategories()
    loaded.value = true
  }

  return { items, loaded, byId, nameOf, ensureLoaded }
})
