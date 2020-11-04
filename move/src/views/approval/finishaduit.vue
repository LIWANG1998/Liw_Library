<template>
    <div class="content">
        <!--        菜单选项卡-->
        <div class="toptab">
            <div :class="{checked:show ===1}" @click="show = 1">意见汇总</div>
            <div :class="{checked:show ===2}" @click="show = 2">附件列表</div>
        </div>
        <!--        意见汇总-->
        <div v-if="show === 1">
            <Opinion></Opinion>
        </div>
        <!--        附加列表-->
        <div v-else-if="show ===2">
            <File></File>
        </div>
    </div>
</template>
<script>
    import Opinion from "./components/opinion";
    import File from "./components/file";
    export default {
        name: "finishaduit",
        components: {
            File,
            Opinion,
        },
        data(){
            return{
                type:"",//页面类型----发文：dispatch,收文：receive,签发：sign
                show:1,//菜单选中状态
                auditor:"auditor"
            }
        }
    }
</script>

<style lang="scss" scoped>
    .toptab{
        height: 44px;
        line-height: 44px;
        display: flex;
        justify-content: space-around;
        font-size: 16px;
        color: #303133;
        .checked{
            color: #0082EF !important;
            border-bottom: 2px solid #0082EF !important;
        }
    }
</style>