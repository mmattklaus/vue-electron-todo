<template>
    <div class="ui grid" id="login_main">
        <div class="three wide column"></div>
        <div class="ten wide column">
            <form class="ui form">
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
                <button class="ui button positive fluid" @click.prevent="register">Register</button>
            </form>
        </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        data: {
          name: '',
          username: '',
          email: '',
          password: ''
        },
        broker: require('password-hash')
      }
    },
    methods: {
      register () {
        this.$storage.get('users', (err, users) => {
          if (err) throw err
          if (users[0] === undefined) {
            users = []
          }
          users.push({
            name: this.data.name,
            email: this.data.email,
            username: this.data.username,
            password: this.broker.generate(this.data.password)
          })
          this.$storage.set('users', users, (err) => {
            if (err) throw err
            this.$router.push({name: 'login-page'})
          })
        })
      }
    },
    mounted () {
      this.$refs.name.focus()
    }
  }
</script>
<style scoped>
    /*Scoped style*/
    #login_main {
        padding-top: 50px;
    }
</style>