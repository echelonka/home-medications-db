<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <span style="flex: 1"></span>
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
            <md-icon>exit_to_app</md-icon>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-app-toolbar>

    <md-app-drawer md-permanent="full">
      <md-toolbar class="md-primary" md-elevation="0">
        <span class="md-title">Home Medications</span>
      </md-toolbar>
      <md-list>
        <md-list-item :to="{ name: 'Medications' }">
          <md-icon>home</md-icon>
          <span class="md-list-item-text">Home</span>
        </md-list-item>

        <md-list-item md-expand :md-expanded.sync="expandCategories">
          <md-icon>list</md-icon>
          <span class="md-list-item-text">Categories</span>

          <md-list slot="md-expand">
            <md-list-item
              class="md-inset"
              v-for="category in $store.state.categories"
              :key="category.id"
              :to="{ name: 'Category', params: { category: category.name } }"
            ><span class="category">{{ category.name }}</span></md-list-item>
          </md-list>
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
      expandCategories: false
    }),
    watch: {
      '$route': {
        immediate: true,
        handler(newRoute) {
          if (newRoute.name === 'Category') this.expandCategories = true
        }
      }
    },
    methods: {
      signOut: () => auth().signOut()
    }
  }
</script>

<style scoped>
  .category {
    text-transform: capitalize;
  }

  .md-drawer {
    width: 300px;
  }

  .md-drawer .md-toolbar {
    top: 0;
    position: sticky;
    z-index: 10;
  }

  .md-drawer .md-list {
    max-height: calc(100vh - 64px);
  }

  .md-app-content {
    height: calc(100vh - 64px);
  }
</style>
