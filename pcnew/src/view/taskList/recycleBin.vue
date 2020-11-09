<template>
    <div>
        <task-list pageType="recycleBin"></task-list>
    </div>
</template>

<script>
    import taskList from '../../components/taskList'

    export default {
        name: "recycleBin",
        components:{
            taskList
        }
    }
</script>

<style scoped>

</style>