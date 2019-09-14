import Vue from 'vue'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { firestorePlugin } from 'vuefire'
import config from '../config'

import App from '@/App.vue'

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(firestorePlugin)

Vue.material.locale.dateFormat = 'dd/MM/yyyy'
Vue.material.locale.firstDayOfAWeek = 1

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
    render: h => h(App)
  }).$mount('#app')
})
