<template>
    <div class="ui grid" id="login_main">
        <div class="three wide column"></div>
        <div class="ten wide column">
            <form class="ui form raised segment">
                <div class="field">
                    <form-message :options="error"></form-message>
                </div>
                <div class="field">
                    <label>Full name <i class="user icon"></i></label>
                    <input ref="name" v-model="data.name" type="text" name="name" placeholder="Full Name">
                </div>
                <div class="field">
                    <label>E-mail <i class="envelope icon"></i></label>
                    <input v-model="data.email" type="text" name="email" placeholder="Email">
                </div>
                <div class="field">
                    <label>Username (unique) <i class="user secret icon"></i></label>
                    <input v-model="data.username" type="text" name="username" placeholder="Username (unique)">
                </div>
                <div class="field">
                    <label>Password <i class="lock icon"></i></label>
                    <input v-model="data.password" type="password" name="password" placeholder="Password">
                </div>
                <br>
                <button class="ui button positive fluid" @click.prevent="validate()">Register</button>
            </form>
        </div>
    </div>
</template>
<script>
  import FormMessage from '../Library/FormMessage'

  export default {
    components: {FormMessage},
    data () {
      return {
        users: [],
        data: {
          name: '',
          username: '',
          email: '',
          password: ''
        },
        error: {
          status: false,
          message: '',
          type: 'error'
        },
        broker: require('password-hash')
      }
    },
    methods: {
      validate () {
        let data = this.data
        let empty = Object.keys(data).map(key => ({key, value: data[key]}))
          .find(item => item.value === '')
        if (empty) {
          this.errorStatus(true, `Invalid value for ${empty.key} field`)
          return false
        }
        return this.register()
      },
      register () {
        this.errorStatus(false)
        this.$db.users.findOne({username: this.data.username}, (err, user) => {
          if (err) throw err
          if (user && user._id) {
            this.errorStatus(true, `Username <${user.username}> already taken.`)
          } else {
            this.$db.users.insert({
              name: this.data.name,
              email: this.data.email,
              username: this.data.username,
              password: this.broker.generate(this.data.password)
            }, (err, user) => {
              if (err) {
                throw err
              }
              this.$router.push({name: 'login-page', query: {username: user.username}})
            })
          }
          return false
        })
      },
      errorStatus (status, message = '') {
        this.error = {status, message, type: 'error'}
      }
    },
    mounted () {
      this.$refs.name.focus()
      this.getUsers()
        .then(users => {
          this.users = users
        })
        .catch(err => console.log(err))
    }
  }
</script>
<style scoped>
    /*Scoped style*/
    #login_main {
        padding-top: 50px;
    }
</style>