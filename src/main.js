import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import ECharts from 'vue-echarts/components/ECharts'
Vue.component('Chart', ECharts)
import echarts from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/map/js/china.js'
Vue.prototype.$echarts = echarts

import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)

import Axios from "axios";
Vue.prototype.$axios = Axios;

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'Lu2KqMUWylee4xzGQxANk2mHBjiaMWSh'
})

import router from "./router";
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
