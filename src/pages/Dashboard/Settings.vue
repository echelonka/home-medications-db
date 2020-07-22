<template>
  <v-row>
    <v-col cols="12" md="3">
      <UserInfo/>
    </v-col>
  </v-row>
</template>

<script>
  import { mapState } from 'vuex'
  import UserInfo from '@/pages/Dashboard/Settings/UserInfo'

  export default {
    name: 'Settings',
    components: {UserInfo},
    computed: {
      ...mapState(['currentUser'])
    }
  }
</script>

<style scoped>

</style>