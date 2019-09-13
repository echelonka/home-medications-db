<template>
  <md-app>
    <md-app-toolbar class="md-primary" md-elevation="0">
      <md-button class="md-icon-button" @click="menuVisible = !menuVisible" v-if="!menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title" style="flex: 1">Home Medications</span>
      <md-menu size="auto">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-avatar class="md-avatar-icon">
            <md-icon>account_circle</md-icon>
          </md-avatar>
        </md-button>
        <md-menu-content>
          <md-menu-item>
            <span>Settings</span>
            <md-icon>settings</md-icon>
          </md-menu-item>
          <md-menu-item @click="signOut">
            <span>Logout</span>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
      <md-toolbar class="md-transparent" md-elevation="0">
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button md-dense" @click="menuVisible = !menuVisible">
            <md-icon>keyboard_arrow_left</md-icon>
          </md-button>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>move_to_inbox</md-icon>
          <span class="md-list-item-text">Inbox</span>
        </md-list-item>

        <md-list-item>
          <md-icon>send</md-icon>
          <span class="md-list-item-text">Sent Mail</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>

    <md-app-content>
      <router-view></router-view>
    </md-app-content>
  </md-app>
</template>

<script>
  import { auth } from 'firebase'

  export default {
    name: 'Dashboard',
    data: () => ({
      menuVisible: false
    }),
    methods: {
      signOut () {
        auth().signOut()
      }
    }
  }
</script>

<style scoped>
  .md-app {
    height: 100%;
  }

  .md-app-content {
    padding: 0;
  }
</style>
