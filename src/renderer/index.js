import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

function init() {
  Vue.config.devtools = false
  Vue.config.productionTip = false

  new Vue({
    ...App
  }).$mount('#app')
}

init()
