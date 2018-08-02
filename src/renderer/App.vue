<template>
    <div id="app">
        <div class="ui large top fixed borderless menu">
            <div class="ui container">
                <router-link :to="{name: 'landing-page'}" class="item">
                    <img class="logo" src="~@/assets/logo.png"> &nbsp;
                </router-link>
                <div class="item">
                    <router-link tag="div" :to="{name: 'page-todos'}" v-show="loggedIn" class="ui button" tabindex="0">
                        Todo Items
                    </router-link>
                </div>
                <div class="right menu">
                    <!--<div class="item">
                        <div class="ui icon input">
                            <input type="text" placeholder="Search...">
                            <i class="search link icon"></i>
                        </div>
                    </div>-->
                    <div class="ui item" v-show="!loggedIn">
                        <router-link :to="{name: 'register-page'}" class="ui primary button">Sign up</router-link>
                    </div>
                    <div class="item" v-show="!loggedIn">
                        <router-link :to="{name: 'login-page'}" class="ui button">Log-in</router-link>
                    </div>
                    <div class="item" v-show="loggedIn">
                        <button @click="logout" :to="{name: 'login-page'}" class="ui button orange">Logout</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui main container" style="padding-top: 90px!important;">
            <div class="ui grid">
                <div class="sixteen wide column">
                    <transition name="bounce" enter-active-class="bounceInLeft"
                                leave-active-class="bounceOutRight" :duration="{ enter: 800, leave: 200 }">
                        <router-view @exit="changeLoginState"></router-view>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'vue-todo-electron',
    data () {
      return {
        transition: '',
        loggedIn: false
      }
    },
    methods: {
      changeLoginState () {
        this.loggedIn = true
      },
      logout () {
        this.$storage.remove('auth', (err) => {
          if (err) throw err
          this.loggedIn = false
          this.$router.push({name: 'landing-page'})
        })
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transition = toDepth < fromDepth ? 'bounceOutRight' : 'bounceInLeft'
      }
    },
    mounted () {
      this.$storage.get('auth', (err, auth) => {
        if (err) throw err
        this.loggedIn = !!auth.username
      })
    }
  }
</script>

<style>
    /* CSS */
</style>
