<template>
  <v-card>
    <v-data-table :headers="headers" :items="allMedications()" :search="searchString" disable-pagination hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>All Medications</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchString"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click.stop="showAddDialog = true">Add Medication</v-btn>
          <AddMedicationDialog v-model="showAddDialog"/>
          <ConfimationDialog v-model="showDeleteDialog" @confirm="onDeleteMedication">
            Are you sure you want to delete medication {{ medicationToDelete.name }}?
          </ConfimationDialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click.stop="openDeleteDialog(item)">delete</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import AddMedicationDialog from '@/components/AddMedicationDialog'
  import ConfimationDialog from '@/components/ConfimationDialog'
  import { mapActions, mapGetters } from 'vuex'
  import helpers from '@/mixins/helpers'

  export default {
    name: 'Medications',
    components: { ConfimationDialog, AddMedicationDialog },
    mixins: [helpers],
    data: () => ({
      searchString: null,
      showAddDialog: false,
      showDeleteDialog: false,
      medicationToDelete: {},
      headers: [
        { text: 'Name', align: 'left', value: 'name', },
        { text: 'Category', align: 'left', sortable: false, value: 'category.name' },
        { text: 'Expiration Date', align: 'left', value: 'expiration_date' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      newMedication: {
        name: '',
        category: '',
        production_date: null,
        expiration_date: null
      }
    }),
    computed: {
      ...mapGetters(['allMedications'])
    },
    methods: {
      ...mapActions(['deleteMedication']),
      async onDeleteMedication (medication = this.medicationToDelete) {
        await this.deleteMedication({ id: medication.id, categoryId: medication.category.id })
      },
      openDeleteDialog(medication) {
        this.showDeleteDialog = true
        this.medicationToDelete = medication
      }
    }
  }
</script>

<style scoped>
</style>
