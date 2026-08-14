import type { ZodType } from 'zod'

/** Converts a zod schema into a Vuetify validation rule. */
export function zodRule(schema: ZodType) {
  return (value: unknown): true | string => {
    const result = schema.safeParse(value)
    return result.success ? true : (result.error.issues[0]?.message ?? 'Invalid value')
  }
}
