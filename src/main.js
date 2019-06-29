import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
/*import {
    RadioGroup,
    RadioButton,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Row,
    Col,
    Slider,
    Cascader,
    Button,
} from 'element-ui'

Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Container);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Slider);
Vue.use(Cascader);
Vue.use(Button);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;*/

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