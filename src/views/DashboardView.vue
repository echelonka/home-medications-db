<script setup>
import { signOut } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router'

const auth = useFirebaseAuth()
const router = useRouter()

const onSignOut = async () => {
  await signOut(auth)
  await router.replace('login')
}
</script>

<template>
  <div>Welcome to dashboard!</div>
  <button @click="onSignOut">Log out</button>
</template>
