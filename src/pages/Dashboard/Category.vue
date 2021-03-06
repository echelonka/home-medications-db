<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="medicationsByCategory(categoryName)"
      :search="searchString"
      disable-pagination
      hide-default-footer
      single-expand
      show-expand
    >
      <template v-slot:top>
        <v-card class="elevation-0">
          <v-card-title>{{ categoryName | capitalize }}</v-card-title>
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
          Are you sure you want to delete medication {{ medicationToDelete.name }}?
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
  import helpers from '@/mixins/helpers'

  export default {
    name: 'Category',
    mixins: [helpers],
    data: () => ({
      searchString: null,
      showDeleteDialog: false,
      medicationToDelete: {},
      headers: [
        { text: 'Name', align: 'left', value: 'name', },
        { text: 'Category', align: 'left', sortable: false, value: 'category.name', width: 250 },
        { text: 'Expiration Date', align: 'left', value: 'expiration_date', width: 150 },
        { text: 'Actions', value: 'action', sortable: false, width: 50 }
      ],
    }),
    computed: {
      ...mapGetters(['medicationsByCategory']),
      categoryName () {
        return this.$route.params.category
      }
    },
    methods: {
      ...mapActions(['deleteMedication']),
      async onDeleteMedication (medication = this.medicationToDelete) {
        await this.deleteMedication({ id: medication.id, categoryId: medication.category.id })
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
