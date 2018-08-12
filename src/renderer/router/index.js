import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
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
      path: '/boards',
      name: 'page-boards',
      component: require('@/components/Boards/Boards').default,
      meta: {
        forAuth: true,
        title: 'Boards'
      }
    },
    {
      path: 'create',
      name: 'create-board',
      component: require('@/components/Boards/Create').default,
      meta: {
        forAuth: true,
        title: 'Create Boards'
      }
    },
    {
      path: 'boards/:id/events',
      name: 'page-events',
      component: require('@/components/Tasks/Index').default,
      meta: {
        forAuth: true,
        title: 'Events'
      }
    },
    {
      path: 'boards/:id/events/create',
      name: 'page-create-event',
      component: require('@/components/Tasks/Create').default,
      meta: {
        forAuth: true,
        title: 'Create Event'
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
      path: '*',
      redirect: '/'
    }
  ]
})
