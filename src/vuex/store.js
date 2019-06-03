// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
//import * as actions from './actions'
//import pageHeader from './modules/pageHeader'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentCity: [],
    currentPage: null
  },
  mutations: {
    changeCity (state, newCity) {
      state.currentCity = newCity
    },
    changePage (state, page) {
      state.currentPage = page
    }
  },
  actions:{
    
  },
  getters: {
    currentCity: (state) => state.currentCity,
    currentPage: (state) => state.currentPage
  },
  strict: false
})