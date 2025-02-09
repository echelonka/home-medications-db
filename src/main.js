import './assets/base.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/firebase.js'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { ToastService } from 'primevue'

const app = createApp(App)

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none',
    },
  },
})

app.use(ToastService)

app.use(router)

app.mount('#app')
