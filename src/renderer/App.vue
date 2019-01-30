<template>
    <el-container>
        <div id="app" class="app" :style="style">
            <div class="ui mini top fixed borderless menu">
                <div class="ui container">
                    <router-link :to="{name: 'landing-page'}" class="item logo-container">
                        <img class="logo" src="~@/assets/logo.jpeg"> &nbsp;
                    </router-link>
                    <!--<div class="">-->
                    <router-link :to="{name: 'page-boards'}" v-show="loggedIn" class="item">
                        Boards
                    </router-link>
                    <!--</div>-->
                    <!--<div class="">-->
                    <router-link :to="{name: 'create-board'}" v-show="loggedIn" class="item">
                        Board <i class="icon plus"></i>
                    </router-link>
                    <!--</div>-->
                    <div class="right menu">
                        <!--<div class="item">-->
                        <!--<div class="ui icon input">-->
                        <!--<input type="text" placeholder="Search...">-->
                        <!--<i class="search link icon"></i>-->
                        <!--</div>-->
                        <!--</div>-->
                        <!--<div class="ui">-->
                        <router-link v-show="!loggedIn" :to="{name: 'register-page'}" class="item">Sign up</router-link>
                        <!--</div>-->
                        <!--<div class="item">-->
                        <router-link v-show="!loggedIn" :to="{name: 'login-page'}" class="item">Log-in</router-link>
                        <!--</div>-->
                        <!--<div class="item">-->
                        <router-link v-show="loggedIn" :to="{name: 'page-settings'}" class="item">Setting</router-link>
                        <!--</div>-->
                        <!--<div class="item">-->
                        <div v-show="loggedIn" @click="logout" :to="{name: 'login-page'}" class="item">Logout</div>
                        <!--</div>-->
                        <div v-show="loggedIn" class="item">
                            <el-dropdown size="medium">
                                <span class="el-dropdown-link primary-color">
                                    @{{ auth.username }} <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <!--<el-dropdown-menu slot="dropdown" :span="53">
                                    <el-dropdown-item>Setting <i class="fa fa-user"></i></el-dropdown-item>
                                    <el-dropdown-item divided><i class="fa fa-user"></i>Logout</el-dropdown-item>
                                </el-dropdown-menu>-->
                            </el-dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui main container" style="padding-top: 90px!important;">
                <div class="ui grid">
                    <!--<div class="row">
                        <div class="ui buttons left floated">
                            <button class="ui button icon" @click.prevent="goBack()"><i class="icon angle left"></i></button>
                            <div class="or" data-text=""></div>
                            <button class="ui positive button icon" @click.prevent="goForward()"><i class="icon angle right"></i></button>
                        </div>
                    </div>-->
                    <div class="sixteen wide column">
                        <el-main >
                            <transition name="bounce" enter-active-class="bounceInLeft"
                                        leave-active-class="bounceOutRight" :duration="{ enter: 2000, leave: 0 }">
                                <router-view @authenticated="changeLoginState"></router-view>
                            </transition>
                        </el-main>

                    </div>
                </div>
            </div>
        </div>
    </el-container>
</template>

<script>
  export default {
    name: 'vue-todo-electron',
    data () {
      return {
        transition: '',
        loggedIn: false,
        auth: {},
        style: {
          'background-image': `url(/static/images/backgrounds/default.jpg)`
        }
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
          this.$router.push({name: 'login-page'})
        })
      },
      goBack () {
        console.log(window.history.go)
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      },
      goForward () {
        this.$router.go(1)
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
      this.getUser()
        .then(auth => {
          this.auth = auth
          this.loggedIn = !!auth.username
        })
    }
  }
</script>

<style>
    .logo {
        width: 120px;
        padding-right: 12px;
    }
    .app {
        background-size: cover;
        overflow: auto !important;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        position: absolute;
    }
    .el-main {
        padding: 0;
        overflow: visible;
    }

    .ui.cards {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin: 0!important;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .router-link-active {
        font-size: 12px;
        color:  #ef7100!important;
    }

    .primary-color {
        color: #ef7100!important;
    }
    
    .centered {
        text-align: center;
    }
</style>
