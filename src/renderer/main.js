import Vue from 'vue'
import App from './App'
import axios from 'axios'
import moment from 'moment'
import db from './datastore'
import router from './router'
import VCalendar from 'v-calendar'
import { Notification, MessageBox, DatePicker, TimePicker } from 'element-ui'
import SuiVue from 'semantic-ui-vue'
import VueCroppie from 'vue-croppie'
import 'v-calendar/lib/v-calendar.min.css'
import VueElectronJSONStorage from 'vue-electron-json-storage'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

require('vue2-animate/dist/vue2-animate.min.css')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(SuiVue)
Vue.use(VueElectronJSONStorage)
Vue.use(VCalendar, {
  firstDayOfWeek: 2
})
Vue.use(VueCroppie)
Vue.use(DatePicker)
Vue.use(TimePicker)

Vue.prototype.$db = db
Vue.prototype.$moment = moment
Vue.prototype.$warn = Notification.warning
Vue.prototype.$err = Notification.error
Vue.prototype.$success = Notification.success
Vue.prototype.$info = Notification.info
Vue.prototype.$confirm = MessageBox.confirm

Vue.component('required', require('./components/Library/Required.vue'))

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
            name: 'page-boards'
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

Vue.mixin({
  methods: {
    success (mssg = 'This is a success message', duration = 4500) {
      this.$success({
        title: 'Success',
        message: mssg,
        type: 'success',
        duration: duration
      })
    },
    warning (mssg = 'This is a warning message', duration = 4500) {
      this.$warn({
        title: 'Warning',
        message: mssg,
        duration: duration
      })
    },
    info (mssg = 'This is an info message', duration = 4500) {
      this.$info({
        title: 'Info',
        message: mssg,
        duration: duration
      })
    },
    err (mssg = 'This is an error message', duration = 4500) {
      this.$err({
        title: 'Error',
        message: mssg,
        duration: duration
      })
    },
    persist (mssg = 'This is a persistent message message') {
      this.$info({
        title: 'Error',
        message: mssg,
        duration: 0
      })
    },
    confirm (question = 'Confirm this?', cbOK = () => {}, cbCancel = () => {}, title = 'Warning', type = 'warning') {
      this.$confirm(question, title, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type
      }).then(() => {
        cbOK()
      }).catch(() => {
        cbCancel()
      })
    },
    getTasks (boardId) {
      return new Promise((resolve, reject) => {
        this.$db.tasks.find({boardId}, (err, tasks) => {
          if (err) reject(err)
          resolve(tasks)
        })
      })
    },
    getUser () {
      return new Promise((resolve, reject) => {
        this.$storage.get('auth', (err, user) => {
          if (err) reject(err)
          resolve(user)
        })
      })
    },
    async fetchBoards (userId) {
      return new Promise((resolve, reject) => {
        this.$db.boards.find({userId: userId}).sort({createdAt: -1}).exec((err, boards) => {
          if (err) reject(err)
          resolve(boards)
        })
      })
    },
    async getBoards () {
      let user = await this.getUser()
      let boards = await this.fetchBoards(user._id)
      return boards
    },
    getUsers () {
      return new Promise((resolve, reject) => {
        this.$db.users.find({}, (err, users) => {
          if (err) reject(err)
          resolve(users)
        })
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  template: '<App/>',
  mounted () {
  }
}).$mount('#app')
