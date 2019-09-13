import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { firestoreAction, vuexfireMutations } from 'vuexfire'
import { db } from '@/main'

Vue.use(Vuex)

export default new Store({
  state: {
    categories: [],
    medications: []
  },

  mutations: vuexfireMutations,

  actions: {
    bindCategories: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('categories', db.collection('categories'))),
    unbindCategories: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('categories')),

    bindMedications: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('medications', db.collection('medications'))),
    unbindMedications: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('medications'))
  }
})
