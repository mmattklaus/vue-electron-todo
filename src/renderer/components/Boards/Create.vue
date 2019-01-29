<template>
    <div>
        <croppie :url="croppie" :dimension="{ width: 344, height: 60, circle: false}" v-if="croppie"
                 @close="closeCroppie" @cropped="cropped"></croppie>
        <div class="ui two column centered grid">
            <div class="column">
                <form class="ui form raised segment">
                    <form-message :options="error"></form-message>
                    <div class="field">
                        <label>Name
                            <required></required>
                        </label>
                        <input v-model="data.name" type="text" name="name" placeholder="board name...">
                    </div>
                    <div class="field">
                        <label>Description
                            <required></required>
                        </label>
                        <textarea placeholder="board description..." v-model="data.description" rows="2"></textarea>
                    </div>
                    <div class="field">
                        <label>Background
                            <required></required>
                        </label>
                        <label class="bg-drop-zone" @click.prevent="">
                            <i class="icon plus" v-if="!data.cover"></i>
                            <img :src="data.cover" v-if="data.cover" @click="browseImage()" alt="Background">
                        </label>
                        <div>
                            <input type="file" style="display: none;" ref="browseImage" @change="loadBrowsedImage">
                            <button class="ui button icon mini" @click="browseImage" type="button">Browse <i
                                    class="icon computer"></i></button>
                            <button class="ui button right floated icon mini" type="button">Online <i
                                    class="icon globe"></i></button>
                        </div>
                    </div>
                    <br>
                    <button @click.prevent="validateBoard" class="ui button right floated violet" type="submit">
                        Save Board
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
  import Required from '../Library/Required'
  import Croppie from '../Library/Croppie'
  import FormMessage from '../Library/FormMessage'
  export default {
    components: {
      FormMessage,
      Croppie,
      Required
    },
    name: 'create-board',
    data () {
      return {
        data: {
          name: '',
          description: '',
          cover: ''
        },
        original: '',
        croppie: '',
        user: {},
        error: {
          status: false,
          message: '',
          type: 'warning'
        }
      }
    },
    computed: {},
    methods: {
      saveBoard () {
        this.uploadFile()
          .then(path => {
            let data = this.data
            this.$db.boards.insert({
              userId: this.user._id,
              name: data.name,
              description: data.description,
              cover: path
            }, (err, board) => {
              if (err) {
                this.err(err)
                throw err
              }
              this.success(`Board [${board.name}] created`)
              this.$router.push({name: 'page-boards', query: {board: board._id}})
            })
          })
          .catch(err => {
            this.err(err)
          })
      },
      validateBoard () {
        let empty = Object.keys(this.data).map(key => ({key, value: this.data[key]}))
          .find((field) => field.value === '')
        if (empty) {
          this.errorStatus(true, `${empty.key.toUpperCase()} field is required`)
          return false
        }
        this.saveBoard()
      },
      browseImage () {
        if (this.original) {
          this.croppie = this.original
        } else this.$refs.browseImage.click()
      },
      loadBrowsedImage (evt) {
        let input = evt.target
        if (input.files && input.files[0]) {
          let reader = new FileReader()
          reader.onload = (e) => {
            this.croppie = this.original = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      uploadFile () {
        return new Promise((resolve, reject) => {
          let shell = require('shelljs')
          let fs = require('fs')
          let path = require('path')
          let data = this.data.cover.replace(/^data:image\/png;base64,/, '')
          let dirname = `boards/${this.user._id}`
          shell.mkdir('-p', path.join(__static, dirname))
          let filename = `${(new Date()).getTime()}.png`
          fs.writeFile(path.join(__static, dirname, filename), data, 'base64', (err) => {
            if (err) throw reject(err)
            resolve(path.join(dirname, filename))
          })
        })
      },
      closeCroppie () {
        this.croppie = ''
        this.original = ''
      },
      cropped (url) {
        this.data.cover = url
        this.closeCroppie()
      },
      errorStatus (status, message = '') {
        this.error = {status, message, type: 'warning'}
      }
    },
    mounted () {
      this.getUser()
        .then((user) => {
          this.user = user
        })
    }
  }
</script>
<style scoped>
    .bg-drop-zone {
        width: 100%;
        border: 2px dashed #e5ebde;
        height: 60px;
        content: normal;
        text-align: center;
        cursor: pointer;
    }

    .bg-drop-zone:hover {
    }

    .bg-drop-zone > i {
        padding-top: 10px;
        color: #e5ebde;
    }
</style>