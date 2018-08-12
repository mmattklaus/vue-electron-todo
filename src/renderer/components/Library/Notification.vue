<template>
    <div class="ui bottom attached warning message" v-show="option.status" :class="option.type">
        <i class="icon help"></i>
        {{ option.message }}
    </div>
</template>
<script>
  export default {
    name: 'notification',
    props: ['option'],
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {
      console.log('notification-library component mounted')
    }
  }
</script>
<style scoped>

</style>