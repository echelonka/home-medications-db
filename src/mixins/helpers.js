export default {
  filters: {
    capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
  },
  methods: {
    capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
  }
}

export const toDate = timestamp => {
  if (!timestamp) return '-'
  const date = new Date(timestamp.seconds * 1000)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${ day }/${ month }/${ year }`
}
