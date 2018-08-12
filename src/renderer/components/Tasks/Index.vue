<template>
    <div class="ui two column grid">
        <div class="twelve wide column">
            <transition-group name="fadeDownBig" tag="div" class="ui two column grid">
                <div class=" column" v-for="task in tasks" :key="task._id">
                    <div class="ui segments">
                        <div class="ui teal tall stacked segment task-title">
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
                              @close="toggleBackground()"></board-background>
            <div class="row">
                <router-link :to="{name: 'page-create-event', params: {board: board._id}}"
                             class="ui button positive icon">Create <i
                        class="icon plus"></i></router-link>
                <button @click="toggleBackground()" class="ui button icon black"><i class="icon images"></i></button>
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
                        <input type="text" placeholder="Search todos...">
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
          {name: 'Last Month', slug: 'month', style: 'primary', count: 0}
        ],
        sorted: [],
        sort: 'today',
        board: {},
        backgroundActive: false,
        counting: true
      }
    },
    computed: {},
    methods: {
      toggleBackground () {
        this.backgroundActive = !this.backgroundActive
      },
      taskFilter (style) {
        let moment = this.$moment
        let tasks = []
        switch (style) {
          case 'today':
            tasks = this.tasks.filter(task => {
              let start = moment(task.start, 'x')
              let end = moment(task.start, 'x')
              console.log(start.format('Do MMM YYYY'), end.format('Do MMM YYYY'))
              return (moment().isSameOrAfter(start, 'day') && moment().isSameOrBefore(end, 'day'))
            })
            break
          case 'tomorrow':
            break
        }
        console.log('tasks', tasks)
        return tasks
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
        })
      },
      removeTask (_id) {
        this.$db.tasks.remove({_id}, (err, numRows) => {
          if (err) this.err(err)
          this.success(`${numRows} task removed...`)
          let index = this.tasks.indexOf(this.tasks.find(t => t._id === _id))
          this.tasks.splice(index, 1)
        })
      }
    },
    mounted () {
      let _id = this.$route.params.id
      if (_id) {
        this.getTasks(_id)
          .then(tasks => {
            this.tasks = tasks
            this.taskFilter(this.sort)
          })
        this.$db.boards.findOne({_id}, (err, board) => {
          if (err) throw err
          this.board = board
        })
      }
    }
  }
</script>
<style scoped>
    .task-title {
        font-family: 'Modern Antiqua', cursive;
        font-weight: bold;
        font-size: 15px !important;
    }

    .ui.action.segment {
        padding: .4em 2em;
    }

    .board-cover {
        position: relative;
        width: 100vw;
        height: 50px;

    }
</style>