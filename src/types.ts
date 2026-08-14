export interface Category {
  id: string
  name: string
}

export interface Kit {
  id: string
  name: string
  ownerId: string
  members: string[]
}

export interface Medication {
  id: string
  name: string
  categoryId: string
  description: string
  productionDate: Date | null
  expirationDate: Date | null
}

/** Form payload for creating/updating a medication. Dates are `yyyy-mm-dd` strings. */
export interface MedicationInput {
  name: string
  categoryId: string
  description: string
  productionDate: string
  expirationDate: string
}
