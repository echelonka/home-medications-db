import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import Vuelidate from 'vuelidate'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { firestorePlugin } from 'vuefire'
import config from '../config'

import App from '@/App.vue'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(firestorePlugin)

export const db = firebase.initializeApp(config).firestore()

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch('bindCategories')
    store.dispatch('bindMedications')
  } else {
    store.dispatch('unbindCategories')
    store.dispatch('unbindMedications')
    router.replace('/login')
  }

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})
