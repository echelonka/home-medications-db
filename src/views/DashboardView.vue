<script setup>
import { signOut } from 'firebase/auth'
import { doc } from 'firebase/firestore'
import { useFirebaseAuth, useCurrentUser, useDocument } from 'vuefire'
import { useRouter } from 'vue-router'
import { db } from '@/firebase.js'
import CreateKitCard from '@/components/CreateKitCard.vue'
import { Button } from 'primevue'

const auth = useFirebaseAuth()
const user = useCurrentUser()
const router = useRouter()

const kit = useDocument(doc(db, 'kits', user.value.uid))
const onSignOut = async () => {
  await signOut(auth)
  await router.replace('login')
}
</script>

<template>
  <div class="p-8 flex flex-col gap-y-4">
    <Button @click="onSignOut" label="Log out"></Button>
    <CreateKitCard v-if="!kit" />
    <div v-else>
      <!-- TODO Medications table -->
    </div>
  </div>
</template>
