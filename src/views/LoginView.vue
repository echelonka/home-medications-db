<script setup>
import { Form, FormField } from '@primevue/forms'
import { Button, Card, InputText, InputGroup, InputGroupAddon, Message, useToast } from 'primevue'
import { reactive, ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useFirebaseAuth()
const toast = useToast()

const initialValues = reactive({
  email: '',
  password: '',
})
const loading = ref(false)

const resolver = ref(
  zodResolver(
    z.object({
      email: z.string().min(1, 'Email is required').email('Invalid email'),
      password: z.string().min(1, 'Password is required'),
    }),
  ),
)

const onSubmit = async ({ valid, values }) => {
  if (!valid || !values) return

  loading.value = true

  try {
    await signInWithEmailAndPassword(auth, values.email, values.password)
    await router.replace({ name: 'dashboard' })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Failed to log in',
      detail: 'Wrong email or password.',
      group: 'bc',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center px-4 py-8 md:items-center h-full">
    <Form :initialValues :resolver @submit="onSubmit" class="w-full max-w-md">
      <Card>
        <template #title>Log in</template>
        <template #content>
          <div class="flex flex-col gap-y-2 pb-4">
            <FormField v-slot="$field" name="email">
              <InputGroup>
                <InputGroupAddon>
                  <i class="pi pi-user" />
                </InputGroupAddon>
                <InputText :disabled="loading" type="text" placeholder="Email" />
              </InputGroup>
              <Message v-if="$field?.invalid" size="small" variant="simple" severity="error">
                {{ $field.error?.message }}
              </Message>
            </FormField>

            <FormField v-slot="$field" name="password">
              <InputGroup>
                <InputGroupAddon>
                  <i class="pi pi-lock" />
                </InputGroupAddon>
                <InputText
                  :disabled="loading"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </InputGroup>
              <Message v-if="$field?.invalid" size="small" variant="simple" severity="error">
                {{ $field.error?.message }}
              </Message>
            </FormField>
          </div>
        </template>
        <template #footer>
          <Button type="submit" label="Log In" fluid :loading />
        </template>
      </Card>
    </Form>
  </div>
</template>
