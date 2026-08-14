<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { medicationSchema } from '@/schemas'
import { useCategoriesStore } from '@/stores/categories'
import type { Medication, MedicationInput } from '@/types'
import { parseDateInput, toDateInput } from '@/utils/dates'
import { zodRule } from '@/utils/validation'

const props = defineProps<{ medication: Medication | null }>()
const emit = defineEmits<{ save: [input: MedicationInput] }>()

const open = defineModel<boolean>({ required: true })

const categoriesStore = useCategoriesStore()

const form = ref<{ validate: () => Promise<{ valid: boolean }> }>()
const saving = ref(false)
const error = ref('')

const input = ref<MedicationInput>(emptyInput())

function emptyInput(): MedicationInput {
  return { name: '', categoryId: '', description: '', productionDate: '', expirationDate: '' }
}

watch(open, (isOpen) => {
  if (!isOpen) return
  error.value = ''
  input.value = props.medication
    ? {
        name: props.medication.name,
        categoryId: props.medication.categoryId,
        description: props.medication.description,
        productionDate: toDateInput(props.medication.productionDate),
        expirationDate: toDateInput(props.medication.expirationDate),
      }
    : emptyInput()
})

const isEdit = computed(() => props.medication !== null)

const nameRules = [zodRule(medicationSchema.shape.name)]
const categoryRules = [zodRule(medicationSchema.shape.categoryId)]
const expirationRules = [
  zodRule(medicationSchema.shape.expirationDate),
  (value: string) => {
    if (!value || !input.value.productionDate) return true
    return (
      parseDateInput(value) > parseDateInput(input.value.productionDate) ||
      'Expiration must be after production date'
    )
  },
]

async function save() {
  error.value = ''
  const result = await form.value?.validate()
  if (!result?.valid) return

  saving.value = true
  try {
    emit('save', { ...input.value })
    open.value = false
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-dialog v-model="open" max-width="560" persistent>
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-6">
        {{ isEdit ? 'Edit medication' : 'Add medication' }}
      </v-card-title>

      <v-card-text class="px-6">
        <v-form ref="form" @submit.prevent="save">
          <v-text-field
            v-model="input.name"
            label="Name"
            :rules="nameRules"
            variant="outlined"
            class="mb-2"
            autofocus
          />
          <v-select
            v-model="input.categoryId"
            label="Category"
            :items="categoriesStore.items"
            item-title="name"
            item-value="id"
            :rules="categoryRules"
            variant="outlined"
            class="mb-2"
          />
          <v-textarea
            v-model="input.description"
            label="Description (optional)"
            variant="outlined"
            rows="2"
            auto-grow
            class="mb-2"
          />
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="input.productionDate"
                label="Production date (optional)"
                type="date"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="input.expirationDate"
                label="Expiration date"
                type="date"
                :rules="expirationRules"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2">
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" :disabled="saving" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :loading="saving" @click="save">
          {{ isEdit ? 'Save' : 'Add' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
