<template>
    <div class="ui grid container-fluid">
        <div class="twelve wide column">
            Hello World
        </div>
        <div class="four wide column">
            <div class="ui vertical menu">
                <a class="active teal item">
                    Today
                    <div class="ui teal left pointing label">1</div>
                </a>
                <a class="item">
                    Tomorrow
                    <div class="ui label">1</div>
                </a>
                <a class="item">
                    Undone
                    <div class="ui label">51</div>
                </a>
                <a class="item">
                    Done
                    <div class="ui label">51</div>
                </a>
                <a class="item">
                    All
                    <div class="ui label">51</div>
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
  export default {
    name: 'todos-index',
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {
      console.log('todos-index component mounted')
    }
  }
</script>
<style scoped>

</style>