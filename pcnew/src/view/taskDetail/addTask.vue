<template>
    <div>
        <task-detail-module pageType="addTask"></task-detail-module>
    </div>
</template>

<script>
    import taskDetailModule from '../../components/addEditTask'
    export default {
        name: "addTAsk",
        components:{
            taskDetailModule
        }
    }
</script>

<style scoped>

</style>