<template>
    <div class="home-page">
        <div class="home-page-top">
            <div class="enc-words">
                <p><span>“</span>{{encourageWords}}</p>
            </div>
            <div class="welcome-words-box">
                <p class="welcome-words"><span class="user-name">{{userName}},</span>欢迎进入轻松任务管理系统！</p>
                <div class="deal-num" v-show="noticeNumShow">
                    <img src="@/assets/images/homePage/noticeIcon.png" alt="">
                    <span>你当前有 <strong>{{taskNum}}个</strong> 任务需要处理!</span>
                    <a-button type="link" @click="$router.push('/taskList/executing')">立即处理>></a-button>
                    <a-icon type="close-circle" theme="filled" class="close" @click="noticeNumShow = false" title="关闭"/>
                </div>
            </div>
        </div>
        <div class="split-box"></div>
        <!--急需处理的任务-->
        <div class="section-title">
            <span>急需处理任务</span>
            <div>
                <a-button type="primary" @click="$router.push('/taskDetail/addTask')">发起任务</a-button>
                <a-button @click="$router.push('/taskList/executing')">查看更多</a-button>
            </div>
        </div>
        <div class="split-box split-box-thin"></div>
        <div class="urgent-need">
            <task-list pageType="executing" :show-pagination="false" @getNum="getTaskNum"></task-list>
        </div>
        <div class="split-box"></div>
        <!--任务统计-->
        <div class="section-title">
            <span>任务统计</span>
            <div>
                <a-button type="primary" @click="$router.push('/dataSta/dataScreen')" v-if="userInfo.is_system == 4">轻松任务数据大屏</a-button>
                <a-button @click="$router.push('/dataSta/rankingList')">查看更多</a-button>
            </div>
        </div>
        <div class="split-box split-box-thin"></div>
        <div class="statistics-total">
            <div class="statistics-filter">
                <span class="label-title">统计维度</span>
                <a-radio-group name="level" v-model="myTaskFilter" button-style="solid" @change="getCount">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="1">近一周</a-radio>
                    <a-radio :value="2">近一个月</a-radio>
                </a-radio-group>
                <span class="search-tips">（此筛选条件仅针对“待处理”及“逾期数量”有效）</span>
            </div>
            <div class="content my-task">
                <p class="title">我的任务统计</p>
                <sta-count :count-arr="myTaskCount" :count-role="1"  count-type="myTaskCount" :count-time="myTaskFilter"></sta-count>
            </div>
            <div class="split-box split-box-thin"></div>
            <div class="content" v-if="userInfo.type >= 1">
                <p class="title">我所在的部门任务统计-{{depName}}</p>
                <sta-count :count-arr="departTaskCount" :count-role="2" :count-time="myTaskFilter"></sta-count>
            </div>
            <div class="split-box split-box-thin"></div>
            <div class="content" v-if="userInfo.type == 2">
                <p class="title">全部人员任务统计</p>
                <sta-count :count-arr="allTaskCount" :count-role="0" :count-time="myTaskFilter"></sta-count>
            </div>

        </div>
    </div>
</template>

<script>
    import {backManage} from "@/api";
    import {statistics} from '@/api'
    import taskList from '../components/taskListModule'
    import staCount from '../components/staCountModule'

    export default {
        name: "homePage",
        components: {
            taskList,
            staCount
        },
        data() {
            return {
                myTaskCount: [
                    {
                        path: require('@/assets/images/homePage/myTask1.png'),
                        num: 0,
                        name: '待处理',
                        tipsText: '',
                        tipsText2: '',//0
                        type:1,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask2.png'),
                        num: 0,
                        name: '逾期数量',
                        tipsText: '逾期率0%',
                        tipsText2: '',//1
                        type:2,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask3.png'),
                        num: 0,
                        name: '逾期次数',
                        tipsText: '',
                        tipsText2: '',//2
                        class:'isBan',
                        type:3,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask4.png'),
                        num: 0,
                        name: '完成数量',
                        tipsText: '完成率0%',
                        tipsText2: '按时完成率0%',//3
                        type:4
                    },
                    {
                        path: require('@/assets/images/homePage/myTask5.png'),
                        num: 0,
                        name: '我参与的',
                        tipsText: '本周新增20',
                        tipsText2: '',//4
                        type:5,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask6.png'),
                        num: 0,
                        name: '我发起的',
                        tipsText: '本周新增10',
                        tipsText2: '',//5
                        type:6,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask7.png'),
                        num: 0,
                        name: '任务总数',
                        tipsText: '本周新增30',
                        tipsText2: '',//6
                        type:7
                    },
                ],//我的任务统计
                departTaskCount: [
                    {
                        path: require('@/assets/images/homePage/myTask1.png'),
                        num: 0,
                        name: '待处理',
                        tipsText: '',
                        tipsText2: '',//0
                        type:1,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask2.png'),
                        num: 0,
                        name: '逾期数量',
                        tipsText: '逾期率0%',
                        tipsText2: '',//1
                        type:2
                    },
                    {
                        path: require('@/assets/images/homePage/myTask3.png'),
                        num: 0,
                        name: '逾期次数',
                        tipsText: '',
                        tipsText2: '',//2,
                        class:'isBan',
                        type:3,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask4.png'),
                        num: 0,
                        name: '完成数量',
                        tipsText: '完成率0%',
                        tipsText2: '按时完成率0%',//3
                        type:4
                    },
                    {
                        path: require('@/assets/images/homePage/myTask5.png'),
                        num: 0,
                        name: '部门参与的',
                        tipsText: '本周新增20',
                        tipsText2: '',//4
                        type:5,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask6.png'),
                        num: 0,
                        name: '部门发起的',
                        tipsText: '本周新增10',
                        tipsText2: '',//5
                        type:6,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask7.png'),
                        num: 0,
                        name: '任务总数',
                        tipsText: '本周新增30',
                        tipsText2: '',//6
                        type:7,
                    },
                ],//我所在部门的任务统计
                allTaskCount: [
                    {
                        path: require('@/assets/images/homePage/myTask1.png'),
                        num: 0,
                        name: '待处理',
                        tipsText: '',
                        tipsText2: '',//0
                        type:1,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask2.png'),
                        num: 0,
                        name: '逾期数量',
                        tipsText: '逾期率0%',
                        tipsText2: '',//1
                        type:2,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask3.png'),
                        num: 0,
                        name: '逾期次数',
                        tipsText: '',
                        tipsText2: '',//2
                        class:'isBan',
                        type:3,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask4.png'),
                        num: 0,
                        name: '完成数量',
                        tipsText: '完成率0%',
                        tipsText2: '按时完成率0%',//3
                        type:4,
                    },
                    {
                        path: require('@/assets/images/homePage/myTask7.png'),
                        num: 0,
                        name: '任务总数',
                        tipsText: '本周新增30',
                        tipsText2: '',//4
                        type:7,
                    },
                ],//所有任务统计
                encourageWords: '',//激励语
                taskNum: 0,//需处理的任务数量
                myTaskFilter: 0,//任务统计查询时间
                depName: '',//部门名称,
                userName: "您好",
                noticeNumShow: true,
                userInfo: {
                    type: 0
                }
            }
        },
        watch: {
            userName() {
                this.getUserName();
                this.getCount();
            }
        },
        created() {
            window.addEventListener('setItem', () => {
                this.userName = sessionStorage.getItem('watchStorage');
            });
            let user = JSON.parse(sessionStorage.getItem('userInfo'));
            if (user&&user.name) {
                this.userInfo = user;
                // console.log(this.userInfo);
                this.getCount();
            }
            this.getEncourage();
        },
        methods: {
            //获取激励语
            async getEncourage() {
                const {code, data} = await backManage.randomEncourage();
                if (code) {
                    this.encourageWords = data;
                }
            },
            //获取用户名
            getUserName() {
                let obj = JSON.parse(sessionStorage.getItem('userInfo'));
                this.userName = obj ? obj.name : "";//用户名
                this.userInfo = obj
            },
            //获取任务数量
            getTaskNum(data) {
                this.taskNum = data.length
            },
            //获取任务统计 -（总）
            getCount() {
                // console.log(this.userInfo.type)
                //判断任务统计查看的权限 type 0 只能查看个人 1 查看个人和部门 2 个人部门公司
                if (parseInt(this.userInfo.type) === 0) {
                    this.getMyTaskData();
                } else if (parseInt(this.userInfo.type) === 1) {
                    this.getMyTaskData();
                    this.getMyDepCount();
                } else if (parseInt(this.userInfo.type) === 2) {
                    this.getMyTaskData();
                    this.getMyDepCount();
                    this.getAllTaskCount();
                }
            },
            //获取我的任务统计
            async getMyTaskData() {
                let param = {
                    time: this.myTaskFilter
                };
                const {code, data} = await statistics.getMyTaskCount(param);
                if (code) {
                    let arr = this.myTaskCount;
                    //数量
                    arr[0].num = data.untreated_count;
                    arr[1].num = data.overdue_num;
                    arr[2].num = data.overdue_count;
                    arr[3].num = data.finish_count;
                    arr[4].num = data.partake_count;
                    arr[5].num = data.launch_count;
                    arr[6].num = data.all_total_count;
                    //率
                    arr[1].tipsText = '逾期率' + data.overdue_rate + '%';
                    arr[3].tipsText = '完成率' + data.finish_rate + '%';
                    arr[3].tipsText2 = '按时完成率' + data.ontime_finish_rate + '%';
                    //新增
                    arr[4].tipsText = '本周新增' + data.thisweek_partake_count;
                    arr[5].tipsText = '本周新增' + data.thisweek_launch_count;
                    arr[6].tipsText = '本周新增' + data.thisweek_all_total_count;
                }
            },
            //获取我所在部门的统计
            async getMyDepCount() {
                let param = {
                    time: this.myTaskFilter
                };
                const {code, data} = await statistics.getMyDepCount(param);
                if (code) {
                    this.depName = data.dep_name;
                    let arr = this.departTaskCount;
                    //数量
                    arr[0].num = data.untreated_count;
                    arr[1].num = data.overdue_num;
                    arr[2].num = data.overdue_count;
                    arr[3].num = data.finish_count;
                    arr[4].num = data.dep_partake_count;
                    arr[5].num = data.dep_launch_count;
                    arr[6].num = data.all_total_count;
                    //率
                    arr[1].tipsText = '逾期率' + data.overdue_rate + '%';
                    arr[3].tipsText = '完成率' + data.finish_rate + '%';
                    arr[3].tipsText2 = '按时完成率' + data.ontime_finish_rate + '%';
                    //新增
                    arr[4].tipsText = '本周新增' + data.thisweek_partake_count;
                    arr[5].tipsText = '本周新增' + data.thisweek_launch_count;
                    arr[6].tipsText = '本周新增' + data.thisweek_all_total_count;
                }
            },
            //获取全部任务统计
            async getAllTaskCount() {
                let param = {
                    time: this.myTaskFilter
                };
                const {code, data} = await statistics.getAllTaskCount(param);
                if (code) {
                    let arr = this.allTaskCount;
                    //数量
                    arr[0].num = data.untreated_count;
                    arr[1].num = data.overdue_num;
                    arr[2].num = data.overdue_count;
                    arr[3].num = data.finish_count;
                    arr[4].num = data.all_total_count;
                    //率
                    arr[1].tipsText = '逾期率' + data.overdue_rate + '%';
                    arr[3].tipsText = '完成率' + data.finish_rate + '%';
                    arr[3].tipsText2 = '按时完成率' + data.ontime_finish_rate + '%';
                    //新增
                    arr[4].tipsText = '本周新增' + data.thisweek_all_total_count;
                }
            },

        }
    }
</script>

<style scoped>
    @import "../assets/css/homePage.css";
</style>