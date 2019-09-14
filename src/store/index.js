import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { firestoreAction, vuexfireMutations } from 'vuexfire'
import firebase from 'firebase/app'
import { db } from '@/main'

Vue.use(Vuex)

export default new Store({
  state: {
    categories: [],
    medications: [],
    currentUser: null
  },

  getters: {
    allMedications: state => {
      return state.medications.map(medication => {
        const toDate = timestamp => {
          if (!timestamp) return '-'
          const date = new Date(timestamp.seconds * 1000)
          return `${ date.getDate() }/${ date.getMonth() }/${ date.getFullYear() }`
        }
        const getCategoryName = id => {
          const category = state.categories.find(category => category.id === id)
          return category ? category.name : '-'
        }
        return {
          ...medication,
          id: medication.id,
          category: {
            id: medication.category,
            name: getCategoryName(medication.category)
          },
          production_date: toDate(medication.production_date),
          expiration_date: toDate(medication.expiration_date)
        }
      })
    }
  },

  mutations: vuexfireMutations,

  actions: {
    bindCategories: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('categories', db.collection('categories'))),
    unbindCategories: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('categories')),

    bindMedications: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('medications', db.collection('medications'))),
    unbindMedications: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('medications')),

    addMedication: async ({ state }, newMedication) => {
      const medication = {
        ...newMedication,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        production_date: firebase.firestore.Timestamp.fromDate(newMedication.production_date),
        expiration_date: firebase.firestore.Timestamp.fromDate(newMedication.expiration_date)
      }
      const medicationId = (await db.collection('medications').add(medication)).id
      return db.collection(`categories/${ medication.category }/medications`).doc(medicationId).set(medication)
    },

    deleteMedication: async ({ state }, { id, categoryId }) => {
      await db.collection('medications').doc(id).delete()
      return db.collection(`categories/${ categoryId }/medications`).doc(id).delete()
    }
  }
})
