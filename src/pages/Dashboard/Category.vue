<template>
  <v-card>
    <v-data-table :headers="headers" :items="medicationsByCategory(categoryName)" :search="searchString" disable-pagination hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>{{ categoryName | capitalize }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchString"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
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
  import ConfimationDialog from '@/components/ConfimationDialog'
  import { mapActions, mapGetters } from 'vuex'
  import helpers from '@/mixins/helpers'

  export default {
    name: 'Category',
    mixins: [helpers],
    components: { ConfimationDialog },
    data: () => ({
      searchString: null,
      showDeleteDialog: false,
      medicationToDelete: {},
      headers: [
        { text: 'Name', align: 'left', value: 'name', },
        { text: 'Category', align: 'left', sortable: false, value: 'category.name' },
        { text: 'Expiration Date', align: 'left', value: 'expiration_date' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
    }),
    computed: {
      ...mapGetters(['medicationsByCategory']),
      categoryName() {
        return this.$route.params.category
      }
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
