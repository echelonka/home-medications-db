import { computed, type Ref } from 'vue'

import { useCategoriesStore } from '@/stores/categories'
import type { Medication } from '@/types'
import { daysUntil } from '@/utils/dates'

export const EXPIRING_SOON_DAYS = 30

export type MedicationStatus = 'ok' | 'expiring' | 'expired'

export interface MedicationRow extends Medication {
  categoryName: string
  daysLeft: number | null
  status: MedicationStatus
}

export function useMedicationRows(medications: Ref<Medication[]>) {
  const categoriesStore = useCategoriesStore()

  return computed<MedicationRow[]>(() =>
    medications.value.map((medication) => {
      const daysLeft = medication.expirationDate ? daysUntil(medication.expirationDate) : null
      let status: MedicationStatus = 'ok'
      if (daysLeft !== null) {
        if (daysLeft < 0) status = 'expired'
        else if (daysLeft <= EXPIRING_SOON_DAYS) status = 'expiring'
      }
      return {
        ...medication,
        categoryName: categoriesStore.nameOf(medication.categoryId),
        daysLeft,
        status,
      }
    }),
  )
}
