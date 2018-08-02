import Vue from 'vue'
import axios from 'axios'
import SuiVue from 'semantic-ui-vue'
import App from './App'
import router from './router'
import VueElectronJSONStorage from 'vue-electron-json-storage'

require('vue2-animate/dist/vue2-animate.min.css')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(SuiVue)
Vue.use(VueElectronJSONStorage)

const storage = require('electron-json-storage')
router.beforeEach(
  (to, from, next) => {
    document.title = 'Awesome Todo | ' + to.meta.title
    localStorage.setItem('to', to.path)
    let user = ''
    storage.get('auth', (error, auth) => {
      if (error) throw error
      if (typeof auth === 'object' && Object.keys(auth).length > 0) {
        user = auth.username ? auth : null
      }
      if ((to.name === 'landing-page')) {
        next()
      } else if (!to.matched.some(record => record.meta.forAuth)) { // Guest routes
        if (user) {
          next({
            name: 'page-todos'
          })
        } else next()
      } else if (to.matched.some(record => record.meta.forAuth)) { // Requires authentication
        if (!user) {
          next({
            path: '/login'
          })
        } else next()
      } else next()
    })
  }
)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>',
  mounted () {
  }
}).$mount('#app')
