/**
 * One-time migration to the kit-based Firestore structure.
 *
 * 1. Backfills `ownerId` and `members` on kit docs that miss them
 *    (legacy kit doc IDs are the owner's auth UID).
 * 2. Copies all legacy top-level `medications` docs into the kit's
 *    `medications` subcollection with camelCase field names.
 *    Legacy data is left untouched.
 *
 * Authenticates with the Firebase CLI's cached credentials (run `firebase login` first):
 *   bun run scripts/migrate.ts
 */
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'

// Public OAuth client of the Firebase CLI (shipped in firebase-tools).
const CLI_CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com'
const CLI_CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi'

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID ?? 'medications-db'
const BASE = `https://firestore.googleapis.com/v1`
const DB = `projects/${PROJECT_ID}/databases/(default)`

type FirestoreValue = Record<string, unknown>
type FirestoreDoc = { name: string; fields?: Record<string, FirestoreValue> }

async function getAccessToken(): Promise<string> {
  const configPath = `${homedir()}/.config/configstore/firebase-tools.json`
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const tokens = config.tokens
  if (!tokens?.refresh_token) throw new Error('No Firebase CLI credentials; run `firebase login`.')

  if (tokens.expires_at > Date.now() + 60_000) return tokens.access_token as string

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLI_CLIENT_ID,
      client_secret: CLI_CLIENT_SECRET,
      refresh_token: tokens.refresh_token as string,
      grant_type: 'refresh_token',
    }),
  })
  if (!response.ok) throw new Error(`Token refresh failed: ${await response.text()}`)
  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

const token = await getAccessToken()

async function api(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const response = await fetch(`${BASE}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!response.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${await response.text()}`)
  return (await response.json()) as Record<string, unknown>
}

async function listAll(collectionPath: string): Promise<FirestoreDoc[]> {
  const docs: FirestoreDoc[] = []
  let pageToken = ''
  do {
    const query = new URLSearchParams({ pageSize: '300' })
    if (pageToken) query.set('pageToken', pageToken)
    const data = await api(`${DB}/documents/${collectionPath}?${query}`)
    docs.push(...((data.documents as FirestoreDoc[]) ?? []))
    pageToken = (data.nextPageToken as string) ?? ''
  } while (pageToken)
  return docs
}

// Step 1: backfill ownerId/members on kits.
const kits = await listAll('kits')
if (kits.length === 0) {
  console.error('No kits found; nothing to migrate into.')
  process.exit(1)
}

for (const kit of kits) {
  const id = kit.name.split('/').pop()!
  const patch: Record<string, FirestoreValue> = {}
  if (!kit.fields?.ownerId) patch.ownerId = { stringValue: id }
  if (!kit.fields?.members) patch.members = { arrayValue: {} }
  const fieldPaths = Object.keys(patch)
  if (fieldPaths.length === 0) continue
  const mask = fieldPaths.map((field) => `updateMask.fieldPaths=${field}`).join('&')
  await api(`${DB}/documents/kits/${id}?${mask}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: patch }),
  })
  console.log(`Backfilled kit ${id}: ${fieldPaths.join(', ')}`)
}

// Step 2: copy legacy medications into the target kit's subcollection.
const targetKitId = process.env.MIGRATION_KIT_ID ?? kits[0]!.name.split('/').pop()!
console.log(`Copying medications into kit ${targetKitId}`)

const medications = await listAll('medications')
console.log(`Found ${medications.length} legacy medications`)

function stringOrEmpty(value: FirestoreValue | undefined): FirestoreValue {
  return value && 'stringValue' in value ? value : { stringValue: '' }
}

function valueOrNull(value: FirestoreValue | undefined): FirestoreValue {
  return value && !('nullValue' in value) ? value : { nullValue: 'NULL_VALUE' }
}

const writes = medications.map((medication) => {
  const id = medication.name.split('/').pop()!
  const fields = medication.fields ?? {}
  return {
    update: {
      name: `${DB}/documents/kits/${targetKitId}/medications/${id}`,
      fields: {
        name: stringOrEmpty(fields.name),
        categoryId: stringOrEmpty(fields.category),
        description: stringOrEmpty(fields.description),
        productionDate: valueOrNull(fields.production_date),
        expirationDate: valueOrNull(fields.expiration_date),
        createdAt: valueOrNull(fields.created_at),
        updatedAt: valueOrNull(fields.updated_at),
      },
    },
  }
})

const BATCH_LIMIT = 500
for (let start = 0; start < writes.length; start += BATCH_LIMIT) {
  await api(`${DB}/documents:batchWrite`, {
    method: 'POST',
    body: JSON.stringify({ writes: writes.slice(start, start + BATCH_LIMIT) }),
  })
}

console.log(`Done: copied ${writes.length} medications into kits/${targetKitId}/medications`)
