<template>
    <div>
        <sui-modal v-model="open" :closable="false">
            <sui-modal-header>Select a Photo</sui-modal-header>
            <sui-modal-content>
                <sui-modal-description>
                    <sui-header>Default Profile Image</sui-header>
                    <p>We've found the following gravatar image associated with your e-mail address.</p>
                    <p>Is it okay to use this photo?</p>
                </sui-modal-description>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button positive @click.native="toggle()">
                    OK
                </sui-button>
            </sui-modal-actions>
        </sui-modal>
    </div>
</template>
<script>
  export default {
    name: 'board-background',
    props: ['open'],
    data () {
      return {
      }
    },
    computed: {},
    methods: {
      toggle () {
        this.$emit('close')
      }
    },
    mounted () {
      console.log('board-background component mounted')
    }
  }
</script>
<style scoped>

</style>