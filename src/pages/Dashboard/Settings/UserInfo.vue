<template>
  <v-card>
    <v-card-text>
      <v-avatar color="blue darken-3" size="128">
        <v-icon dark x-large>mdi-account-circle</v-icon>
      </v-avatar>
      <h3>{{currentUser.displayName || 'No name'}}</h3>
      <v-file-input
        :loading="isAvatarUploading"
        :rules="avatarRules"
        @change="onUploadAvatar"
        prepend-icon="mdi-camera"
        show-size
        label="Upload avatar"
      ></v-file-input>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  import { toBase64 } from '@/mixins/helpers'

  export default {
    name: 'UserInfo',
    data: () => ({
      avatarRules: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!'
      ],
      isAvatarUploading: false
    }),
    computed: {
      ...mapState({
        currentUser: state => state.currentUser || {}
      })
    },
    methods: {
      async onUploadAvatar(file) {
        this.isAvatarUploading = true
        if (!file || file.size >= 2000000) return
        console.log(await toBase64(file))
        this.isAvatarUploading = false
      }
    }
  }
</script>
