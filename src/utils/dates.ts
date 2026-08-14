const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Parses a `yyyy-mm-dd` input value into a local-midnight Date. */
export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year!, month! - 1, day!)
}

/** Formats a Date as a `yyyy-mm-dd` string for date inputs. */
export function toDateInput(date: Date | null): string {
  if (!date) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function formatDate(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Whole days from today (local midnight) until the given date. Negative if in the past. */
export function daysUntil(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY)
}
