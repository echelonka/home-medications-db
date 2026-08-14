# Home Medications DB

A small app for tracking home medications: what you have, which category it belongs to, and when it expires.

## Stack

- Vue 3 + TypeScript + Vite, packages managed with Bun
- Vuetify (UI), Pinia (state, caches one-time Firestore fetches — no realtime listeners)
- Firebase Auth (email/password) + Cloud Firestore
- zod (form validation), oxlint + oxfmt (linting and formatting)

## Development

```bash
bun install
bun run dev
```

Firebase config is read from `.env.local` (see `src/vite-env.d.ts` for the expected `VITE_FIREBASE_*` variables).

## Scripts

- `bun run dev` — dev server
- `bun run build` — typecheck + production build
- `bun run lint` / `bun run format` — oxlint / oxfmt
- `bun run typecheck` — vue-tsc

## Data model

- `kits/{kitId}` — a medication kit with `ownerId` and shareable `members` (UIDs). A kit is auto-created on first login if the user has none.
- `kits/{kitId}/medications/{id}` — medications: `name`, `categoryId`, `description`, `productionDate`, `expirationDate`, `createdAt`, `updatedAt`.
- `categories/{id}` — global read-only category lookup.

Legacy collections (`medications`, `archive`, `categories/*/medications`) are kept temporarily for backward compatibility; see `scripts/migrate.ts` for the one-time migration into the kit structure.

## Deploy

```bash
bun run build
firebase deploy
```
