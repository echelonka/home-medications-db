<template>
  <v-dialog :value="value" @input="hideAddingDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Medication</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" xs="12">
            <v-text-field v-model="newMedication.name" label="Name" :error-messages="nameErrors"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              :items="categories"
              label="Category"
              v-model="newMedication.category"
              :error-messages="categoryErrors"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="newMedication.expiration_date"
                  label="Expiration date"
                  hint="MM/DD/YYYY"
                  persistent-hint
                  prepend-icon="event"
                  @blur="date = parseDate(newMedication.expiration_date)"
                  v-on="on"
                  :error-messages="dateErrors"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title @input="dateMenu = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideAddingDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="addMedication" :loading="isSending">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { required } from 'vuelidate/lib/validators'
  import helpers from '@/mixins/helpers'

  export default {
    name: 'AddMedicationDialog',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    mixins: [helpers],
    data: () => ({
      date: null,
      dateMenu: false,
      isSending: false,
      newMedication: {
        name: null,
        category: null,
        expiration_date: null
      }
    }),
    validations: {
      newMedication: {
        name: { required },
        category: { required },
        expiration_date: { required }
      }
    },
    watch: {
      date (newDate) {
        this.newMedication.expiration_date = this.formatDate(newDate)
      },
    },
    computed: {
      categories () {
        return this.$store.state.categories.map(category => ({
          text: this.capitalize(category.name),
          value: category.id
        }))
      },
      categoryErrors () {
        const errors = []
        if (!this.$v.newMedication.category.$dirty) return errors
        !this.$v.newMedication.category.required && errors.push('Category is required.')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.newMedication.name.$dirty) return errors
        !this.$v.newMedication.name.required && errors.push('Name is required.')
        return errors
      },
      dateErrors () {
        const errors = []
        if (!this.$v.newMedication.expiration_date.$dirty) return errors
        !this.$v.newMedication.expiration_date.required && errors.push('Expiration date is required.')
        return errors
      }
    },
    methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${ month }/${ day }/${ year }`
      },
      parseDate (date) {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${ year }-${ month.padStart(2, '0') }-${ day.padStart(2, '0') }`
      },
      clearNewMedication () {
        this.newMedication = {
          name: null,
          category: null,
          expiration_date: null
        }
        this.$v.$reset()
      },
      hideAddingDialog () {
        this.clearNewMedication()
        this.$emit('input', false)
      },
      async addMedication () {
        this.$v.$reset()
        this.$v.$touch()
        if (this.$v.$invalid) return false

        this.isSending = true
        await this.$store.dispatch('addMedication', this.newMedication)
        this.clearNewMedication()
        this.isSending = false
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped>

</style>
