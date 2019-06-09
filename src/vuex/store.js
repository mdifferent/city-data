// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
//import * as actions from './actions'
//import pageHeader from './modules/pageHeader'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentCity: [],
    currentPage: null,
    currentDateType: {
      text: "工作日",
      command: "w"
    },
    currentTimeRange: {
      text: "早高峰",
      command: "1"
    },
    currentCuky: "cu"
  },
  mutations: {
    changeCity (state, newCity) {
      state.currentCity = newCity
    },
    changePage (state, page) {
      state.currentPage = page
    },
    changeDateType (state, type) {
      state.currentDateType = type
    },
    changeTimeRange (state, time) {
      state.currentTimeRange = time
    },
    changeCuky (state, cuky) {
      if (cuky === '原始数据')
        state.currentCuky = 'cu'
      else if (cuky === '扩样数据')
        state.currentCuky = 'ky'
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