import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import ECharts from 'vue-echarts/components/ECharts'
Vue.component('Chart', ECharts)
import echarts from 'echarts'
import 'echarts/lib/chart/line'

import 'echarts/map/js/china.js'
import 'echarts/map/js/province/beijing'
import 'echarts/map/js/province/anhui'
import 'echarts/map/js/province/aomen'
import 'echarts/map/js/province/beijing'
import 'echarts/map/js/province/chongqing'
import 'echarts/map/js/province/fujian'
import 'echarts/map/js/province/gansu'
import 'echarts/map/js/province/guangdong'
import 'echarts/map/js/province/guangxi'
import 'echarts/map/js/province/guizhou'
import 'echarts/map/js/province/hainan'
import 'echarts/map/js/province/hebei'
import 'echarts/map/js/province/heilongjiang'
import 'echarts/map/js/province/henan'
import 'echarts/extension/bmap/bmap';
Vue.prototype.$echarts = echarts

import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)

import Axios from "axios";
Vue.prototype.$axios = Axios;

import router from "./router";
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
