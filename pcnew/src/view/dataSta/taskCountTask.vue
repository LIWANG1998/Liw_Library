<template>
    <div class="ranking-list">
        <header class="page-header"><span class="page-title">数据详情-{{pageName}}</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button @click="$router.go(-1)">返回</a-button>
            </div>
        </header>
        <div class="split-box"></div>
        <filter-module :rank-task="true" @done="getFilterData" :back-obj="filterObj"></filter-module>
<!--        <task-count-filter :people-filter="true" @done="getFilterData"></task-count-filter>-->
        <div class="split-box"></div>
        <task-list-module page-type="allTask" :count-filter="filterObj" :is-peoples-task="true"
                          :show-pagination="true" ref="taskListModule"></task-list-module>
    </div>
</template>

<script>
    // import {statistics} from '@/api'
    // import TaskCountFilter from "../../components/taskCountFilter";
    import filterModule from '../../components/filterModule'
    import taskListModule from '../../components/taskListModule';

    export default {
        name: "taskCountTask",
        components: {taskListModule,filterModule},
        data() {
            return {
                pageName: this.$route.query.name ? this.$route.query.name : '',
                userId: this.$route.query.id ? this.$route.query.id : '',
                filterObj: {
                    userId: this.$route.query.id,
                    statUser: 1,//人员范围或排行维度
                    strarUserId: '',//人员范围id或排行维度id
                    taskRole: '1,2,3',//任务角色
                    taskLevel: '0,1,2',//任务级别
                    taskStatus: '1,2,3,4,5',
                    startTimeType: 0,//开始时间
                    sStartTime: null,//开始时间-开始时间
                    sEndTime: null,//开始时间-结束时间
                    endTimeType: 0,//结束时间
                    eStartTime: null,//结束时间-开始时间
                    eEndTime: null,//结束时间-结束时间
                },
                loading: false,//加载
                pagination: {
                    current: 1,//当前页
                    pageSize: 12,//每页多少条
                    total: 1//总条数
                },
                dataArr: [],//表格数据
                errorImg: 'this.src="' + require('@/assets/images/userDefault.png') + '"',
            }
        },
        created(){
            this.getLastPageSearch();
        },
        methods: {
            //取上个页面搜索的值
            getLastPageSearch(){
                let obj =JSON.parse(sessionStorage.getItem('staCountFilter'));
                if (obj){
                    this.filterObj = Object.assign({},obj);
                    this.filterObj.userId = this.userId;
                }
            },
            //搜索传回来的值
            getFilterData(data) {
                this.filterObj = Object.assign({},data);
                this.filterObj.userId = this.userId;
                // this.$refs.taskListModule.getData(1)
            },
            //获取数据在任务列表页
        }
    }
</script>

<style scoped>

</style>