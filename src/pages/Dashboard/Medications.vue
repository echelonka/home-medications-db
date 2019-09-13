<template>
  <div>
    <md-tabs class="md-primary" md-alignment="centered" md-elevation="1">
      <md-tab md-label="all">
        <md-table v-model="$store.state.medications" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Category">{{ getCategoryName(item.category) | capitalize }}</md-table-cell>
            <md-table-cell md-label="Production Date">{{ toDate(item.production_date) }}</md-table-cell>
            <md-table-cell md-label="Expiration Date">{{ toDate(item.expiration_date) }}</md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>
      <md-tab :id="tab.id" :md-label="tab.name" v-for="tab in $store.state.categories" :key="tab.id" @click="currentTab = tab.name">
        <!-- TODO Show medications of specific logic -->
        <md-empty-state
          md-icon="access_time"
          md-label="Coming soon"
        >
        </md-empty-state>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
  export default {
    name: 'Medications',
    data: () => ({
      currentTab: ''
    }),
    filters: {
      capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
    },
    methods: {
      toDate (timestamp) {
        if (!timestamp) return '-'
        const date = new Date(timestamp.seconds * 1000)
        return `${ date.getDate() }/${ date.getMonth() }/${ date.getFullYear() }`
      },
      getCategoryName(id) {
        return this.$store.state.categories.find(category => category.id === id).name
      }
    }
  }
</script>

<style scoped>

</style>
