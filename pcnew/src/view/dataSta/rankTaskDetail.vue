<template>
    <div class="ranking-list">
        <header class="page-header"><span class="page-title">{{pageName}}-任务详情</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button @click="$router.go(-1)">返回</a-button>
            </div>
        </header>
        <div class="split-box"></div>
        <filter-module :rank-task="true" @done="getFilterData"></filter-module>
        <div class="data-charts">
            <div class="power-table" v-if="dataArr.length > 0">
                <div class="table-content">
                    <a-table :data-source="dataArr" :pagination="pagination" :loading="loading"
                             rowKey="id" @change="handleTableChange">
                        <!--title 标题  dataIndex数据字段 key vue需要的key-->
                        <a-table-column title="排序" data-index="orderNum"></a-table-column>
                        <a-table-column title="任务名称" data-index="title" :ellipsis="true"/>
                        <a-table-column title="任务级别" data-index="level">
                            <template slot-scope="text">
                                <span>{{text === 0 ? '普通' : (text === 2 ? '非常紧急' : '紧急')}}</span>
                            </template>
                        </a-table-column>
                        <a-table-column title="任务状态" data-index="status">
                            <template slot-scope="text">
                                <span>{{text === 1 ? '待开始' : (text === 2 ? '执行中' : (text === 3 ? '已逾期' : '已完成'))}}</span>
                            </template>
                        </a-table-column>
                        <a-table-column title="任务进度" data-index="task_progress">
                            <template slot-scope="text">
                                <span>{{text}}%</span>
                            </template>
                        </a-table-column>
                        <a-table-column title="发起时间" data-index="start_time"/>
                        <a-table-column title="截至时间" data-index="end_time"/>
                        <a-table-column title="任务发起人" data-index="name"/>
                        <a-table-column title="发起部门" data-index="dep_name"/>
                        <a-table-column title="任务接收人数" data-index="receive_user_count"/>
                        <a-table-column key="action" title="操作">
                            <template slot-scope="record">
                            <span>
                                 <a-button type="primary" @click="seeDetail(record.id,record.pageType)">查看详情</a-button>
                            </span>
                            </template>
                        </a-table-column>
                    </a-table>
                </div>
            </div>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </div>
    </div>
</template>

<script>
    import {statistics} from '@/api'
    import filterModule from '../../components/filterModule'
    import moment from 'moment'
    export default {
        name: "rankTaskDetail",
        components: { filterModule},
        data() {
            return {
                pageName:this.$route.query.name ? this.$route.query.name : '',
                userId:this.$route.query.id,
                taskCountFilter: [],//任务统计搜索
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
                },//任务统计的筛选
                loading: false,//加载
                pagination: {
                    current: 1,//当前页
                    pageSize: 10,//每页多少条
                    total: 1//总条数
                },
                dataArr: [],//表格数据

            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            moment,
            //获取筛选框的数据
            getFilterData(data) {
                this.filterData = data;
                this.getData();
            },
            /*个人排行榜*/
            async getData() {
                this.loading = true;
                let params = {
                    userid:this.userId,
                    role_type:this.filterData.taskRole,
                    status:this.filterData.taskStatus,
                    level:this.filterData.taskLevel,
                    launch_time:this.filterData.startTimeType,
                    l_start_time:this.filterData.sStartTime ?  moment(this.filterData.sStartTime).format('YYYY-MM-DD') : null,
                    l_end_time:this.filterData.sEndTime ? moment(this.filterData.sEndTime).format('YYYY-MM-DD') : null,
                    end_time:this.filterData.endTimeType,
                    e_start_time:this.filterData.eStartTime ?  moment(this.filterData.eStartTime).format('YYYY-MM-DD') : null,
                    // page:this.pageIndex,
                    // limit:this.pageSize
                    page: this.pagination.current,
                    limit: this.pagination.pageSize,
                    order:'asc',//asc 正序 desc 倒序
                    order_field:'level',
                };
                const {data, msg,code} = await statistics.peopleTask(params);
                if (code) {
                    this.pagination.total = data.total;
                    this.dataArr = [].concat(data.data)
                    if (this.dataArr.length > 0){
                        this.dataArr.forEach((item,index) =>{
                            item.orderNum = (this.pagination.current - 1) * this.pagination.pageSize + index + 1
                            if (item.status === 0){
                                item.pageType = 'drafts'
                            }else  if (item.status === 1){
                                item.pageType = 'executing'
                            }else  if (item.status === 2){
                                item.pageType = 'executing'
                            }else  if (item.status === 3){
                                item.pageType = 'executing'
                            }else  if (item.status === 4){
                                item.pageType = 'finished'
                            }
                        })
                    }
                    this.loading = false
                }else {
                    this.$message.error(msg,2)
                    this.loading = false
                }
            },
            //分页、排序、筛选变化时触发
            handleTableChange(pagination,filters, sorter) {
                console.log(filters,sorter)
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                this.getData();
            },
            //查看详情
            seeDetail(id,pageType) {
                this.$router.push({
                    path:'/taskDetail/taskDetail',
                    query:{id:id,pageType:pageType}
                })
            },
        }
    }
</script>

<style scoped>
    @import "../../assets/css/homePage.css";
</style>