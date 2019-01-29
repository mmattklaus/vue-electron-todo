<template>
    <!--<div class="container">-->
        <!--<div class="ui small images">-->
        <!--<img v-for="image in images" :src="image.url">-->
        <!--</div> -->
        <div class="ui three stackable doubling special cards red">
            <div class="card" v-for="image, i in images">
                <div class="blurring dimmable image">
                    <div class="ui dimmer transition visible active" style="display: flex!important;">
                        <div class="content">
                            <div class="center">
                                <div class="ui inverted button" @click.prevent="changeBackground(i)">Use this</div>
                            </div>
                        </div>
                    </div>
                    <img :src="image.url">
                </div>
            </div>
        </div>
    <!--</div>-->
</template>
<script>
  import fs from 'fs'
  export default {
    name: 'settings-background-section',
    data () {
      return {
        images: [],
        selected: ''
      }
    },
    computed: {},
    methods: {
      activateBackground (index) {
        let bg = this.images[index]
        this.$$('.app').css({'background-image': `url(${bg.url}?${(new Date()).getTime()})`})
      },
      changeBackground (index) {
        let bg = this.images[index]
        let path = require('path')
        let ext = bg.name.split('.')[1]
        let loc = path.join(__static, `images\\backgrounds\\defaults\\${bg.name}`)
        let dest = path.join(__static, `images\\backgrounds\\default.${ext}`)
        fs.createReadStream(loc).pipe(fs.createWriteStream(dest))
        this.activateBackground(index)
      }
    },
    mounted () {
      let fs = require('fs')
      let path = require('path')
      let dir = path.join(__static, 'images/backgrounds/defaults')
      fs.readdir(dir, (err, files) => {
        if (err) throw err
        this.images = files.map(i => ({url: `/static/images/backgrounds/defaults/${i}`, name: i}))
      })
    }
  }
</script>
<style scoped>

</style>