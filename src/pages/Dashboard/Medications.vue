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
        <ConfirmationDialog v-model="showArchiveDialog" headline="Archive Medication"
                           @confirm="onMedicationAction('archive')">
          Are you sure you want to move {{ medicationToAct.name }} to archive?
        </ConfirmationDialog>
        <ConfirmationDialog v-model="showDeleteDialog" headline="Delete Medication"
                           @confirm="onMedicationAction('delete')">
          Are you sure you want to delete medication {{ medicationToAct.name }}?
        </ConfirmationDialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click.stop="openActionDialog('edit', item)">edit</v-icon>
        <v-icon small class="mr-2" @click.stop="openConfirmDialog(item, 'Archive')">archive</v-icon>
        <v-icon small @click.stop="openConfirmDialog(item, 'Delete')">delete</v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item.description || '-' }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import MedicationActionDialog from '@/components/MedicationActionDialog'
  import { mapActions, mapGetters } from 'vuex'
  import helpers from '@/mixins/helpers'

  export default {
    name: 'Medications',
    components: { MedicationActionDialog },
    mixins: [helpers],
    data: () => ({
      editedMedication: {},
      medicationAction: 'add',
      medicationToAct: {},
      searchString: null,
      showActionDialog: false,
      showArchiveDialog: false,
      showDeleteDialog: false,
      headers: [
        { text: 'Name', align: 'left', value: 'name', },
        { text: 'Category', align: 'left', sortable: false, value: 'category.name', width: 250 },
        { text: 'Expiration Date', align: 'left', value: 'expiration_date', width: 150 },
        { text: 'Actions', value: 'action', sortable: false, width: 100 }
      ]
    }),
    computed: {
      ...mapGetters(['allMedications'])
    },
    methods: {
      ...mapActions(['deleteMedication', 'archiveMedication']),
      async onMedicationAction (actionName, medication = this.medicationToAct) {
        await this[`${ actionName }Medication`]({ id: medication.id, categoryId: medication.category.id })
      },
      openActionDialog (action, medication = {}) {
        this.showActionDialog = true
        this.medicationAction = action
        this.editedMedication = medication
      },
      openConfirmDialog (medication = {}, actionName) {
        this[`show${ actionName }Dialog`] = true
        this.medicationToAct = medication
      }
    }
  }
</script>

<style scoped>
</style>
