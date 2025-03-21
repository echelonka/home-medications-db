<script setup>
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Form, FormField } from '@primevue/forms'
import { Button, Card, InputText, Message } from 'primevue'
import { reactive, ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { db } from '@/firebase.js'
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()

const formValues = reactive({
  name: '',
})

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1, 'Kit name is required'),
    }),
  ),
)

const createKit = async ({ valid, values }) => {
  if (!valid) return

  try {
    await setDoc(doc(db, 'kits', user.value.uid), {
      createdAt: serverTimestamp(),
      name: values.name,
      members: [],
    })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <Form :initial-values="formValues" :resolver @submit="createKit">
    <Card class="max-w-xl">
      <template #title>Create your first kit</template>
      <template #subtitle>
        Kit contains your medications. You can share your kit with other users.
      </template>
      <template #content>
        <FormField v-slot="$field" name="name">
          <InputText class="w-full" placeholder="Kit name" />
          <Message v-if="$field?.invalid" size="small" variant="simple" severity="error">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </template>
      <template #footer>
        <Button class="w-full" label="Create" type="submit" />
      </template>
    </Card>
  </Form>
</template>
