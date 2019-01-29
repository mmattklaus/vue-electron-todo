<template>
    <div class="ui grid">
        <div class="eleven wide column">
            <notification :option="error"></notification>
            <form class="ui raised form segment">
                <h1 style="text-align: center; color: #9c6f04">Create new task</h1>
                <hr>
                <div class="two fields">
                    <div class="field">
                        <label>Name
                            <required></required>
                        </label>
                        <input ref="name" v-model="data.name" placeholder="event name..." type="text">
                    </div>
                    <div class="field">
                        <label>Location</label>
                        <input v-model="data.location" placeholder="event location..." type="text">
                    </div>
                </div>
                <div class="field">
                    <label>Description</label>
                    <textarea v-model="data.description" rows="2" placeholder="event details"></textarea>
                </div>
                <div class="field">
                    <label>Start
                        <required></required>
                    </label>
                    <div class="inline fields">
                        <div class="field">
                            <el-date-picker
                                    class="datepicker"
                                    v-model="data.start_date.date"
                                    type="date"
                                    placeholder="start date..."
                                    format="dd/MM/yyyy"
                                    value-format="timestamp"
                                    :picker-options="pickerOptions1">
                            </el-date-picker>
                        </div>
                        <div class="field" v-show="data.allDay !== true">
                            <el-time-picker
                                    class="timepicker"
                                    v-model="data.start_date.time"
                                    format="HH:mm:ss A"
                                    :picker-options="{}"
                                    placeholder="time">
                            </el-time-picker>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label>End
                        <required></required>
                    </label>
                    <div class="inline fields">
                        <div class="field">
                            <el-date-picker
                                    class="datepicker"
                                    v-model="data.end_date.date"
                                    type="date"
                                    placeholder="end date..."
                                    format="dd/MM/yyyy"
                                    value-format="timestamp"
                                    :picker-options="pickerOptions1">
                            </el-date-picker>
                        </div>
                        <div class="field" v-show="data.allDay !== true">
                            <el-time-picker
                                    class="timepicker"
                                    v-model="data.end_date.time"
                                    format="HH:mm:ss A"
                                    :picker-options="{}"
                                    placeholder="time">
                            </el-time-picker>
                        </div>
                    </div>
                </div>
                <div class="ui segment">
                    <div class="field">
                        <sui-checkbox label="All day" toggle v-model="data.allDay"></sui-checkbox>
                    </div>
                </div>
                <br>
                <router-link v-if="boardId" :to="{name: 'page-events', params: {id: boardId}}" tag="div"
                             class="ui purple button icon"><i class="icon arrow left"></i> Tasks
                </router-link>
                <div @click.prevent="validateInput" class="ui submit button right floated purple icon">
                    Register <i class="icon save"></i>
                </div>
            </form>
        </div>
        <div class="three wide column">
            <form class="ui form">
                <h4 class="ui dividing header">Reminder</h4>
                <div class="field">
                    <div class="two fields">
                        <div class="field">
                            <sui-input v-model="data.reminder.amount"></sui-input>
                        </div>
                        <div class="field">
                            <sui-dropdown
                                    button
                                    labeled
                                    @click.prevent=""
                                    :options="times"
                                    v-model="data.reminder.type"
                            ></sui-dropdown>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
  import Required from '../Library/Required'
  import FormMessage from '../Library/FormMessage'
  import Notification from '../Library/Notification'

  export default {
    components: {
      Notification,
      FormMessage,
      Required
    },
    name: 'create-todo',
    data () {
      return {
        boardId: '',
        pickerOptions1: {
          disabledDate: (time) => {
            return this.$moment(time).isSameOrBefore(this.$moment().subtract(1, 'days'), 'day')
          },
          shortcuts: [{
            text: 'Today',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: 'Tomorrow',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: 'Next week',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        data: {
          name: '',
          location: '',
          description: '',
          start_date: {date: '', time: '00:01:00 AM'}, // this.$moment().add(1, 'hours').format('LTS')
          end_date: {date: '', time: '23:59:00 PM'},
          allDay: false,
          reminder: {type: 'm', amount: 10}
        },
        times: [{text: 'Minutes', value: 'm'}, {text: 'Hours', value: 'h'}, {text: 'Days', value: 'd'}],
        savable: {
          name: '',
          location: '',
          description: '',
          start_date: '',
          end_date: '',
          reminder: 10 * 60
        },
        error: {
          type: 'warning',
          message: '',
          status: false
        }
      }
    },
    watch: {
      'data.allDay' (value) {
        if (value) {
          if (!this.data.end_date.date && this.data.start_date.date) {
            this.data.end_date.date = this.data.start_date.date
          }
        }
      },
      'data.end_date.date' (value) {
        this.computeEndDate(value)
      },
      'data.end_date.time' (value) {
        // this.computeEndDate(value)
      },
      'data.start_date.date' (value, old) {
        this.computeStartDate(value)
      },
      'data.start_date.time' (value, old) {
        console.log(value)
        // this.computeStartDate(value)
      },
      'data.name' (value, old) {
        this.savable.name = value || old
      },
      'data.location' (value, old) {
        this.savable.location = value || old
      },
      'data.description' (value, old) {
        this.savable.description = value || old
      },
      'data.reminder.type' (value) {
        this.savable.reminder = this.resolveReminderDurationToSeconds(value) * 60
      },
      'data.reminder.amount' (value) {
        this.savable.reminder = this.resolveReminderDurationToSeconds(this.data.reminder.type) * value
      }
    },
    computed: {},
    methods: {
      computeStartDate (value) {
        console.log(this.data.start_date.time)
        if (!this.data.start_date.time) { // Set start time to 1min after 12am, if not already specified
          this.data.start_date.time = '00:01:00 AM'
        }
        let time = this.data.allDay ? this.$moment('23:59:59 PM', 'HH:mm:ss A')
          : this.$moment(this.data.start_date.time, 'HH:mm:ss A')
        let seconds = time.seconds()
        let minutes = time.minutes()
        let hours = time.hours()
        this.savable.start_date = this.$moment(value, 'x').add({seconds, minutes, hours}).format('x')
      },
      computeEndDate (value) {
        if (!this.data.end_date.time) { // Set start time to 59min after 11pm, if not already specified
          this.data.end_date.time = '23:59:00 PM'
        }
        let time = this.data.allDay ? this.$moment('23:59:59 PM', 'HH:mm:ss A')
          : this.$moment(this.data.end_date.time, 'HH:mm:ss A')
        let seconds = time.seconds()
        let minutes = time.minutes()
        let hours = time.hours()
        this.savable.end_date = this.$moment(value, 'x').add({seconds, minutes, hours}).format('x')
      },
      validateInput () {
        if (!this.savable.name) {
          this.errorStatus(true, 'Please enter the event name')
          return false
        }
        if (!this.savable.start_date) {
          this.errorStatus(true, 'Please choose a start date')
          return false
        }
        if (!this.savable.end_date) {
          this.errorStatus(true, 'Please choose an end date')
          return false
        }
        this.saveTask()
      },
      async saveTask () {
        let user = await this.getUser()
        this.$db.tasks.insert({
          name: this.savable.name,
          description: this.savable.description,
          start: this.savable.start_date,
          end: this.savable.end_date,
          location: this.savable.location,
          done: false,
          status: -1, // -1 => untouched, 0 => in progress, 1 => completed
          params: {},
          userId: user._id,
          boardId: this.boardId,
          reminder: this.savable.reminder
        }, (err, task) => {
          if (err) throw err
          this.success(`Task [${task.name}] created...`)
          this.data.name = ''
          this.data.description = ''
          this.focusInput('name')
        })
      },
      resolveReminderDurationToSeconds (m) {
        let due = 10 * 60 // Ten minutes before time
        switch (m) {
          case 's':
            due = 1
            break
          case 'm':
            due = 60
            break
          case 'h':
            due = 60 * 60
            break
          case 'd':
            due = 60 * 60 * 24
            break
        }
        return due
      },
      errorStatus (status, message) {
        this.error.status = status
        this.error.message = message
      },
      focusInput (ref = 'name') {
        if (this.$refs[ref]) {
          this.$refs[ref].focus()
        }
        return false
      }
    },
    mounted () {
      this.focusInput()
      this.boardId = this.$route.params.board || this.$route.query.board
    }
  }
</script>
<style scoped>
    .datepicker, .timepicker {
        padding-left: 45px;
    }
</style>