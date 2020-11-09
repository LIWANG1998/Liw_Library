<template>
    <div class="task-list">
        <header class="page-header">任务总数</header>
        <div class="split-box"></div>
        <filter-module @done="getFilterData" :back-obj="filterData"></filter-module>
        <div class="split-box"></div>
        <div class="task-list">
            <div class="task-content" v-if="taskList.length > 0">
                <a-table :rowKey="record => record.task_id" :data-source="taskList" :pagination="pagination"
                         :loading="loading" @change="handleTableChange">
                    <template slot="action" slot-scope="text, record">
                            <span>
                                <a-button type="primary" @click="seeDetail(record.user_name,record.userid)">查看详情</a-button>
                            </span>
                    </template>
                    <!--title 标题  dataIndex数据字段 key vue需要的key-->
                    <a-table-column title="排名" data-index="orderNum"/>
                    <a-table-column title="任务名称" data-index="title" :ellipsis="true"/>
                    <a-table-column title="任务级别" data-index="level">
                        <template slot-scope="level">
                            {{level==0?"普通":level==1?"紧急":"非常紧急"}}
                        </template>
                    </a-table-column>
                    <a-table-column title="任务状态" data-index="status">
                        <template slot-scope="status">
                            {{status==0?"未发布":status==1?"执行中":status==2?"已完成":"取消"}}
                        </template>
                    </a-table-column>
                    <a-table-column title="任务进度" data-index="task_progress">
                        <template slot-scope="task_progress">
                            {{task_progress ? task_progress:0}}%
                        </template>
                    </a-table-column>
                    <a-table-column title="发起时间" data-index="create_time"/>
                    <a-table-column title="截至时间" data-index="end_time"/>
                    <a-table-column title="任务发起人" data-index="name"/>
                    <a-table-column title="发起部门" data-index="dep_name"/>
                    <a-table-column title="任务接收人数" data-index="receive_user_count"/>
                    <a-table-column key="action" title="操作">
                        <template slot-scope="record">
                                <span>
                                    <a-button type="primary" @click="goDetail(record.task_id)">查看详情</a-button>
                                </span>
                        </template>
                    </a-table-column>
                </a-table>
            </div>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </div>

    </div>

</template>

<script>
    import {statistics} from '@/api'
    import moment from 'moment'
    import filterModule from '../../components/filterModule'

    export default {
        name: "allTask",
        components: {filterModule},
        data() {
            return {
                headerText: '',
                filterBoxShow: true,
                filterData: {
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
                },//筛选

                taskList: [],
                loading: false,
                pagination: {
                    current: 1,//当前页
                    pageSize: 10,//每页多少条
                    total: 1//总条数
                },
            }
        },
        created() {
            this.getData();
        },
        methods: {
            //获取任务状态
            async getData(isSearch) {
                this.loading = true;
                //判断页面筛选条件
                if (isSearch){
                    this.pagination.current = 1
                }
                let params = {
                    people_type:this.filterData.statUser,
                    people_userid:this.filterData.strarUserId,
                    role_type:this.filterData.taskRole,
                    status:this.filterData.taskStatus,
                    level:this.filterData.taskLevel,
                    launch_time:this.filterData.startTimeType,
                    l_start_time:this.filterData.sStartTime ?  moment(this.filterData.sStartTime).format('YYYY-MM-DD') : null,
                    l_end_time:this.filterData.sEndTime ? moment(this.filterData.sEndTime).format('YYYY-MM-DD') : null,
                    end_time:this.filterData.endTimeType,
                    e_start_time:this.filterData.eStartTime ?  moment(this.filterData.eStartTime).format('YYYY-MM-DD') : null,
                    e_end_time:this.filterData.eEndTime ? moment(this.filterData.eEndTime).format('YYYY-MM-DD') : null,
                    page:this.pagination.current,
                    limit:this.pagination.pageSize
                };

                //请求
                const {code, msg, data} = await statistics.allTask(params);
                if (code === 1) {
                    this.loading = false;
                    this.pagination.total = data.total;
                    this.taskList = [].concat(data.data);
                    if (this.taskList.length > 0) {
                        this.taskList.forEach((item, index) => {
                            item.orderNum = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
                            item.orderNum = item.orderNum < 10 ? `0${item.orderNum}` : item.orderNum;
                        })
                    }
                } else {
                    this.loading = true;
                    this.$message.error(msg, 2)
                }
            },
            //分页时
            handleTableChange(pagination, filters, sorter) {
                console.log(filters)
                // console.log(sorter)
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                if (sorter.order === "ascend") {
                    this.sortType = 'asc'
                } else {
                    this.sortType = 'desc'
                }
                this.getData();
            },
            getFilterData(data) {
                this.filterData = data;
                this.getData(1);
            },
            //去任务详情
            goDetail(id) {
                this.$router.push({
                    path: '/taskDetail/taskDetail',
                    query: {id: id, pageType: this.pageType, look: 0}
                })
            },
        },

    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/taskList.less";
</style>