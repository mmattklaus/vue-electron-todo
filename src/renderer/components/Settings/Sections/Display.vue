<template>
    <div>
        <color-picker v-model="color"></color-picker>
    </div>
</template>
<script>
  export default {
    name: 'settings-display-section',
    data () {
      return {
        color: ''
      }
    },
    computed: {},
    methods: {},
    mounted () {
      console.log('settings-display-section component mounted')
    }
  }
</script>
<style scoped>

</style>