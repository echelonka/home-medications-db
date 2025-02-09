<script setup>
import { RouterView } from 'vue-router'
import { Toast } from 'primevue'
</script>

<template>
  <main class="h-[100vh] bg-gray-100">
    <RouterView />
    <Toast position="bottom-center" group="bc" />
  </main>
</template>
