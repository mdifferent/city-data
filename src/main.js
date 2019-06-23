import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import ECharts from 'vue-echarts/components/ECharts'
Vue.component('Chart', ECharts)
import echarts from 'echarts'

import 'echarts/map/js/china.js'
import 'echarts/extension/bmap/bmap.js'
Vue.prototype.$echarts = echarts

import store from './vuex/store'

import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)

import Axios from "axios";
Vue.prototype.$axios = Axios;
Axios.defaults.baseURL = "http://localhost:8011/api";
Axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

import router from "./router";
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')