<template>
    <div>
        <task-list pageType="executing"></task-list>
    </div>

</template>

<script>
    import taskList from '../../components/taskList'
    export default {
        name: "executing",
        components:{
            taskList
        }
    }
</script>

<style scoped>

</style>