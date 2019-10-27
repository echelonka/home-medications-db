<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="allMedications()"
      :search="searchString"
      disable-pagination
      hide-default-footer
      single-expand
      show-expand
    >
      <template v-slot:top>
        <v-card class="elevation-0">
          <v-card-title>
            All Medications
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click.stop="openActionDialog('add')">Add Medication</v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="searchString"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
          <MedicationActionDialog
            :action="medicationAction"
            :initial-medication="editedMedication"
            v-model="showActionDialog"
          />
          <ConfimationDialog v-model="showDeleteDialog" @confirm="onDeleteMedication">
            Are you sure you want to delete medication {{ medicationToDelete.name }}?
          </ConfimationDialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click.stop="openActionDialog('edit', item)">edit</v-icon>
        <v-icon small @click.stop="openDeleteDialog(item)">delete</v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item.description || '-' }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import MedicationActionDialog from '@/components/MedicationActionDialog'
  import ConfimationDialog from '@/components/ConfimationDialog'
  import { mapActions, mapGetters } from 'vuex'
  import helpers from '@/mixins/helpers'

  export default {
    name: 'Medications',
    components: { ConfimationDialog, MedicationActionDialog },
    mixins: [helpers],
    data: () => ({
      editedMedication: {},
      medicationAction: 'add',
      medicationToDelete: {},
      searchString: null,
      showActionDialog: false,
      showDeleteDialog: false,
      headers: [
        { text: 'Name', align: 'left', value: 'name', },
        { text: 'Category', align: 'left', sortable: false, value: 'category.name' },
        { text: 'Expiration Date', align: 'left', value: 'expiration_date' },
        { text: 'Actions', value: 'action', sortable: false }
      ]
    }),
    computed: {
      ...mapGetters(['allMedications'])
    },
    methods: {
      ...mapActions(['deleteMedication']),
      async onDeleteMedication (medication = this.medicationToDelete) {
        await this.deleteMedication({ id: medication.id, categoryId: medication.category.id })
      },
      openActionDialog (action, medication = {}) {
        this.showActionDialog = true
        this.medicationAction = action
        this.editedMedication = medication
      },
      openDeleteDialog (medication) {
        this.showDeleteDialog = true
        this.medicationToDelete = medication
      }
    }
  }
</script>

<style scoped>
</style>
