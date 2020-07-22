<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
  import firebase from 'firebase/app'
  import { mapMutations } from 'vuex'

  export default {
    name: 'App',
    mounted() {
      const currentUser = firebase.auth().currentUser
      if (currentUser) this.setUser(currentUser)
    },
    methods: {
      ...mapMutations(['setUser'])
    }
  }
</script>

<style>
  #app {
    height: 100vh;
  }
</style>
