import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'

import { db } from '@/firebase'
import type { Kit } from '@/types'

function toKit(doc: QueryDocumentSnapshot): Kit {
  const data = doc.data()
  return {
    id: doc.id,
    name: (data.name as string) ?? 'My kit',
    ownerId: data.ownerId as string,
    members: (data.members as string[]) ?? [],
  }
}

/**
 * Returns the user's own kit, falling back to a kit shared with them.
 * Creates a new kit owned by the user when neither exists.
 */
export async function resolveKit(uid: string): Promise<Kit> {
  const kitsRef = collection(db, 'kits')

  const own = await getDocs(query(kitsRef, where('ownerId', '==', uid), limit(1)))
  if (own.docs[0]) return toKit(own.docs[0])

  const shared = await getDocs(query(kitsRef, where('members', 'array-contains', uid), limit(1)))
  if (shared.docs[0]) return toKit(shared.docs[0])

  const newKit = { name: 'My kit', ownerId: uid, members: [] as string[] }
  const ref = await addDoc(kitsRef, { ...newKit, createdAt: serverTimestamp() })
  return { id: ref.id, ...newKit }
}
