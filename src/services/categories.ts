import { collection, getDocs, orderBy, query } from 'firebase/firestore'

import { db } from '@/firebase'
import type { Category } from '@/types'

export async function listCategories(): Promise<Category[]> {
  const snap = await getDocs(query(collection(db, 'categories'), orderBy('name')))
  return snap.docs.map((doc) => ({ id: doc.id, name: doc.data().name as string }))
}
