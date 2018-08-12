<template>
    <span class="required">*</span>
</template>
<script>
  export default {
    name: 'required',
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {
      console.log('required-library component mounted')
    }
  }
</script>
<style scoped>
    .required {
        color: #ef1900;
    }
</style>