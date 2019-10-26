<template>
  <v-dialog :value="value" @input="closeDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Delete Medication</span>
      </v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="onConfirm" :loading="isSending">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfimationDialog',
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
      isSending: false
    }),
    methods: {
      closeDialog() {
        this.$emit('input', false)
      },
      async onConfirm() {
        this.isSending = true
        await this.$emit('confirm')
        this.isSending = false
        this.closeDialog()
      }
    }
  }
</script>

<style scoped>

</style>
