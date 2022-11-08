import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Use Vuex
Vue.use(Vuex)

// Use Axios for API
Vue.use(VueAxios, axios)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
  },
  getters: {
  },  
  modules: {
    
  }
})

export default { store }

new Vue({
  router,
  created() {
},
  render: h => h(App)
}).$mount('#app')
