<template>
    <div class="stati-box">
       <iframe src="static/stati/statistics.html" height="100%" width="100%"></iframe>
    </div>
</template>
<script>
export default {
    created () {
        this.$loading.hide();
    }
}
</script>
<style scoped>
 .stati-box {
     height: 100%;
 }
</style>