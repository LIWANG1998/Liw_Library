<template>
    <div>
        <task-list pageType="overdueList"></task-list>
    </div>

</template>

<script>
    import taskList from '../../components/taskList'
    export default {
        name: "overdueList",
        components:{
            taskList
        }
    }
</script>

<style scoped>

</style>