<template>
    <div>
        <sui-modal v-model="open" :closable="false">
            <sui-modal-header>Select a Photo
                <div class="ui action input focus mini">
                    <input autofocus type="text" class="small" placeholder="Search... [hit enter]" v-model="search"
                           @keyup.enter="searchUnsplash">
                </div>
            </sui-modal-header>
            <sui-modal-content scrolling>
                <sui-modal-description>
                    <div class="ui grid container">
                        <div class="four wide column" v-for="image in images" :key="image.id">
                            <div class="ui card">
                                <div class="image">
                                    <img style="width: 174px; height: 119px;" :src="image.urls.regular">
                                </div>
                                <div class="extra content">
                                    <button @click.prevent="useImage(image.id)"
                                            class="ui button icon right floated mini fluid">Use <i
                                            class="icon photo"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
  import Unsplash, { toJson } from 'unsplash-js'
  const unsplash = new Unsplash({
    applicationId: '1d402db1b9db23c61e8e7bffaec9c9b7c07dd53c85e06f8a5e600f918a088150',
    secret: 'b2a42f794c553dabaab5984836fecbb68c8bb0419f2fd206e08de9345b53e0de',
    callbackUrl: '{CALLBACK_URL}'
  })
  export default {
    name: 'board-background',
    props: ['open'],
    data () {
      return {
        search: 'code',
        images: []
      }
    },
    computed: {},
    methods: {
      toggle () {
        this.$emit('close')
      },
      searchUnsplash () {
        unsplash.search.photos(this.search, 1)
          .then(toJson)
          .then((data) => {
            this.images = (data.results)
          })
      },
      useImage (id) {
        console.log(id)
        this.$http.get(`https://api.unsplash.com/photos/${id}/download?client_id=1d402db1b9db23c61e8e7bffaec9c9b7c07dd53c85e06f8a5e600f918a088150`)
          .then(res => {
            console.log(res)
            // let fs = require('fs')
            let path = require('path')
            this.fetchRemotely(res.data.url, path.join(__static, 'images/test.jpg'), (r) => {
              console.log('done')
              console.log(r)
            })
          })
      },
      fetchRemotely (uri, filename, callback) {
        let request = require('request')
        let fs = require('fs')
        let Stream = require('stream').Transform
        request.head(uri, function (err, response) {
          if (err) throw err
          var data = new Stream()

          response.on('data', function (chunk) {
            data.push(chunk)
          })

          response.on('end', function () {
            fs.writeFileSync(filename, data.read())
          })
        }).end()
      }
    },
    mounted () {
    }
  }
</script>
<style scoped>

</style>