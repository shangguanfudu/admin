import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '@/styles/reset.less'
import 'element-ui/lib/theme-chalk/index.css'
import dayjs from 'dayjs'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

Vue.component('Editor', Editor)
Vue.component('Toolbar', Toolbar)
Vue.filter('dateFormat', (d) => {
  return dayjs(d).format('YYYY-MM-DD')
})
Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
