<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-button class="md-raised md-primary" @click="showAddDialog = true">Add Medication</md-button>
      </div>
    </div>
    <md-table :value="$store.getters.allMedications" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">All Medications</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..."/>
        </md-field>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Category">{{ item.category.name | capitalize }}</md-table-cell>
        <md-table-cell md-label="Production Date">{{ item.production_date }}</md-table-cell>
        <md-table-cell md-label="Expiration Date">{{ item.expiration_date }}</md-table-cell>
        <md-table-cell md-label="Actions">
          <span @click="deleteMedication(item)">
            <md-icon>delete</md-icon>
            <md-tooltip>Delete</md-tooltip>
          </span>
        </md-table-cell>
      </md-table-row>
      <md-table-empty-state md-label="No medications found">
        <md-button class="md-primary md-raised" @click="showAddDialog = true">Add Medication</md-button>
      </md-table-empty-state>
    </md-table>
    <md-dialog :md-active="showAddDialog">
      <md-dialog-title>Add Medication</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label for="name">Name</label>
          <md-input name="name" id="name" v-model="newMedication.name"/>
        </md-field>
        <md-field>
          <label for="category">Category</label>
          <md-select name="category" id="category" v-model="newMedication.category" md-dense>
            <md-option
              :value="category.id"
              v-for="category in $store.state.categories"
              :key="category.id"
            >{{ category.name | capitalize }}
            </md-option>
          </md-select>
        </md-field>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-datepicker v-model="newMedication.production_date">
              <label>Production Date</label>
            </md-datepicker>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-datepicker v-model="newMedication.expiration_date">
              <label>Expiration date</label>
            </md-datepicker>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="hideAddingDialog">Cancel</md-button>
        <md-button class="md-raised md-primary" @click="addMedication">Add</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { db } from '@/main'
  export default {
    name: 'Medications',
    data: () => ({
      showAddDialog: false,
      newMedication: {
        name: '',
        category: '',
        production_date: null,
        expiration_date: null
      }
    }),
    filters: {
      capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
    },
    methods: {
      hideAddingDialog () {
        this.clearNewMedication()
        this.showAddDialog = false
      },
      clearNewMedication() {
        this.newMedication = {
          name: '',
          category: '',
          production_date: null,
          expiration_date: null
        }
      },
      async addMedication () {
        await this.$store.dispatch('addMedication', this.newMedication)
        this.clearNewMedication()
        this.showAddDialog = false
      },
      async deleteMedication ({ id, category }) {
        await this.$store.dispatch('deleteMedication', { id, categoryId: category.id })
        this.showAddDialog = false
      }
    }
  }
</script>

<style scoped>
</style>
