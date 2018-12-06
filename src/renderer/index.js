import Vue from 'vue'
import App from './App.vue'

function init() {
  Vue.config.devtools = false
  Vue.config.productionTip = false

  new Vue({
    ...App
  }).$mount('#app')
}

init()
