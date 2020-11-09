<template>
    <div class="ranking-list">
        <header class="page-header"><span class="page-title">{{pageName}}-排行详情</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button @click="$router.go(-1)">返回</a-button>
            </div>
        </header>
        <div class="split-box"></div>
        <div class="data-charts">
            <filter-module @done="getFilterData" :rank-detail="true" :back-obj="filterData"></filter-module>
            <div class="power-table">
                <div class="table-content" v-if="dataArr.length > 0">
                    <a-table :columns="columns" :rowKey="record => record.userid" :data-source="dataArr" :pagination="pagination" :loading="loading"
                              @change="handleTableChange">
                        <template slot="action" slot-scope="text, record">
                            <span>
                                 <a-button type="primary" @click="seeDetail(record.name,record.userid)">查看详情</a-button>
                            </span>
                        </template>
                        <template slot="overtimeRate" slot-scope="text">
                            <span>{{text}}%</span>
                        </template>
                        <template slot="completeRate" slot-scope="text">
                            <span>{{text}}%</span>
                        </template>
                        <template slot="ontimeCompleteRate" slot-scope="text">
                            <span>{{text}}%</span>
                        </template>
                        <!--title 标题  dataIndex数据字段 key vue需要的key-->
<!--                        <a-table-column title="排序" data-index="orderNum"/>
                        <a-table-column title="用户名称" data-index="user_name" :ellipsis="true"/>
                        <a-table-column title="任务总数" data-index="all_num"/>
                        <a-table-column title="待处理" data-index="process_num"/>
                        <a-table-column title="逾期次数" data-index="out_time"/>
                        <a-table-column title="逾期数量" data-index="out_time_num"/>
                        <a-table-column title="逾期率" data-index="out_time_rate"/>
                        <a-table-column title="完成数量" data-index="run_num"/>
                        <a-table-column title="完成率" data-index="run_rate"/>
                        <a-table-column title="按时完成率" data-index="run_time_rate"/>
                        <a-table-column key="action" title="操作">
                            <template slot-scope="record">
                                <span>
                                     <a-button type="primary" @click="seeDetail(record.user_name,record.userid)">查看详情</a-button>
                                </span>
                            </template>
                        </a-table-column>-->
                    </a-table>
                </div>
                <div class="no-data" v-else>
                    <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {statistics} from '@/api'
    import filterModule from '../../components/filterModule'
    import moment from 'moment'

    export default {
        name: "rankDetail",
        components: {filterModule},
        data() {
            return {
                pageType: this.$route.query.pageType ? this.$route.query.pageType : 'all_num',
                pageName: this.$route.query.name ? this.$route.query.name : '任务总数',
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
                    endTimeType:0,//结束时间
                    eStartTime: null,//结束时间-开始时间
                    eEndTime: null,//结束时间-结束时间
                },//任务统计的筛选
                loading: false,//加载
                pagination: {
                    current: 1,//当前页
                    pageSize: 10,//每页多少条
                    total: 1//总条数
                },
                sortType: 'asc',
                sorrArr: ['ascend', 'descend'],
                dataArr: [],//表格数据//
                columns: [
                    {
                    title: '排序',
                    dataIndex: 'orderNum',
                    key: 'orderNum',
                },
                    {
                        title: '用户名称',
                        dataIndex: 'name',
                        ellipsis: true,
                        key: 'name',
                    },
                    {
                        title: '任务总数',
                        dataIndex: 'all_total_count',
                        sorter: true,
                        key: 'all_total_count',
                    },
                    {
                        title: '待处理',
                        sorter: true,
                        dataIndex: 'untreated_count',
                        key: 'untreated_count',
                    },
                    {
                        title: '逾期次数',
                        dataIndex: 'overdue_count',
                        key: 'overdue_count',
                        sorter: true,

                    },
                    {
                        title: '逾期数量',
                        dataIndex: 'overdue_num',
                        key: 'overdue_num',
                        sorter: true,

                    },
                    {
                        title: '逾期率',
                        dataIndex: 'overdue_rate',
                        key: 'overdue_rate',
                        sorter: true,
                        scopedSlots: {customRender: 'overtimeRate'}
                        // overtimeRate

                    },
                    {
                        title: '完成数量',
                        dataIndex: 'finish_count',
                        key: 'finish_count',
                        sorter: true,


                    },
                    {
                        title: '完成率',
                        dataIndex: 'finish_rate',
                        key: 'finish_rate',
                        sorter: true,
                        scopedSlots: {customRender: 'completeRate'}

                    },
                    {
                        title: '按时完成率',
                        dataIndex: 'ontime_finish_rate',
                        key: 'ontime_finish_rate',
                        sorter: true,
                        scopedSlots: {customRender: 'ontimeCompleteRate'}

                    },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'}
                    },
                ],
            }
        },
        created() {
            this.getLastPageSearch();
            this.getData()
        },
        methods: {
            moment,
            //取上个页面搜索的值
            getLastPageSearch(){
                let obj = JSON.parse(sessionStorage.getItem('staCountFilter'))
                if (obj){
                    this.filterData = obj
                }
            },
            //获取筛选框的数据
            getFilterData(data) {
                this.filterData = data;
                this.getData(1);
            },
            /*任务总数*/
            async getData(isSearch) {
                this.loading = true;
                if (isSearch){
                    this.pagination.current = 1
                }
                let params = {
                    people_type: this.filterData.statUser,
                    people_userid: this.filterData.strarUserId,
                    level: this.filterData.taskLevel,
                    launch_time: this.filterData.startTimeType,
                    l_start_time: this.filterData.sStartTime ? moment(this.filterData.sStartTime).format('YYYY-MM-DD') : null,
                    l_end_time: this.filterData.sEndTime ? moment(this.filterData.sEndTime).format('YYYY-MM-DD') : null,
                    end_time: this.filterData.endTimeType,
                    e_start_time: this.filterData.eStartTime ? moment(this.filterData.eStartTime).format('YYYY-MM-DD') : null,
                    e_end_time: this.filterData.eEndTime ? moment(this.filterData.eEndTime).format('YYYY-MM-DD') : null,
                    page: this.pagination.current,
                    limit: this.pagination.pageSize,
                    order: this.sortType,//asc 正序 desc 倒序
                    order_field: this.pageType.trim(),
                };
                const {data, msg, code} = await statistics.rankListMore(params);
                if (code) {
                    console.log(data)
                    this.pagination.total = data.total;
                    this.dataArr = [].concat(data.data)
                    if (this.dataArr && this.dataArr.length > 0) {
                        this.dataArr.forEach((item, index) => {
                            item.orderNum = (this.pagination.current - 1) * this.pagination.pageSize + index + 1
                        })
                    }
                    this.loading = false
                } else {
                    this.$message.error(msg, 2)
                    this.loading = false
                }
            },
            //页码改变时
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
            //查看详情
            seeDetail(name, id) {
                // console.log(name, id)
                this.$router.push({
                    path: '/dataSta/rankTaskDetail',
                    query: {name: name, id: id}
                })
            },
        }
    }
</script>

<style scoped>
    @import "../../assets/css/homePage.css";
</style>