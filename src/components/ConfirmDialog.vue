<script setup lang="ts">
defineProps<{ title: string; text: string; loading?: boolean }>()
const emit = defineEmits<{ confirm: [] }>()

const open = defineModel<boolean>({ required: true })
</script>

<template>
  <v-dialog v-model="open" max-width="440">
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-6">{{ title }}</v-card-title>
      <v-card-text class="px-6">{{ text }}</v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" :disabled="loading" @click="open = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" :loading="loading" @click="emit('confirm')">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
