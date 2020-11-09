<template>
    <div>
        <task-list pageType="finished"></task-list>
    </div>
</template>

<script>
    import taskList from '../../components/taskList'
    export default {
        name: "finished",
        components:{
            taskList
        }
    }
</script>

<style scoped>

</style>