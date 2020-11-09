<template>
    <div>
        <task-detail-module pageType="editTask"></task-detail-module>
    </div>
</template>

<script>
    import taskDetailModule from '../../components/addEditTask'

    export default {
        name: "editTask",
        components: {
            taskDetailModule
        }
    }
</script>
<style scoped>

</style>