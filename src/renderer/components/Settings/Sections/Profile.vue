<template>
    <el-row>
        <div class="ui card fluid raised">
            <div class="content">
                <form class="ui form">
                    <div class="field">
                        <label>First Name</label>
                        <input autofocus type="text" v-model="edit.first_name" name="first-name" placeholder="First Name">
                    </div>
                    <div class="field">
                        <label>Last Name</label>
                        <input type="text" v-model="edit.last_name" placeholder="Last Name">
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <input type="email" v-model="edit.email" placeholder="Email">
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input type="password" v-model="edit.password" placeholder="Password">
                        <span class="help-block">Allow empty to maintain password</span>
                    </div>
                    <div class="field">
                        <label>Password Confirmation</label>
                        <input type="password" v-model="edit.password_confirmation" placeholder="Confirm password">
                    </div>
                    <button :disabled="ignoreSubmit" class="ui button" @click.prevent="updateProfile">Update</button>
                </form>
            </div>
        </div>

    </el-row>
</template>

<script>
  export default {
    name: 'Profile',
    data () {
      return {
        user: {},
        edit: {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password_confirmation: ''
        },
        broker: require('password-hash')
      }
    },
    computed: {
      ignoreSubmit () {
        return (this.edit.password !== this.edit.password_confirmation || this.edit.first_name === '' || this.edit.email === '')
      }
    },
    methods: {
      updateProfile () {
        let obj = {
          name: (this.edit.first_name ? this.edit.first_name : this.user.name) + this.edit.last_name,
          email: this.edit.email ? this.edit.email : this.user.email,
          password: this.edit.password ? this.broker.generate(this.edit.password) : this.user.password
        }
        this.$db.users.update({_id: this.user._id}, {$set: obj}, (err, count) => {
          if (err) throw err
          this.success('Profile successfully updated!')
        })
      }
    },
    mounted () {
      this.getUser().then(auth => {
        this.edit.first_name = auth.name
        this.edit.email = auth.email
        this.user = auth
      })
    }
  }
</script>

<style scoped>
    input {
        color: #f2711c!important;
        font-size: 18px!important;
    }
    .help-block {
        color: #6a6a6a;
    }
</style>