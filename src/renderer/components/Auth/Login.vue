<template>
    <div class="ui grid" id="login_main">
        <div class="three wide column"></div>
        <div class="ten wide column">
            <form class="ui form">
                <form-message :options="{type: 'error', status: error, message: 'Invalid login credentials'}"></form-message>
                <div class="field">
                    <label>Username
                        <required></required>
                    </label>
                    <input :class="{invalid: error}" @keyup="error = false" v-model="username" type="text" ref="username" placeholder="username">
                </div>
                <div class="field">
                    <label>Password
                        <required></required>
                    </label>
                    <input v-model="password" type="password" ref="password"
                           placeholder="password">
                </div>
                <br>
                <div class="inline field">
                    <sui-checkbox ref="remember" label="Remember my credentials" tabindex="0" class="hidden" toggle
                                  v-model="remember"></sui-checkbox>
                </div>
                <br>
                <button class="ui button violet fluid" @click.prevent="login">Login</button>
            </form>
        </div>
    </div>
</template>
<script>
  import Required from '../Library/Required'
  import FormMessage from '../Library/FormMessage'
  export default {
    components: {
      FormMessage,
      Required},
    data () {
      return {
        username: null,
        password: null,
        remember: false,
        broker: require('password-hash'),
        error: false,
        loading: false
      }
    },
    methods: {
      login () {
        this.$db.users.findOne({username: this.username}, (err, user) => {
          if (err) throw err
          if (user && user._id && this.broker.verify(this.password, user.password)) {
            this.$storage.set('auth', user, (err) => {
              if (err) throw err
              this.$emit('authenticated')
              this.$router.push({name: 'page-boards'})
            })
          } else {
            this.showErrorResponse()
          }
        })
      },
      showErrorResponse () {
        this.error = true
        this.$refs.password.focus()
      }
    },
    mounted () {
      this.username = this.$route.query.username || ''
      this.username ? this.$refs.password.focus() : this.$refs.username.focus()
    }
  }
</script>
<style scoped>
    /*Scoped style*/
    #login_main {
        padding-top: 50px;
    }
    input.invalid {
        border-color: #e97a26!important;
    }
</style>