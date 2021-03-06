import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { firestoreAction, vuexfireMutations } from 'vuexfire'
import firebase from 'firebase/app'
import { db } from '@/main'
import { toDate } from '@/mixins/helpers'

Vue.use(Vuex)

export default new Store({
  state: {
    archive: [],
    categories: [],
    medications: [],
    currentUser: null
  },

  getters: {
    allMedications: state => () => {
      const getCategoryName = id => state.categories.find(category => category.id === id).name
      return state.medications.map(medication => ({
        ...medication,
        id: medication.id,
        category: {
          id: medication.category,
          name: getCategoryName(medication.category)
        },
        expiration_date: toDate(medication.expiration_date)
      }))
    },
    medicationsByCategory: (state, getters) => category => {
      return getters.allMedications().filter(medication => medication.category.name === category)
    },
    archivedMedications: state => {
      const getCategoryName = id => state.categories.find(category => category.id === id).name
      return state.archive.map(medication => ({
        ...medication,
        category: {
          id: medication.category,
          name: getCategoryName(medication.category)
        }
      }))
    }
  },

  mutations: vuexfireMutations,

  actions: {
    bindCategories: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('categories', db.collection('categories'))),
    unbindCategories: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('categories')),

    bindMedications: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('medications', db.collection('medications').orderBy('name'))),
    unbindMedications: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('medications')),

    bindArchive: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('archive', db.collection('archive').orderBy('name'))),
    unbindArchive: firestoreAction(({ unbindFirestoreRef }) => unbindFirestoreRef('archive')),

    // eslint-disable-next-line no-unused-vars
    addMedication: async ({ state }, newMedication) => {
      const [day, month, year] = newMedication.expiration_date.split('/')
      const expirationDate = new Date(+year, +month - 1, +day)
      const medication = {
        ...newMedication,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        expiration_date: firebase.firestore.Timestamp.fromDate(expirationDate)
      }
      const medicationId = (await db.collection('medications').add(medication)).id
      await db.collection(`categories/${ medication.category }/medications`).doc(medicationId).set(medication)
    },

    // eslint-disable-next-line no-unused-vars
    editMedication: async ({ state }, editedMedication) => {
      const [day, month, year] = editedMedication.expiration_date.split('/')
      const expirationDate = new Date(+year, +month - 1, +day)
      const medication = {
        ...editedMedication,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        expiration_date: firebase.firestore.Timestamp.fromDate(expirationDate)
      }
      delete medication.initialCategory
      await db.collection('medications').doc(medication.id).update(medication)
      // Edit categories collections if category was changed
      if (editedMedication.initialCategory !== medication.category) {
        await db.collection(`categories/${ editedMedication.initialCategory }/medications`).doc(medication.id).delete()
        await db.collection(`categories/${ medication.category }/medications`).doc(medication.id).set(medication)
      }
    },

    // eslint-disable-next-line no-unused-vars
    deleteMedication: async ({ state }, { id, categoryId }) => {
      await db.collection('medications').doc(id).delete()
      await db.collection(`categories/${ categoryId }/medications`).doc(id).delete()
    },

    archiveMedication: async ({ dispatch }, { id, categoryId }) => {
      const medication = (await db.collection('medications').doc(id).get()).data()
      delete medication.expiration_date
      medication.id = id
      medication.updated_at = firebase.firestore.FieldValue.serverTimestamp()

      dispatch('deleteMedication', { id, categoryId })
      await db.collection('archive').doc(id).set(medication)
    },

    // eslint-disable-next-line no-unused-vars
    deleteFromArchive: async ({ state }, id) => {
      await db.collection('archive').doc(id).delete()
    }
  }
})
