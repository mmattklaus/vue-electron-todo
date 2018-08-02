<template>
    <div class="ui grid" id="login_main">
        <div class="three wide column"></div>
        <div class="ten wide column">
            <form class="ui form">
                <div class="field" :class="{error: error}">
                    <label>Username <i class="envelope icon"></i></label>
                    <input @change="error = false" v-model="username" type="text" ref="username" placeholder="First Name">
                </div>
                <div class="field">
                    <label>Password <i class="lock icon"></i></label>
                    <input @change="error = false" v-model="password" type="password" name="last-name" placeholder="Last Name">
                </div>
                <br>
                <div class="inline field">
                    <sui-checkbox ref="remember" label="Remember my credentials" tabindex="0" class="hidden" toggle v-model="remember"></sui-checkbox>
                </div>
                <br>
                <button class="ui button violet fluid" @click.prevent="login">Login</button>
            </form>
        </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        username: null,
        password: null,
        remember: false,
        broker: require('password-hash'),
        users: [],
        error: false,
        loading: false
      }
    },
    methods: {
      login () {
        let user = this.users.find(u => u.username === this.username)
        if (user) {
          user = this.users.find(u => this.broker.verify(this.password, u.password))
          if (user) {
            this.$storage.set('auth', user, (err) => {
              if (err) throw err
              this.$emit('exit')
              this.$router.push({name: 'page-todos'})
            })
          } else {
            this.showErrorResponse()
          }
        } else {
          this.showErrorResponse()
        }
      },
      showErrorResponse () {
        this.error = true
      }
    },
    mounted () {
      this.$refs.username.focus()
      this.$storage.get('users', (err, users) => {
        if (err) throw err
        this.users = users
      })
    }
  }
</script>
<style scoped>
    /*Scoped style*/
    #login_main {
        padding-top: 50px;
    }
</style>