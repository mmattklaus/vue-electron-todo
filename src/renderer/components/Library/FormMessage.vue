<template>
    <div class="ui message floating visible" :class="options.type"
         v-show="options.status">
        <div class="header align center">
            {{ options.message }}
        </div>
    </div>
</template>
<script>
  export default {
    name: 'form-message',
    props: {
      options: {
        type: Object,
        default: {status: false, type: 'warning', message: ''}
      }
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
    },
    mounted () {
    }
  }
</script>
<style scoped>

</style>