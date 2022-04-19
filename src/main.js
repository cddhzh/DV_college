import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueParticles from 'vue-particles'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import XLSX from 'xlsx';
import * as echarts from 'echarts';
import './js/china';
import 'echarts-wordcloud';

Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
