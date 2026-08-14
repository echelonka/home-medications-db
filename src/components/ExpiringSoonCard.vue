<script setup lang="ts">
import { computed } from 'vue'

import type { MedicationRow, MedicationStatus } from '@/composables/useMedicationRows'

const props = defineProps<{ rows: MedicationRow[] }>()
const emit = defineEmits<{ filter: [status: MedicationStatus] }>()

const expiredCount = computed(() => props.rows.filter((row) => row.status === 'expired').length)
const expiringCount = computed(() => props.rows.filter((row) => row.status === 'expiring').length)
</script>

<template>
  <div v-if="expiredCount > 0 || expiringCount > 0" class="d-flex flex-wrap ga-4 mb-6">
    <v-card v-if="expiredCount > 0" color="error" variant="tonal" rounded="lg" class="stat-card">
      <v-card-item>
        <template #prepend>
          <v-icon icon="mdi-alert-circle" size="28" />
        </template>
        <v-card-title class="text-h4">{{ expiredCount }}</v-card-title>
        <v-card-subtitle>Expired</v-card-subtitle>
      </v-card-item>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          size="small"
          append-icon="mdi-arrow-right"
          @click="emit('filter', 'expired')"
        >
          View
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="expiringCount > 0" color="warning" variant="tonal" rounded="lg" class="stat-card">
      <v-card-item>
        <template #prepend>
          <v-icon icon="mdi-clock-alert" size="28" />
        </template>
        <v-card-title class="text-h4">{{ expiringCount }}</v-card-title>
        <v-card-subtitle>Expiring soon</v-card-subtitle>
      </v-card-item>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          size="small"
          append-icon="mdi-arrow-right"
          @click="emit('filter', 'expiring')"
        >
          View
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.stat-card {
  min-width: 220px;
  max-width: 320px;
  flex: 1 1 220px;
}
</style>
