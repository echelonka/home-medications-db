<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { loginSchema } from '@/schemas'
import { useAuthStore } from '@/stores/auth'
import { zodRule } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<{ validate: () => Promise<{ valid: boolean }> }>()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const emailRules = [zodRule(loginSchema.shape.email)]
const passwordRules = [zodRule(loginSchema.shape.password)]

async function submit() {
  error.value = ''
  const result = await form.value?.validate()
  if (!result?.valid) return

  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    await router.push({ name: 'dashboard' })
  } catch {
    error.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-main class="d-flex align-center justify-center bg-grey-lighten-4">
    <v-card class="pa-4" width="420" elevation="4" rounded="lg">
      <v-card-title class="text-center text-h5 mb-2">
        <v-icon icon="mdi-pill" color="primary" class="mr-2" />
        Home Medications
      </v-card-title>
      <v-card-subtitle class="text-center mb-4">Sign in to your account</v-card-subtitle>

      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            prepend-inner-icon="mdi-email-outline"
            :rules="emailRules"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="passwordRules"
            variant="outlined"
            class="mb-2"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
            {{ error }}
          </v-alert>

          <v-btn type="submit" color="primary" size="large" block :loading="loading">
            Sign in
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>
