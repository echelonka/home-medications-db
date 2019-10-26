<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <v-list-item-group>
          <v-list-item :to="{ name: 'Medications' }">
            <v-list-item-icon>
              <v-icon>home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-group
          :prepend-icon="expandCategories ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          append-icon=""
          v-model="expandCategories"
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Categories</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item-group>
            <v-list-item
              v-for="category in $store.state.categories"
              :key="category.id"
              :to="{ name: 'Category', params: { category: category.name } }"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <span class="category">{{ category.name }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Home Medications</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left offset-x>
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on">
            <v-avatar color="primary">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="signOut">
            <v-list-item-icon>
              <v-icon>exit_to_app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import { auth } from 'firebase'

  export default {
    name: 'Dashboard',
    data: () => ({
      drawer: false,
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
