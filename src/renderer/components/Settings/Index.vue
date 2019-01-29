<template>
    <div>
        <div class="ui grid">
            <div class="five wide column">
                <div class="ui vertical pointing menu">
                    <router-link :to="{name: 'settings-background'}" class="item">
                        Background
                    </router-link>
                    <router-link :to="{name: 'settings-display'}" class="item">
                        Display
                    </router-link>
                </div>
            </div>
            <div class="eleven wide column">
                <div class="section" style="overflow-y: auto!important; height: 600px; overflow-x: hidden">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'page-settings',
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {
    }
  }
</script>
<style>
    .router-link-active {
        border-color: #1B1C1D!important;
        -webkit-box-shadow: none!important;
        box-shadow: none!important;
        font-weight: bold!important;
        color: rgba(0, 0, 0, 0.95)!important;
        background: transparent!important;
    }
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 100px;
    }
</style>