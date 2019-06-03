import {
    CHANGE_CITY,
} from '../mutation-types'

const state = {
    currentCity: "AA"
}

const mutations = {
    [CHANGE_CITY] (newCity) {
        console.log(newCity)
        state.currentCity = newCity
    }
}

export default {
    state,
    mutations
}