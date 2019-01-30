<template>
    <div class="">
        <el-row style="text-align: right;">
            <el-col :span="23">
                <el-dropdown size="medium" split-button type="primary" @click="reorderSort" @command="sortBoards">
                    <i :class="sortOrderIcon"></i> {{ sortTypes.find(type => type.value === this.sortType).text }}
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="opt in sortTypes" :command="opt.value">
                            <i :class="opt.icon" class="icon"></i> {{ opt.text }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <transition-group name="flip-list" class="ui link cards">
            <div :key="board._id" class="ui raised card board-img-blur" v-for="board in sortedBoards"
                 :class="{'pulseit': flash === board._id}">
                <div class="image">
                    <img :src="`static/${board.cover}`">
                </div>
                <div class="content">
                    <router-link :to="{name: 'page-events', params: {id: board._id}}" class="header">{{ board.name }}
                        <span class="primary-color">{ {{ board.completedCount }} / {{ board.taskCount }} }</span>
                    </router-link>
                    <div class="meta">
                        <span class="date">{{ $moment(board.createdAt).format('ddd Do MMM, YYYY') }}</span>
                    </div>
                </div>
                <div class="extra content">
                    <router-link :to="{name: 'page-events', params: {id: board._id}}"
                                 class="ui button right floated primary">Explore
                    </router-link>
                    <button @click.prevent="deleteBoard(board._id)" class="ui button icon orange left floated"><i
                            class="icon trash"></i></button>
                </div>
            </div>
        </transition-group>
        <transition tag="div" name="animated tada" class="no-boards" v-if="!boards.length">
            <div>
                <i class="icon recycle"></i>No boards available
                <router-link :to="{name: 'create-board'}" class="ui primary mini animated button" tabindex="0">
                    <div class="visible content">new board</div>
                    <div class="hidden content">
                        <i class="right plus icon"></i>
                    </div>
                </router-link>
            </div>
        </transition>
    </div>
</template>
<script>
  export default {
    name: 'boards-components',
    data () {
      return {
        test: [],
        sortOrder: 0,
        sortType: 1,
        defaultSort: {
          type: 1,
          order: 0
        },
        sortTypes: [{
          text: 'Created',
          icon: 'calendar',
          slug: 'date',
          value: 1
        }, {
          text: 'Completed',
          icon: 'calendar check',
          slug: 'done',
          value: 2
        }, {
          text: 'Undone',
          icon: 'calendar minus',
          slug: 'undone',
          value: 3
        }],
        boards: [],
        sortedBoards: [],
        flash: ''
      }
    },
    watch: {
      sortOrder (current, previous) {
      }
    },
    computed: {
      sortOrderIcon () {
        return `sort amount ${this.sortOrder ? 'up' : 'down'} icon`
      }
    },
    methods: {
      sortBoards (type) {
        let boards = this.boards
        switch (type) {
          case 2:
            boards.sort((a, b) => {
              if (a.completedCount > b.completedCount) {
                return -1
              } else if (a.completedCount < b.completedCount) {
                return 1
              }
              return 0
            })
            break
          case 3:
            boards.sort((a, b) => {
              if (a.undoneCount > b.undoneCount) {
                return -1
              } else if (a.undoneCount < b.undoneCount) {
                return 1
              }
              return 0
            })
            break
        }
        if (this.sortOrder) {
          boards.reverse()
        }
        this.sortedBoards = boards
        this.sortType = type
      },
      reorderSort () {
        this.sortOrder = !this.sortOrder
        this.sortedBoards.reverse()
      },
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
          this.boards = boards.map(board => {
            board.taskCount = 0
            board.completedCount = 0
            board.undoneCount = 0
            return board
          })
          this.boards.forEach((board) => {
            this.$db.tasks.find({boardId: board._id}, (err, tasks) => {
              if (err) throw err
              board.taskCount = tasks.length
              board.completedCount = tasks.filter(task => task.done).length
              board.undoneCount = tasks.filter(task => !task.done).length
            })
          })
          this.sortedBoards = this.boards
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

    .flip-list-move {
        transition: transform 3s;
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