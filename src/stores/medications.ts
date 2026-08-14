import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  createMedication,
  deleteMedication,
  listMedications,
  updateMedication,
} from '@/services/medications'
import { useKitsStore } from '@/stores/kits'
import type { Medication, MedicationInput } from '@/types'

/**
 * Caches one-time fetches and applies mutations to the local cache,
 * so Firestore is only read once per session (no snapshot listeners).
 */
export const useMedicationsStore = defineStore('medications', () => {
  const items = ref<Medication[]>([])
  const loaded = ref(false)

  const kitsStore = useKitsStore()

  async function ensureLoaded() {
    if (loaded.value) return
    const kit = await kitsStore.ensureKit()
    items.value = await listMedications(kit.id)
    loaded.value = true
  }

  async function add(input: MedicationInput) {
    const kit = await kitsStore.ensureKit()
    const medication = await createMedication(kit.id, input)
    items.value.push(medication)
  }

  async function edit(id: string, input: MedicationInput) {
    const kit = await kitsStore.ensureKit()
    const medication = await updateMedication(kit.id, id, input)
    items.value = items.value.map((item) => (item.id === id ? medication : item))
  }

  async function remove(id: string) {
    const kit = await kitsStore.ensureKit()
    await deleteMedication(kit.id, id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  function reset() {
    items.value = []
    loaded.value = false
  }

  return { items, loaded, ensureLoaded, add, edit, remove, reset }
})
