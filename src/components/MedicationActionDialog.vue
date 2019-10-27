<template>
  <v-dialog :value="value" @input="hideDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ action | capitalize }} Medication</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" xs="12">
            <v-text-field v-model="medication.name" label="Name" :error-messages="nameErrors"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              :items="categories"
              label="Category"
              v-model="medication.category"
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
                  v-model="medication.expiration_date"
                  label="Expiration date"
                  hint="DD/MM/YYYY"
                  persistent-hint
                  prepend-icon="event"
                  @blur="date = parseDate(medication.expiration_date)"
                  v-on="on"
                  :error-messages="dateErrors"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title @input="dateMenu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" xs="12">
            <v-textarea label="Description (optional)" v-model="medication.description"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="changeMedication" :loading="isSending">{{ action }}</v-btn>
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
      action: {
        type: String,
        required: true,
        validator: value => ['add', 'edit'].indexOf(value) !== -1
      },
      initialMedication: {
        type: Object
      },
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
      medication: {
        name: null,
        category: null,
        description: null,
        expiration_date: null
      }
    }),
    validations: {
      medication: {
        name: { required },
        category: { required },
        expiration_date: { required }
      }
    },
    watch: {
      date (newDate) {
        this.medication.expiration_date = this.formatDate(newDate)
      },
      value(value) {
        if (this.action === 'edit' && value) {
          this.medication = {
            ...this.initialMedication,
            category: this.initialMedication.category.id,
            initialCategory: this.initialMedication.category.id
          }
        }
      }
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
        if (!this.$v.medication.category.$dirty) return errors
        !this.$v.medication.category.required && errors.push('Category is required.')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.medication.name.$dirty) return errors
        !this.$v.medication.name.required && errors.push('Name is required.')
        return errors
      },
      dateErrors () {
        const errors = []
        if (!this.$v.medication.expiration_date.$dirty) return errors
        !this.$v.medication.expiration_date.required && errors.push('Expiration date is required.')
        return errors
      }
    },
    methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${ day }/${ month }/${ year }`
      },
      parseDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${ year }-${ month.padStart(2, '0') }-${ day.padStart(2, '0') }`
      },
      clearMedication () {
        this.medication = {
          name: null,
          category: null,
          description: null,
          expiration_date: null
        }
        this.$v.$reset()
      },
      hideDialog () {
        this.clearMedication()
        this.$emit('input', false)
      },
      async changeMedication () {
        this.$v.$reset()
        this.$v.$touch()
        if (this.$v.$invalid) return false

        this.isSending = true
        await this.$store.dispatch(`${ this.action }Medication`, this.medication)
        this.clearMedication()
        this.isSending = false
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped>

</style>
