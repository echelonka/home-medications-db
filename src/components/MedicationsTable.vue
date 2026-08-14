<script setup lang="ts">
import { computed, ref } from 'vue'

import type { MedicationRow, MedicationStatus } from '@/composables/useMedicationRows'
import { useCategoriesStore } from '@/stores/categories'
import { formatDate } from '@/utils/dates'

const props = defineProps<{ rows: MedicationRow[]; loading: boolean }>()
const emit = defineEmits<{ add: []; edit: [row: MedicationRow]; delete: [row: MedicationRow] }>()

const statusFilter = defineModel<MedicationStatus | null>('statusFilter', { default: null })

const categoriesStore = useCategoriesStore()

const search = ref('')
const categoryFilter = ref<string | null>(null)

const statusFilterLabel = computed(() => {
  if (statusFilter.value === 'expired') return 'Expired'
  if (statusFilter.value === 'expiring') return 'Expiring soon'
  return ''
})

const filteredRows = computed(() =>
  props.rows.filter(
    (row) =>
      (!categoryFilter.value || row.categoryId === categoryFilter.value) &&
      (!statusFilter.value || row.status === statusFilter.value),
  ),
)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Category', key: 'categoryName' },
  { title: 'Production date', key: 'productionDate' },
  { title: 'Expiration date', key: 'expirationDate' },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
]

function rowProps({ item }: { item: MedicationRow }) {
  if (item.status === 'expired') return { class: 'bg-red-lighten-5' }
  if (item.status === 'expiring') return { class: 'bg-amber-lighten-5' }
  return {}
}

function expirationColor(row: MedicationRow): string | undefined {
  if (row.status === 'expired') return 'error'
  if (row.status === 'expiring') return 'warning'
  return undefined
}
</script>

<template>
  <v-card rounded="lg" elevation="2">
    <v-toolbar color="transparent" density="comfortable" class="px-2">
      <v-toolbar-title class="text-h6">Medications</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="emit('add')">
        Add medication
      </v-btn>
    </v-toolbar>

    <v-card-text class="pt-0">
      <v-row dense class="mb-2">
        <v-col cols="12" sm="7" md="8">
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" sm="5" md="4">
          <v-select
            v-model="categoryFilter"
            label="Filter by category"
            :items="categoriesStore.items"
            item-title="name"
            item-value="id"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </v-col>
      </v-row>

      <div v-if="statusFilter" class="mb-2">
        <v-chip
          :color="statusFilter === 'expired' ? 'error' : 'warning'"
          size="small"
          variant="flat"
          closable
          @click:close="statusFilter = null"
        >
          Filter: {{ statusFilterLabel }}
        </v-chip>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredRows"
        :search="search"
        :loading="loading"
        :row-props="rowProps"
        items-per-page="25"
        hover
      >
        <template #item.name="{ item }">
          <div class="font-weight-medium">{{ item.name }}</div>
          <div
            v-if="item.description"
            class="text-caption text-medium-emphasis text-truncate description-cell"
          >
            {{ item.description }}
          </div>
        </template>

        <template #item.categoryName="{ item }">
          <v-chip size="small" variant="tonal">{{ item.categoryName }}</v-chip>
        </template>

        <template #item.productionDate="{ item }">
          {{ formatDate(item.productionDate) }}
        </template>

        <template #item.expirationDate="{ item }">
          <v-chip
            v-if="item.expirationDate"
            size="small"
            :color="expirationColor(item)"
            :variant="item.status === 'ok' ? 'text' : 'flat'"
          >
            {{ formatDate(item.expirationDate) }}
          </v-chip>
          <span v-else>—</span>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            aria-label="Edit"
            @click="emit('edit', item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            aria-label="Delete"
            @click="emit('delete', item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.description-cell {
  max-width: 320px;
}
</style>
