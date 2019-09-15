<template>
  <md-dialog :md-active="value">
    <md-dialog-title>Add Medication</md-dialog-title>
    <md-dialog-content>
      <md-field :class="getValidationClass('name')">
        <label for="name">Name</label>
        <md-input name="name" id="name" autocomplete="off" v-model="newMedication.name"/>
        <span class="md-error" v-if="!$v.newMedication.name.required">The name is required</span>
      </md-field>
      <md-field :class="getValidationClass('category')">
        <label for="category">Category</label>
        <md-select name="category" id="category" v-model="newMedication.category" md-dense>
          <md-option
            :value="category.id"
            v-for="category in $store.state.categories"
            :key="category.id"
          >{{ category.name | capitalize }}
          </md-option>
        </md-select>
        <span class="md-error" v-if="!$v.newMedication.category.required">The category is required</span>
      </md-field>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-small-size-100">
          <md-datepicker v-model="newMedication.production_date" :class="getValidationClass('production_date')" md-immediately>
            <label>Production Date</label>
            <span class="md-error" v-if="!$v.newMedication.production_date.required">The production date is required</span>
          </md-datepicker>
        </div>
        <div class="md-layout-item md-small-size-100">
          <md-datepicker v-model="newMedication.expiration_date" :class="getValidationClass('expiration_date')" md-immediately>
            <label>Expiration date</label>
            <span class="md-error" v-if="!$v.newMedication.expiration_date.required">The expiration date is required</span>
          </md-datepicker>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button @click="hideAddingDialog">Cancel</md-button>
      <md-button class="md-raised md-primary" @click="addMedication" :disabled="isSending">Add</md-button>
    </md-dialog-actions>
  </md-dialog>
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
      isSending: false,
      newMedication: {
        name: null,
        category: null,
        production_date: null,
        expiration_date: null
      }
    }),
    validations: {
      newMedication: {
        name: {
          required
        },
        category: {
          required
        },
        production_date: {
          required
        },
        expiration_date: {
          required
        }
      }
    },
    filters: {
      capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.newMedication[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearNewMedication() {
        this.newMedication = {
          name: '',
          category: '',
          production_date: null,
          expiration_date: null
        }
        this.$v.$reset()
      },
      hideAddingDialog() {
        this.clearNewMedication()
        this.$emit('input', false)
      },
      async addMedication() {
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
