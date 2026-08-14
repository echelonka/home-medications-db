import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'

import { db } from '@/firebase'
import type { Medication, MedicationInput } from '@/types'
import { parseDateInput } from '@/utils/dates'

function medicationsRef(kitId: string) {
  return collection(db, 'kits', kitId, 'medications')
}

function toDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null
}

function toFirestoreFields(input: MedicationInput) {
  return {
    name: input.name.trim(),
    categoryId: input.categoryId,
    description: input.description.trim(),
    productionDate: input.productionDate
      ? Timestamp.fromDate(parseDateInput(input.productionDate))
      : null,
    expirationDate: input.expirationDate
      ? Timestamp.fromDate(parseDateInput(input.expirationDate))
      : null,
  }
}

function toMedication(id: string, data: Record<string, unknown>): Medication {
  return {
    id,
    name: data.name as string,
    categoryId: data.categoryId as string,
    description: (data.description as string) ?? '',
    productionDate: toDate(data.productionDate),
    expirationDate: toDate(data.expirationDate),
  }
}

export async function listMedications(kitId: string): Promise<Medication[]> {
  const snap = await getDocs(query(medicationsRef(kitId), orderBy('name')))
  return snap.docs.map((snapshot) => toMedication(snapshot.id, snapshot.data()))
}

export async function createMedication(kitId: string, input: MedicationInput): Promise<Medication> {
  const fields = toFirestoreFields(input)
  const ref = await addDoc(medicationsRef(kitId), {
    ...fields,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return toMedication(ref.id, fields)
}

export async function updateMedication(
  kitId: string,
  id: string,
  input: MedicationInput,
): Promise<Medication> {
  const fields = toFirestoreFields(input)
  await updateDoc(doc(medicationsRef(kitId), id), { ...fields, updatedAt: serverTimestamp() })
  return toMedication(id, fields)
}

export async function deleteMedication(kitId: string, id: string): Promise<void> {
  await deleteDoc(doc(medicationsRef(kitId), id))
}
