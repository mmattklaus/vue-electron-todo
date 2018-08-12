<template>
    <div>
        <div class="ui link cards">
            <div class="ui raised card board-img-blur" v-for="board in boards" :class="{'pulseit': flash === board._id}">
                <div class="image">
                    <img :src="`static/${board.cover}`">
                </div>
                <div class="content">
                    <router-link :to="{name: 'page-events', params: {id: board._id}}" class="header">{{ board.name }}</router-link>
                    <div class="meta">
                        <span class="date">{{ $moment(board.createdAt).format('ddd Do MMM, YYYY') }}</span>
                    </div>
                </div>
                <div class="extra content">
                    <router-link :to="{name: 'page-events', params: {id: board._id}}"
                                 class="ui button right floated primary">Explore
                    </router-link>
                    <button @click.prevent="deleteBoard(board._id)" class="ui button icon orange left floated"><i class="icon trash"></i></button>
                </div>
            </div>
            <div class="no-boards" v-if="!boards.length"><i class="icon recycle"></i>No boards available
                <router-link :to="{name: 'create-board'}" class="ui primary mini animated button" tabindex="0">
                    <div class="visible content">new board</div>
                    <div class="hidden content">
                        <i class="right plus icon"></i>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'boards-components',
    data () {
      return {
        boards: [],
        flash: ''
      }
    },
    computed: {},
    methods: {
      flashBoard (_id) {
        this.flash = _id
      },
      deleteBoard (_id) {
        this.confirm('Delete this board', () => {
          this.$db.boards.remove({_id}, {}, (err, numRemoved) => {
            if (err) throw err
            this.success(`${numRemoved} board removed`)
            this.boards.splice(this.boards.indexOf(this.boards.find(i => i._id === _id)), 1)
          })
        }, () => {})
      }
    },
    mounted () {
      this.getBoards()
        .then(boards => {
          this.boards = boards
        })
      setTimeout(() => {
        if (this.$route.query.board) {
          this.flashBoard(this.$route.query.board)
        }
      }, 800)
    }
  }
</script>
<style scoped>
    .no-boards {
        color: #9c6f04;
        font-weight: bold;
        font-size: 32px;
    }

    .board-img-blur > .image {
        opacity: .5;
    }
    .board-img-blur:hover > .image {
        opacity: 10;
    }

    /* Pulse class and keyframe animation */
    .pulseit {
        -webkit-animation: pulse linear .5s .2s;
        animation: pulse linear .5s .2s;
        transition-duration: 3s;
    }

    @-webkit-keyframes pulse {
        0% {
            opacity: .2;
        }
        25% {
            opacity: .6;
        }
        50% {
            opacity: 1;
        }
        75% {
            opacity: .6;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes pulse {
        0% {
            opacity: .2;
        }
        25% {
            opacity: .6;
        }
        50% {
            opacity: 1;
        }
        75% {
            opacity: .6;
        }
        100% {
            opacity: 1;
        }
    }
</style>