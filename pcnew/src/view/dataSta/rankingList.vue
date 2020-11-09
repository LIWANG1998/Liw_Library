<template>
    <div class="ranking-list">
        <header class="page-header"><span class="page-title">汇总排行榜</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button type="primary" @click="$router.push('/taskList/allTask')">全部任务</a-button>
            </div>
        </header>
        <div class="split-box"></div>
        <div class="section-title"><span>任务统计</span></div>
        <!--        <task-count-filter  @done="getFilterData"></task-count-filter>-->
        <filter-module @done="getFilterData" :rank-list="true"></filter-module>
        <div class="content">
            <sta-count :count-arr="myTaskCount" :count-role="filterData.statUser"
                       count-type="rankList" :count-obj="filterData"
                       :count-time="filterData.startTimeType"></sta-count>
        </div>
        <div class="split-box"></div>
        <div class="section-title"><span>排行榜</span></div>
        <filter-module @done="getRankFilterData" :rank-count="true"></filter-module>
        <div class="data-charts">
            <div class="data-charts-card" v-for="(item,index) in eleList" :key="index">
                <p class="data-charts-title"><span>{{item.name}}排行</span>
                    <a-button type="link" @click="seeDetail(item.type,item.name)" v-if="userInfo.type == 2">查看详情
                    </a-button>
                </p>
                <div :id="item.eleId"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {statistics} from '@/api'
    import filterModule from '../../components/filterModule'
    import staCount from '../../components/staCountModule'
    import moment from 'moment'
    import {Chart} from "@antv/g2";

    export default {
        name: "rankingList",
        components: {
            filterModule,
            staCount
        },
        data() {
            return {
                myTaskCount: [
                    {
                        path: require('@/assets/images/homePage/myTask7.png'),
                        num: 0,
                        name: '任务总数',
                        tipsText: '',
                        tipsText2: '',//0
                        type: 7,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask1.png'),
                        num: 0,
                        name: '待处理',
                        tipsText: '',
                        tipsText2: '',//1
                        type: 1,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask5.png'),
                        num: 0,
                        name: '我参与的',
                        tipsText: '',
                        tipsText2: '',//2
                        type: 5,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask6.png'),
                        num: 0,
                        name: '我发起的',
                        tipsText: '',
                        tipsText2: '',//3
                        type: 6,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask2.png'),
                        num: 0,
                        name: '逾期数量',
                        tipsText: '逾期率0%',
                        tipsText2: '',//4
                        type: 2,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask3.png'),
                        num: 0,
                        name: '逾期次数',
                        tipsText: '',
                        tipsText2: '',//5
                        class: 'isBan',
                        type: 3
                    },
                    {
                        path: require('@/assets/images/homePage/myTask4.png'),
                        num: 0,
                        name: '完成数量',
                        tipsText: '完成率0%',
                        tipsText2: '按时完成率0%',//6
                        type: 4
                    },
                ],//任务统计
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
                /*排行榜*/
                eleList: [
                    {name: '任务总数', eleId: 'personTaskCount', type: 'all_num'},
                    {name: '待处理', eleId: 'personTaskPending', type: 'process_num'},
                    {name: '逾期次数', eleId: 'personTaskOverdueTimes', type: 'out_time'},
                    {name: '逾期数量', eleId: 'personTaskOverdueNum', type: 'out_time_num'},
                    {name: '逾期率', eleId: 'personTaskOverdueRate', type: 'out_time_rate'},
                    {name: '完成数量', eleId: 'personTaskCompleteNum', type: 'run_num'},
                    {name: '完成率', eleId: 'personTaskCompleteRate', type: 'run_rate'},
                    {name: '按时完成率', eleId: 'personTaskCompleteOnTimeRate', type: 'run_time_rate'},
                ],//元素列表
                rankFilterData: {
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
                },//排行榜筛选
                taskTotal: [],//任务总数
                taskPending: [],//待处理
                taskOverTime: [],//逾期次数
                taskOverNum: [],//逾期数量-总
                taskOverNumIn: [],//逾期数量
                taskOverRate: [],//逾期率
                taskCompleteNum: [],//完成数量
                taskCompleteRate: [],//完成率
                taskCompleteOnTimeRate: [],//准时完成率
                chartView: {
                    personTaskCount: "",
                    personTaskPending: "",
                    personTaskOverdueTimes: "",
                    personTaskOverdueNum: "",
                    personTaskOverdueRate: "",
                    personTaskCompleteNum: "",
                    personTaskCompleteRate: "",
                    personTaskCompleteOnTimeRate: "",
                },
                userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
            }
        },
        mounted() {
            this.getMyTaskData();
            this.getCharts()
        },
        methods: {
            moment,
            //获取筛选框的数据
            getFilterData(data) {
                this.filterData = data;
                this.getMyTaskData()
            },
            //获取筛选框的数据
            getRankFilterData(data) {
                this.rankFilterData = data;
                this.getCharts('search');
            },
            //获取任务统计总览
            async getMyTaskData() {
                let params = {
                    people_type: this.filterData.statUser,
                    people_userid: this.filterData.strarUserId,
                    role_type: this.filterData.taskRole,
                    // status:this.filterData.taskStatus,
                    level: this.filterData.taskLevel,
                    launch_time: this.filterData.startTimeType,
                    l_start_time: this.filterData.sStartTime ? moment(this.filterData.sStartTime).format('YYYY-MM-DD') : null,
                    l_end_time: this.filterData.sEndTime ? moment(this.filterData.sEndTime).format('YYYY-MM-DD') : null,
                    end_time: this.filterData.endTimeType,
                    e_start_time: this.filterData.eStartTime ? moment(this.filterData.eStartTime).format('YYYY-MM-DD') : null,
                    e_end_time: this.filterData.eEndTime ? moment(this.filterData.eEndTime).format('YYYY-MM-DD') : null,
                };
                const {code, data} = await statistics.rankListSeeMore(params);
                if (code) {
                    let arr = this.myTaskCount;
                    //数量
                    arr[0].num = data.all_total_count;
                    arr[1].num = data.untreated_count;
                    arr[2].num = data.partake_count;
                    arr[3].num = data.launch_count;
                    arr[4].num = data.overdue_num;
                    arr[5].num = data.overdue_count;
                    arr[6].num = data.finish_count;
                    //率
                    arr[4].tipsText = '逾期率' + data.overdue_rate + '%';
                    arr[6].tipsText = '完成率' + data.finish_rate + '%';
                    arr[6].tipsText2 = '按时完成率' + data.ontime_finish_rate + '%';
                }
            },

            /*个人排行榜*/
            async getCharts(type) {
                let params = {
                    people_type: this.rankFilterData.statUser,
                    people_userid: this.rankFilterData.strarUserId,
                    level: this.rankFilterData.taskLevel,
                    launch_time: this.rankFilterData.startTimeType,
                    l_start_time: this.rankFilterData.sStartTime ? moment(this.rankFilterData.sStartTime).format('YYYY-MM-DD') : null,
                    l_end_time: this.rankFilterData.sEndTime ? moment(this.rankFilterData.sEndTime).format('YYYY-MM-DD') : null,
                    end_time: this.rankFilterData.endTimeType,
                    e_start_time: this.rankFilterData.eStartTime ? moment(this.rankFilterData.eStartTime).format('YYYY-MM-DD') : null,
                    e_end_time: this.rankFilterData.eEndTime ? moment(this.rankFilterData.eEndTime).format('YYYY-MM-DD') : null,
                    page: 1,
                    num: 5,
                };
                const {data, code} = await statistics.getRankList(params);
                if (code) {
                    this.taskTotal = data.total_count_list;
                    this.taskPending = data.untreated_count_list;
                    this.taskOverTime = data.overdue_count_list.map(item => {
                        return {
                            name: item.name,
                            num: Number(item.num)
                        }
                    });
                    this.taskOverNum = data.overdue_num_list;
                    //完成率，按时完成率，完成数量，逾期数量，逾期率
                    if (data.finish_count_list.length > 0) {
                        this.taskCompleteNum = data.finish_count_list.map(item => {
                            return {
                                name: item.name,
                                num: item.num,
                            }
                        })
                        this.taskCompleteRate = data.finish_count_list.map(item => {
                            return {
                                name: item.name,
                                num: item.finish_rate,
                            }
                        })
                        this.taskCompleteOnTimeRate = data.finish_count_list.map(item => {
                            return {
                                name: item.name,
                                num: item.ontime_finish_rate,
                            }
                        })
                    }
                    if (data.overdue_num_list.length > 0) {
                        this.taskOverNum = data.overdue_num_list.map(item => {
                            return {
                                name: item.name,
                                num: item.num,
                            }
                        })
                        this.taskOverRate = data.overdue_num_list.map(item => {
                            return {
                                name: item.name,
                                num: item.overdue_rate,
                            }
                        })
                    }

                    this.getOneChart('personTaskCount', type, this.taskTotal, '数量', 'blue', false);
                    this.getOneChart('personTaskPending', type, this.taskPending, '数量', 'red');
                    this.getOneChart('personTaskOverdueTimes', type, this.taskOverTime, '次数', 'blue', false);
                    this.getOneChart('personTaskOverdueNum', type, this.taskOverNum, '数量', 'red', false);
                    this.getOneChart('personTaskOverdueRate', type, this.taskOverRate, '逾期率', 'blue', true);
                    this.getOneChart('personTaskCompleteNum', type, this.taskCompleteNum, '数量', 'red', false);
                    this.getOneChart('personTaskCompleteRate', type, this.taskCompleteRate, '完成率', 'blue', true);
                    this.getOneChart('personTaskCompleteOnTimeRate', type, this.taskCompleteOnTimeRate, '按时完成率', 'red', true);
                }
            },
            //单柱图表
            /**
             * @param {ele} 图表对象
             * @param {type} 图表类型
             * @param {dataArr} 图表数据
             * @param {text} 图表横向展示的文字
             * @param {color} 图形颜色
             * @param {isRate} 是否为比率
             */
            getOneChart(ele, type, dataArr, text, color, isRate) {
                // console.log(dataArr)
                if (type !== "search") {
                    this.createChart(ele, type, dataArr, text, color, isRate);
                } else {
                    if (this.chartView[ele].destroyed) {
                        this.createChart(ele, type, dataArr, text, color, isRate);
                    } else {
                        if (dataArr.length == 0) {
                            this.chartView[ele].destroy();
                        }
                        this.chartView[ele].changeData(dataArr);
                    }
                }
            },
            // 创建图表
            createChart(ele, type, dataArr, text, color, isRate) {
                const blueColor = ['#8EDEFF', '#77D1F6', '#A1D9FF', '#5FA7D8', '#2F74AE'];
                const redColor = ['#FAC5B4', '#F5ADA1', '#F09189', '#FC8282', '#F56C6C'];
                this.chartView[ele] = new Chart({
                    container: ele, // 指定图表容器 ID
                    autoFit: true,
                    height: 220, // 指定图表高度
                    // padding: [0, 25, 35, 55]
                    padding: [0, 55, 45, 75]
                });
                this.chartView[ele].scale({
                    name: {
                        formatter: (value) => {
                            return value.length > 4 ?value.substring(0,4): value;
                        },
                    },
                    num: {
                        alias: text,
                        formatter: (value) => {
                            return value != 0 ? isRate ? value + "%" : value : "";
                        },
                    },

                })
                this.chartView[ele].legend(false);
                this.chartView[ele].coordinate('rect').transpose();
                this.chartView[ele]
                    .interval()
                    .position('name*num')
                    //#F28D3F、#4A93E3  两种图表的颜色
                    .color('num', color === 'red' ? redColor : blueColor) //柱子颜色
                    .label('num', {
                        style: {
                            fill: '#8d8d8d',
                        },
                        offset: 10,
                        content: (obj) => {
                            return obj.num !== 0 ? isRate ? obj.num + "%" : obj.num : "";
                        },
                    })
                    .size(20)
                // .adjust([
                //     {
                //         type: 'dodge',
                //         marginRatio: 0,
                //     },
                // ]);
                this.chartView[ele].axis('num', {
                    title: {
                        offset: 30,
                        style: {
                            fontWeight: 300,
                        },
                    },
                });
                this.chartView[ele].interaction('active-region');
                this.chartView[ele].data(dataArr);
                this.chartView[ele].render();
            },
            //多柱图表
            getMoreChart(ele, dataArr) {
                const chart = new Chart({
                    container: ele, // 指定图表容器 ID
                    autoFit: true,
                    height: 220, // 指定图表高度
                });
                chart.data(dataArr);
                chart.scale('num', {
                    nice: true,
                });
                chart.tooltip({
                    shared: false,
                    showMarkers: false,
                });
                chart.coordinate('rect').transpose();
                chart
                    .interval()
                    .position('name*num')
                    //#F28D3F、#4A93E3  两种图表的颜色
                    // #C2D875、#23B899、#F28D3F
                    .color('type', ['#F28D3F', '#4A93E3']) //柱子颜色
                    .adjust([
                        {
                            type: 'dodge',
                            // marginRatio: 0.3,
                            dodgeBy: 'type'//根据什么分组
                        },
                    ])
                    .size(20)
                    .label('num', { //每列柱子的具体数据
                        style: {
                            fill: '#8d8d8d',
                        },
                        // offset: 10,
                    });

                chart.interaction('active-region');
                chart.render();
            },
            //查看详情
            seeDetail(type, name) {
                // sessionStorage.setItem('staCountFilter', JSON.stringify(this.rankFilterData));
                
                this.$router.push({
                    path: '/dataSta/rankDetail',
                    query: {pageType: type, name: name}
                })
            },
        }
    }
</script>

<style scoped>
    @import "../../assets/css/homePage.css";
</style>