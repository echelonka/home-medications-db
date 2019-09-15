<template>
  <div>
    <md-table :value="medicationsByCategory(categoryName, searchString)" md-card>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title category">{{ categoryName }}</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..." @input="value => searchString = value" />
        </md-field>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Category">{{ item.category.name | capitalize }}</md-table-cell>
        <md-table-cell md-label="Production Date">{{ item.production_date }}</md-table-cell>
        <md-table-cell md-label="Expiration Date">{{ item.expiration_date }}</md-table-cell>
        <md-table-cell md-label="Actions">
          <span @click="onDeleteMedication(item)">
            <md-icon>delete</md-icon>
            <md-tooltip>Delete</md-tooltip>
          </span>
        </md-table-cell>
      </md-table-row>
      <md-table-empty-state md-label="No medications found">
<!--        <md-button class="md-primary md-raised" @click="showAddDialog = true">Add Medication</md-button>-->
      </md-table-empty-state>
    </md-table>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import helpers from '@/mixins/helpers'

  export default {
    name: 'Category',
    mixins: [helpers],
    data: () => ({
      searchString: null
    }),
    computed: {
      ...mapGetters(['medicationsByCategory']),
      categoryName() {
        return this.$route.params.category
      }
    },
    methods: {
      ...mapActions(['deleteMedication']),
      async onDeleteMedication ({ id, category }) {
        await this.deleteMedication({ id, categoryId: category.id })
      }
    }
  }
</script>

<style scoped>
  .category {
    text-transform: capitalize;
  }
</style>
