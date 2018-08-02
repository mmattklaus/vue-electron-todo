import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/Home').default,
      meta: {
        forAuth: false,
        title: 'Home'
      }
    },
    {
      path: 'login',
      name: 'login-page',
      component: require('@/components/Auth/Login').default,
      meta: {
        forAuth: false,
        title: 'Login'
      }
    },
    {
      path: 'register',
      name: 'register-page',
      component: require('@/components/Auth/Register').default,
      meta: {
        forAuth: false,
        title: 'Register'
      }
    },
    {
      path: 'todos',
      name: 'page-todos',
      component: require('@/components/Todos/Index').default,
      meta: {
        forAuth: true,
        title: 'Todos'
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
