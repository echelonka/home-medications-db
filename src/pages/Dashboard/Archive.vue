<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="archivedMedications"
      :search="searchString"
      disable-pagination
      hide-default-footer
      single-expand
      show-expand
    >
      <template v-slot:top>
        <v-card class="elevation-0">
          <v-card-title>
            Archive
            <v-spacer></v-spacer>
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
        <ConfirmationDialog v-model="showDeleteDialog" headline="Delete Medication" @confirm="onDeleteMedication">
          Are you sure you want to delete medication {{ medicationToDelete.name }} from archive?
        </ConfirmationDialog>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click.stop="openDeleteDialog(item)">delete</v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item.description || '-' }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Archive',
    data: () => ({
      headers: [
        { text: 'Name', align: 'left', value: 'name', },
        { text: 'Category', align: 'left', sortable: false, value: 'category.name', width: 250 },
        { text: 'Actions', value: 'action', sortable: false, width: 50 }
      ],
      medicationToDelete: {},
      searchString: null,
      showDeleteDialog: false
    }),
    beforeMount () {
      this.bindArchive()
    },
    beforeDestroy () {
      this.unbindArchive()
    },
    computed: mapGetters(['archivedMedications']),
    methods: {
      ...mapActions(['deleteFromArchive', 'bindArchive', 'unbindArchive']),
      async onDeleteMedication () {
        this.deleteFromArchive(this.medicationToDelete.id)
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
