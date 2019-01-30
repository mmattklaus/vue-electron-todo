<template>
    <div>
        <sui-modal v-model="open" size="small" :closable="false">
            <sui-modal-header class="center">Crop photo</sui-modal-header>
            <sui-modal-content>
                <sui-modal-description>
                    <div class="ui grid">
                        <div class="ten wide column">
                            <vue-croppie
                                    :viewport="{ width: dimension.width, height: dimension.height, type: 'square' }"
                                    :enableOrientation="true"
                                    :enableResize="false"
                                    ref="croppable"></vue-croppie>
                        </div>
                        <div class="six wide column">
                            <div class="row">
                                <button @click.prevent="close" class="ui button fluid red">
                                    Cancel <i class="close icon"></i>
                                </button>
                                <br>
                                <div class="ui icon buttons fluid">
                                    <button @click.prevent="rotate(-90)" class="ui button teal">
                                        <i class="undo icon"></i>
                                    </button>
                                    <button @click.prevent="rotate(90)" class="ui button teal">
                                        <i class="redo icon"></i>
                                    </button>
                                </div>
                                <br>
                                <br>
                                <button @click.prevent="crop" class="ui blue button  fluid">
                                    <i class="crop icon"></i>
                                    Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </sui-modal-description>
            </sui-modal-content>
        </sui-modal>
    </div>
</template>
<script>
  export default {
    name: 'croppie',
    props: {
      url: {
        required: true,
        type: String
      },
      dimension: {
        type: Object,
        required: true,
        default: {
          width: 344, height: 60
        }
      }
    },
    data () {
      return {
        open: true
      }
    },
    computed: {},
    methods: {
      crop () {
        let options = {
          format: 'png',
          circle: false,
          type: 'base64'
        }
        this.$refs.croppable.result(options, (output) => {
          this.$emit('cropped', output)
        })
      },
      rotate (rotationAngle) {
        this.$refs.croppable.rotate(rotationAngle)
      },
      close () {
        this.$emit('close')
      }
    },
    mounted () {
      this.$refs.croppable.bind({
        url: this.url
      })
    }
  }
</script>
<style scoped>

</style>