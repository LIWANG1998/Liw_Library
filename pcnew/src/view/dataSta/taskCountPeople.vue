<template>
    <!--首页统计点进去的页面-->
    <div class="ranking-list">
        <header class="page-header"><span class="page-title">数据详情</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button @click="$router.go(-1)">返回</a-button>
            </div>
        </header>
        <div class="split-box"></div>
        <div class="section-title"><span>任务统计</span></div>
<!--        <task-count-filter @done="getFilterData"></task-count-filter>-->
        <filter-module @done="getFilterData" :back-obj="filterObj"></filter-module>
        <div class="split-box"></div>
        <div class="people-content" v-if="dataArr.length > 0">
            <ul class="content-ul" >
                <li class="li-card" v-for="(item,index) in dataArr" :key="index">
                    <div class="top">
                        <div class="left">
                            <img :src="item.avatar" alt="" align="baseline"  :onerror="errorImg">
                            <span>{{item.name}}</span>
                        </div>
                        <a-button type="link" @click="seeDetail(item.userid,item.name)">查看详情</a-button>
                    </div>
                    <div class="bottom">
                        <span class="label">相关任务数</span>
                        <span class="val">{{item.tr_count}}</span>
                    </div>
                </li>
            </ul>
            <div class="paging">
                <a-pagination :current="pagination.current" :total="pagination.total" :defaultPageSize="pagination.pageSize"
                              @change="pageChange" :hideOnSinglePage="true"/>
            </div>
        </div>
        <div class="no-data" v-else>
            <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
        </div>

    </div>
</template>

<script>
    import {statistics} from '@/api'
    // import TaskCountFilter from "../../components/taskCountFilter";
    import  filterModule from '../../components/filterModule'
    import moment from 'moment'
    export default {
        name: "taskCountPeople",
        components: {
            // TaskCountFilter
            filterModule
        },
        data(){
            return{
                pageName:this.$route.query.name ? this.$route.query.name : '',
                filterObj:{
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
                errorImg: 'this.src="'+require('@/assets/images/userDefault.png')+'"',
            }
        },
        created(){
            this.getLastPageSearch()
            this.getData()
        },
        methods:{
            moment,
            //取上个页面搜索的值
            getLastPageSearch(){
                let obj =JSON.parse(sessionStorage.getItem('staCountFilter'))
                if (obj){
                    this.filterObj = obj
                }
            },
            //搜索传回来的值
            getFilterData(data){
                this.filterObj = data
                this.getData(1);
            },
            //获取数据
            async getData(isSearch) {
                if (isSearch){
                    this.pagination.current = 1
                }
                let params = {
                    people_type:this.filterObj.statUser,
                    people_userid:this.filterObj.strarUserId,
                    role_type:this.filterObj.taskRole,
                    status:this.filterObj.taskStatus,
                    level:this.filterObj.taskLevel,
                    launch_time:this.filterObj.startTimeType,
                    l_start_time:this.filterObj.sStartTime ?  moment(this.filterObj.sStartTime).format('YYYY-MM-DD') : null,
                    l_end_time:this.filterObj.sEndTime ? moment(this.filterObj.sEndTime).format('YYYY-MM-DD') : null,
                    end_time:this.filterObj.endTimeType,
                    e_start_time:this.filterObj.eStartTime ?  moment(this.filterObj.eStartTime).format('YYYY-MM-DD') : null,
                    e_end_time:this.filterObj.eEndTime ? moment(this.filterObj.eEndTime).format('YYYY-MM-DD') : null,
                    page:this.pagination.current,
                    limit:this.pagination.pageSize
                };
                // console.log(params)
                const {code, msg,data} = await statistics.countDetail(params)
                if (code){
                    this.dataArr = data.data
                    this.pagination.total = data.total
                } else {
                    this.$message.error(msg,2)
                }
            },
            //分页
            pageChange(current) {
                this.pagination.current = current;
                this.getData();
            },
            //去详情
            seeDetail(id,name) {
                sessionStorage.setItem('staCountFilter',JSON.stringify(this.filterObj));
                this.$router.push({
                    path: '/dataSta/taskCountTask',
                    query: {id: id, name:name}
                })
            },
        },
    }
</script>

<style scoped>
    @import "../../assets/css/homePage.css";
</style>
<style scoped lang="less">
    .people-content{
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        .content-ul{
            width: 100%;
            box-sizing: border-box;
            min-height: 300px;
            display: flex;
            flex-wrap: wrap;
            .li-card{
                width: 23%;
                min-width: 260px;
                height: 133px;
                padding: 15px;
                box-sizing: border-box;
                background: #FFFFFF;
                box-shadow: 0px 2px 12px rgba(48, 49, 51, 0.12);
                border-radius: 4px;
                margin-right: 2%;
                margin-bottom: 20px;
                .top{
                    height: 40px;
                    width: 100%;
                    line-height: 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #E8E8E8;
                    img{
                        width: 30px;
                        height: 30px;
                        margin-right: 6px;
                        vertical-align: middle;
                    }
                    span{
                        font-size: 15px;
                        font-weight: 500;
                        color: #303133;
                    }
                }
                .bottom{
                    height: 56px;
                    line-height: 56px;
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    .label{
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 22px;
                        color: #909399;
                    }
                    .val{
                        font-size: 40px;
                        font-weight: bold;
                        color: #303133;
                    }
                }
            }
            /*.li-card:nth-child(4n){*/
            /*    margin-right: 0;*/
            /*}*/
        }
    }
</style>