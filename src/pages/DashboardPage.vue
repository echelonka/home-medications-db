<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfirmDialog from '@/components/ConfirmDialog.vue'
import ExpiringSoonCard from '@/components/ExpiringSoonCard.vue'
import MedicationDialog from '@/components/MedicationDialog.vue'
import MedicationsTable from '@/components/MedicationsTable.vue'
import {
  useMedicationRows,
  type MedicationRow,
  type MedicationStatus,
} from '@/composables/useMedicationRows'
import { useAuthStore } from '@/stores/auth'
import { useCategoriesStore } from '@/stores/categories'
import { useKitsStore } from '@/stores/kits'
import { useMedicationsStore } from '@/stores/medications'
import type { Medication, MedicationInput } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const kitsStore = useKitsStore()
const categoriesStore = useCategoriesStore()
const medicationsStore = useMedicationsStore()

const { items: medications } = storeToRefs(medicationsStore)
const rows = useMedicationRows(medications)

const loading = ref(true)
const loadError = ref('')

const dialogOpen = ref(false)
const editTarget = ref<Medication | null>(null)

const deleteOpen = ref(false)
const deleteTarget = ref<MedicationRow | null>(null)
const deleting = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

const kitName = computed(() => kitsStore.activeKit?.name ?? '')

const statusFilter = ref<MedicationStatus | null>(null)

function filterByStatus(status: MedicationStatus) {
  statusFilter.value = status
}

onMounted(async () => {
  try {
    await Promise.all([categoriesStore.ensureLoaded(), medicationsStore.ensureLoaded()])
  } catch (cause) {
    console.error(cause)
    loadError.value = 'Failed to load data. Try reloading the page.'
  } finally {
    loading.value = false
  }
})

function notify(text: string, color: 'success' | 'error' = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

function openAdd() {
  editTarget.value = null
  dialogOpen.value = true
}

function openEdit(row: MedicationRow) {
  editTarget.value = row
  dialogOpen.value = true
}

async function save(input: MedicationInput) {
  try {
    if (editTarget.value) {
      await medicationsStore.edit(editTarget.value.id, input)
      notify('Medication updated')
    } else {
      await medicationsStore.add(input)
      notify('Medication added')
    }
  } catch (cause) {
    console.error(cause)
    notify('Failed to save medication', 'error')
  }
}

function openDelete(row: MedicationRow) {
  deleteTarget.value = row
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await medicationsStore.remove(deleteTarget.value.id)
    notify('Medication deleted')
    deleteOpen.value = false
  } catch (cause) {
    console.error(cause)
    notify('Failed to delete medication', 'error')
  } finally {
    deleting.value = false
  }
}

async function logout() {
  await authStore.logout()
  kitsStore.reset()
  medicationsStore.reset()
  await router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar color="primary" density="comfortable">
    <v-app-bar-title>
      <v-icon icon="mdi-pill" class="mr-1" />
      Home Medications
      <span v-if="kitName" class="text-body-2 opacity-70 ml-2">· {{ kitName }}</span>
    </v-app-bar-title>
    <v-spacer />
    <span class="text-body-2 mr-4 d-none d-sm-inline">{{ authStore.user?.email }}</span>
    <v-btn icon="mdi-logout" aria-label="Sign out" @click="logout" />
  </v-app-bar>

  <v-main class="bg-grey-lighten-4">
    <v-container class="py-6" max-width="1280">
      <v-alert v-if="loadError" type="error" variant="tonal" class="mb-6">
        {{ loadError }}
      </v-alert>

      <template v-else>
        <ExpiringSoonCard v-if="!loading" :rows="rows" @filter="filterByStatus" />

        <MedicationsTable
          v-model:status-filter="statusFilter"
          :rows="rows"
          :loading="loading"
          @add="openAdd"
          @edit="openEdit"
          @delete="openDelete"
        />
      </template>
    </v-container>
  </v-main>

  <MedicationDialog v-model="dialogOpen" :medication="editTarget" @save="save" />

  <ConfirmDialog
    v-model="deleteOpen"
    title="Delete medication"
    :text="`Delete “${deleteTarget?.name}”? This cannot be undone.`"
    :loading="deleting"
    @confirm="confirmDelete"
  />

  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
    {{ snackbarText }}
  </v-snackbar>
</template>
