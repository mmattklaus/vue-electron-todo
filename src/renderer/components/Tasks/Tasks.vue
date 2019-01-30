<template>
    <div id="tasksIndex" class="ui two column grid">
        <div class="twelve wide column">
            <div class="no-tasks" v-if="!tasks.length"><i class="icon recycle"></i>No tasks created
                <router-link :to="{name: 'page-create-event', params: {board: board._id}}" class="ui primary mini animated button" tabindex="0">
                    <div class="visible content">new task</div>
                    <div class="hidden content">
                        <i class="right plus icon"></i>
                    </div>
                </router-link>
            </div>
            <transition-group name="fade" tag="div" class="ui two column grid" v-else>
                <div class=" column" v-for="task in sorted" :key="task._id">
                    <div class="ui segments">
                        <div :class="style" class="ui tall stacked segment task-title">
                            <p>{{ task.name }}</p>
                        </div>
                        <div class="ui segment task-desc">
                            <p>{{ task.description }}</p>
                        </div>
                        <div class="ui action segment right aligned">
                            <sui-dropdown class="primary icon mini" icon="cogs" button floating>
                                <sui-dropdown-menu>
                                    <sui-dropdown-item @click.prevent="removeTask(task._id)">
                                        <sui-icon class="red" name="trash"/>
                                        Delete
                                    </sui-dropdown-item>
                                </sui-dropdown-menu>
                            </sui-dropdown>
                            <button class="ui icon mini button brown" data-tooltip="Add users to your feed"
                                    data-variation="basic"><i class="icon history"></i></button>
                            <button @click.prevent="markDone(task._id)" class="ui icon mini button positive"
                                    :class="{disabled: task.done}">
                                <i class="icon check"></i></button>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
        <div class="four wide column">
            <board-background v-if="backgroundActive" :open="backgroundActive"
                              @close="toggleBackground()" @done="handleImageSelection"></board-background>
            <div class="row">
                <router-link :to="{name: 'page-create-event', params: {board: board._id}}"
                             class="ui button positive icon">Create <i
                        class="icon plus"></i></router-link>
                <button @click="toggleBackground()" class="ui button icon black"><i class="icon image"></i></button>
            </div>
            <div class="ui vertical menu">
                <a v-for="nav in navigation" @click.prevent="taskFilter(nav.slug, nav.style)" class="item"
                   :class="[nav.style, {active: nav.slug == sort}]">
                    {{ nav.name }}
                    <div :class="nav.style" class="ui left pointing label">
                        <span v-if="counting" class="ui active inline loader mini"></span>
                        <span v-else>{{ nav.count }}</span>
                    </div>
                </a>
                <div class="item">
                    <div class="ui transparent icon input">
                        <input type="text" placeholder="Search tasks...">
                        <i class="search icon"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import BoardBackground from '../Boards/Modals/Background'
  export default {
    components: {BoardBackground},
    name: 'todos-index',
    data () {
      return {
        tasks: [],
        navigation: [
          {name: 'Today', slug: 'today', style: 'teal', count: 0},
          {name: 'Tomorrow', slug: 'tomorrow', style: 'brown', count: 0},
          {name: 'Undone', slug: 'undone', style: 'purple', count: 0},
          {name: 'Done', slug: 'done', style: 'green', count: 0},
          {name: 'All', slug: '.', style: 'yellow', count: 0},
          {name: 'Trash', slug: '-', style: 'red', count: 0},
          {name: 'Last Month', slug: 'prev_month', style: 'primary', count: 0},
          {name: 'Next Month', slug: 'next_month', style: 'pink', count: 0}
        ],
        sorted: [],
        sort: 'today',
        style: 'teal',
        board: {},
        backgroundActive: false,
        counting: true
      }
    },
    computed: {},
    methods: {
      handleImageSelection (url) {
        console.log(url)
        this.backgroundActive = false
      },
      toggleBackground () {
        this.backgroundActive = !this.backgroundActive
      },
      taskFilter (slug, style, count = false, refresh = false) {
        slug = slug || this.sort
        style = style || this.style
        let moment = this.$moment
        let tasks = []
        switch (slug) {
          case 'today':
            tasks = this.tasks.filter(task => {
              let start = moment(task.start, 'x')
              let end = moment(task.start, 'x')
              return (moment().isSameOrAfter(start, 'day') && moment().isSameOrBefore(end, 'day'))
            })
            break
          case 'tomorrow':
            tasks = this.tasks.filter(task => {
              let start = moment(task.start, 'x')
              return (moment().add(1, 'days').isSame(start, 'day'))
            })
            break
          case 'undone':
            tasks = this.tasks.filter(task => !task.done)
            break
          case 'done':
            tasks = this.tasks.filter(task => task.done)
            break
          case '.': // All
            tasks = this.tasks
            break
          case 'next_month':
            tasks = this.tasks.filter(task => {
              let start = moment(task.start, 'x')
              let end = moment(task.start, 'x')
              return (moment().add(1, 'months').isSame(start, 'month') || moment().add(1, 'months').isSame(end, 'month'))
            })
            break
          case 'prev_month':
            tasks = this.tasks.filter(task => {
              let start = moment(task.start, 'x')
              let end = moment(task.start, 'x')
              return (moment().subtract(1, 'months').isSame(start, 'month') || moment().subtract(1, 'months').isSame(end, 'month'))
            })
            break
        }
        if (!count) {
          this.sort = slug // Set sorting type
          this.style = style // Set segment colour => top
          this.sorted = tasks // Set sorted tasks
        } else if (refresh) {
          this.sort = slug // Set sorting type
          this.style = style // Set segment colour => top
          this.sorted = tasks // Set sorted tasks
        } else return tasks.length
        return false
      },
      markDone (_id) {
        this.$db.tasks.update({_id}, {$set: {done: true}}, {
          multi: false,
          returnUpdatedDocs: true
        }, (err, numRows, task) => {
          if (err) this.err(err)
          this.success(`${task.name} marked as completed. Bravo...`)
          let index = this.tasks.indexOf(this.tasks.find(t => t._id === _id))
          this.tasks.splice(index, 1, task)
          this.taskFilter(this.sort, this.style)
          this.countTasks()
        })
      },
      removeTask (_id) {
        this.$db.tasks.remove({_id}, (err, numRows) => {
          if (err) this.err(err)
          this.success(`${numRows} task removed...`)
          let index = this.tasks.indexOf(this.tasks.find(t => t._id === _id))
          this.tasks.splice(index, 1)
        })
      },
      countTasks () {
        this.navigation.forEach((nav) => {
          nav.count = this.taskFilter(nav.slug, null, true)
        })
        this.counting = false
      },
      setBackground (url) {
        url = url || '/static/images/kristy.png'
        this.$$('#app')
        // .css({backgroundImage: `url(${url})`})
          .addClass('app')
      },
      removeBackground () {
        this.$$('#app')
          .css({backgroundImage: ``})
        // .removeClass('app')
      }
    },
    created () {
      this.setBackground()
    },
    mounted () {
      let _id = this.$route.params.id
      if (_id) {
        this.getTasks(_id)
          .then(tasks => {
            this.tasks = tasks
            this.taskFilter(this.sort)
            this.countTasks()
          })
        this.$db.boards.findOne({_id}, (err, board) => {
          if (err) throw err
          this.board = board
        })
      }
    },
    beforeDestroy () {
      // this.removeBackground()
    }
  }
</script>
<style scoped>
    .no-tasks {
        color: #9c6f04;
        font-weight: bold;
        font-size: 32px;
    }

    .task-title {
        font-family: 'Modern Antiqua', cursive;
        font-weight: bold;
        font-size: 15px !important;
    }

    .ui.action.segment {
        padding: .4em 2em;
    }

    .list-complete-item {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }

    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }

    .list-complete-leave-active {
        position: absolute;
    }
</style>