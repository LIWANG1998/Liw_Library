<template>
    <div>
        <task-list pageType="drafts"></task-list>
    </div>

</template>

<script>
    import taskList from '../../components/taskList'
    export default {
        name: "drafts",
        components:{
            taskList
        }
    }
</script>

<style scoped>

</style>