import Vue from 'vue'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import config from '../config'

import App from '@/App.vue'

export const db = firebase.initializeApp(config).firestore()

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(Vuelidate)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
