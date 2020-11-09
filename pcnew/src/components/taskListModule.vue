<template>
    <div class="task-list">
        <a-spin :spinning="loading">
            <div class="task-content" v-if="taskList.length > 0">
                <ul class="task-list-ul clear-fix">
                    <li class="task-list-li" v-for="(item,index) in taskList" :key="index"
                        @click="goDetail(item.id,item.look)" :class="item.role === 0 ? 'border-orange' : (item.role === 1 ? 'border-green' : 'border-purple')">
                        <p class="name"><span class="name-text">{{item.title}}</span>
                            <span class="new-task"
                                  v-show="item.look !== 0 && pageType === 'executing' && (item.role === 1 || item.role === 2)">
                                New !</span></p>
                        <div class="option clear-fix">
                            <div class="left">
                                <span class="task-option" v-if="item.role==0">发起</span>
                                <span class="task-option" v-if="item.role==1">接收</span>
                                <span class="task-option" v-if="item.role==2">抄送</span>
                                <div class="hot-level">
                                    <i class="iconfont hot-red" v-for="i in parseInt(item.level) + 1"
                                       :key="i">&#xe619;</i>
                                </div>
                            </div>
                            <div class="right">
                                <span class="status"
                                      :class="'status-'+getStatus(item).class">{{ getStatus(item).text }}</span>
                                <a-icon type="right" class="goDetail"/>
                            </div>
                        </div>
                        <p class="task-time time-red" :class="'time-'+getStatus(item).class">
                            {{ getStatus(item).time }}
                        </p>
                        <p class="create-time">
                            创建时间 {{moment(item.create_time).format("MM月DD日 HH:mm") }}</p>
                    </li>
                </ul>
            </div>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </a-spin>
        <div class="paging" v-show="showPagination">
            <a-pagination :current="pageIndex" :total="pageTotal" :defaultPageSize="pageSize"
                          @change="pageChange" :hideOnSinglePage="true"/>
        </div>
    </div>
</template>

<script>
    import {task} from "@/api";
    import {statistics} from '@/api'
    import moment from 'moment'

    export default {
        name: "taskListModule",
        props: {
            pageType: {type: String, default: 'allTask'},
            filter: {type: Object},
            showPagination: {type: Boolean, default: true},
            countFilter:{type:Object},
            isPeoplesTask:{type: Boolean, default: false},//是否是首页进来的某个人的所有任务
        },
        data() {
            return {
                taskList: [],
                loading: false,
                filterObj: {
                    status: 0,//状态
                    area: 0,//创建时间
                    level: -1,//级别
                    type: 0,//类型
                    areaRecycle: 0,//范围搜索
                    inp: ''//输入框
                },
                countFilterObj:{},
                pageIndex: 1,//当前页
                pageSize: 6,//每页多少条
                pageTotal: 1,//总数据条数
                role: {
                    0: "start",
                    1: "receive",
                    2: "cc",
                },
                status: {
                    0: "grey",
                    1: "blue",
                    2: "red",
                    3: "green",
                },
            }
        },
        watch: {
            //普通任务列表的筛选
            filter: {
                handler(val) {
                   if(val) {
                        this.filterObj = val ? val : this.filterObj;
                        this.getData(1);
                   }
                },
                deep: true,
                immediate: true,
            },
            //统计某人的任务列表
            countFilter:{
                handler(val){
                   if(val) {
                    this.countFilterObj = val;
                    this.getData(1);
                   }
                },
                deep: true,
                immediate: true,
            }

        },
        created(){
            if(!this.filter&&!this.countFilter){
                this.getData();
            }

        },
        methods: {
            moment,
            //获取任务状态
            async getData(isSearch) {
                this.loading = true;
                //判断页面筛选条件
                if (!this.isPeoplesTask){
                    if (isSearch){
                        this.pageIndex = 1
                    }
                    let params = {
                        level: this.filterObj.level,
                        time: this.filterObj.area,
                        titlekey: this.filterObj.inp,
                        num: this.pageSize,
                        page: this.pageIndex,
                    };
                    if (this.pageType === 'recycleBin') {
                        params.type = 3
                    } else if (this.pageType === 'drafts') {
                        params.type = 2
                    } else if (this.pageType === 'finished') {
                        params.type = 1
                    } else if (this.pageType === 'executing') {
                        params.type = 0
                    } else if (this.pageType === 'allTask') {
                        params.type = 4
                    } else if (this.pageType === 'overdueList') {
                        params.type = 7
                    } else if (this.pageType === 'homeFinished') {
                        params.type = 6
                    }
                    if (this.pageType === 'finished' || this.pageType === 'homeFinished' || this.pageType === 'overdueList'
                        || this.pageType === 'executing' || this.pageType === 'allTask') {
                        params.state = this.filterObj.status;
                        params.role = this.filterObj.type
                    }
                    if (this.pageType === 'executing' || this.pageType === 'allTask') {
                        // delete params.time;
                    }
                    if (this.pageType === 'drafts') {
                        delete params.role;
                    }

                    //请求
                    const {code, msg, data} = await task.list(params);
                    if (code === 1) {
                        this.loading = false;
                        this.taskList = [].concat(data.data);
                        this.$emit('getNum',data.data);
                        this.pageTotal = data.total;

                    } else {
                        this.loading = true;
                        this.$message.error(msg, 2)
                    }
                } else {
                    //请求
                    if (isSearch){
                        this.pageIndex = 1
                    }
                    let param = {
                        // people_type:this.filterObj.statUser,
                        userid:this.countFilterObj.userId,
                        role_type:this.countFilterObj.taskRole,
                        status:this.countFilterObj.taskStatus,
                        level:this.countFilterObj.taskLevel,
                        launch_time:this.countFilterObj.startTimeType,
                        l_start_time:this.countFilterObj.sStartTime ?  moment(this.countFilterObj.sStartTime).format('YYYY-MM-DD') : null,
                        l_end_time:this.countFilterObj.sEndTime ? moment(this.countFilterObj.sEndTime).format('YYYY-MM-DD') : null,
                        end_time:this.countFilterObj.endTimeType,
                        e_start_time:this.countFilterObj.eStartTime ?  moment(this.countFilterObj.eStartTime).format('YYYY-MM-DD') : null,
                        // e_end_time:this.filterObj.eEndTime ? moment(this.filterObj.eEndTime).format('YYYY-MM-DD') : null,     role_type:this.filterObj.taskRole,
                        // status:this.filterObj.taskStatus,
                        // level:this.filterObj.taskLevel,
                        // launch_time:this.filterObj.startTimeType,
                        // l_start_time:this.filterObj.sStartTime ?  moment(this.filterObj.sStartTime).format('YYYY-MM-DD') : null,
                        // l_end_time:this.filterObj.sEndTime ? moment(this.filterObj.sEndTime).format('YYYY-MM-DD') : null,
                        // end_time:this.filterObj.endTimeType,
                        // e_start_time:this.filterObj.eStartTime ?  moment(this.filterObj.eStartTime).format('YYYY-MM-DD') : null,
                        // e_end_time:this.filterObj.eEndTime ? moment(this.filterObj.eEndTime).format('YYYY-MM-DD') : null,
                        page:this.pageIndex,
                        limit:this.pageSize
                    };
                    const {code, msg, data} = await statistics.peopleTask(param);
                    if (code === 1) {
                        this.loading = false;
                        this.taskList = [].concat(data.data);
                        // this.$emit('getNum',data.data)
                        this.pageTotal = data.total;
                    } else {
                        this.loading = true;
                        this.$message.error(msg, 2)
                    }
                }

            },
            //分页
            pageChange(current) {
                this.pageIndex = current;
                this.getData();
            },
            // 获取任务状态
            getStatus(item) {
                let start = moment(item.start_time);
                let end = moment(item.end_time);
                let finish = item.finish_time; //整体任务完成时间
                let receiveFinish = item.new_end_time; //接收人完成任务时间
                let now = moment(new Date());
                let totalDay = this.calcDiffDay(start, end);
                item.role = item.role==undefined ? 2 : item.role;
                // let finshDay = this.calcDiffDay(moment(receiveFinish), now); //接送者完成任务剩余天数
                let format = "MM月DD日 HH:mm";
                let time = `${start.format(format)}-${end.format(format)}`;
                let overdueDay =
                    receiveFinish == 0
                        ? this.calcDiffDay(end, now)
                        : this.calcDiffDay(moment(receiveFinish), end);
                if (this.pageType == "drafts") {
                    return {
                        class: this.status[1],
                        text: "",
                        time: `${time} 共${totalDay}天`,
                    };
                }
                //已逾期列表
                if (this.pageType === 'overdueList') {
                    if ((item.role = 0 || item.role) == 2) {
                        overdueDay = finish
                            ? this.calcDiffDay(moment(finish), now)
                            : this.calcDiffDay(end, now);
                    } else {
                        overdueDay =
                            receiveFinish && item.completion > 0
                                ? this.calcDiffDay(moment(receiveFinish), end)
                                : this.calcDiffDay(end, now);
                    }
                    return {
                        class: this.status[2],
                        text: "逾期",
                        time: `${time} 逾期${overdueDay}天`,
                    };
                }
                //回收站
                if (this.pageType === 'recycleBin') {
                    return {
                        class: this.status[0],
                        text: "已取消",
                        time: `${time} 共${totalDay}天`,
                    };
                }
                //已结束
                if (this.pageType === 'finished') {
                    if ((item.role = 0 || item.role) == 2) {
                        overdueDay = finish
                            ? this.calcDiffDay(moment(finish), now)
                            : this.calcDiffDay(end, now);
                    } else {
                        overdueDay =
                            receiveFinish && item.completion > 0
                                ? this.calcDiffDay(moment(receiveFinish), end)
                                : this.calcDiffDay(end, now);
                    }
                    return {
                        class: this.status[3],
                        text: "完成" + item.completion + "%",
                        time: `${time} 共${totalDay}天`,
                    };
                }
                //草稿箱
                if (this.pageType === 'drafts') {
                    return {
                        class: this.status[1],
                        text: "",
                        time: `${time} 共${totalDay}天`,
                    };
                }
                if (item.role == 0 || item.role == 2) {
                    if (item.status == 1) {
                        if (moment(start).isAfter(moment(now))) {
                            return {
                                class: this.status[0],
                                text: "待开始",
                                time: `${time} 共${totalDay}天`,
                            };
                        } else {
                            if (item.finish_time == 0 || item.finish_time == "") {
                                if (moment(now).isAfter(moment(end))) {
                                    return {
                                        class: this.status[2],
                                        text: "逾期" + item.completion + "%",
                                        time: `${time} 逾期${this.calcDiffDay(end, now)}天`,
                                    };
                                } else {
                                    return {
                                        class: this.status[1],
                                        text: item.completion + "%",
                                        time: `${time} 共${totalDay}天`,
                                    };
                                }
                            }

                            if (item.completion < 100 && moment(finish).isAfter(moment(end))) {
                                return {
                                    class: this.status[2],
                                    text: "逾期" + item.completion + "%",
                                    time: `${time} 逾期${this.calcDiffDay(end, moment(finish))}天`,
                                };
                            }
                            if (item.completion == 100) {
                                if (moment(item.finish_time).isAfter(end)) {
                                    return {
                                        class: this.status[2],
                                        text: "逾期完成" + item.completion + "%",
                                        time: `${time} 逾期${this.calcDiffDay(
                                            end,
                                            moment(finish)
                                        )}天`,
                                    };
                                }
                                return {
                                    class: this.status[3],
                                    text: "完成",
                                    time: `${time} 共${totalDay}天`,
                                };
                            }
                            return {
                                class: this.status[1],
                                text: item.completion + "%",
                                time: `${time} 共${totalDay}天`,
                            };
                        }
                    } else {
                        if (
                            item.completion < 100 &&
                            moment(item.finish_time).isAfter(moment(end))
                        ) {
                            return {
                                class: this.status[2],
                                text: "逾期" + item.completion + "%",
                                time: `${time} 逾期${this.calcDiffDay(end, moment(finish))}天`,
                            };
                        }
                        if (item.completion == 100) {
                            if (moment(item.finish_time).isAfter(end)) {
                                return {
                                    class: this.status[2],
                                    text: "逾期完成" + item.completion + "%",
                                    time: `${time} 逾期${this.calcDiffDay(end, moment(finish))}天`,
                                };
                            }
                            return {
                                class: this.status[3],
                                text: "完成",
                                time: `${time} 共${totalDay}天`,
                            };
                        }
                        return {
                            class: this.status[3],
                            text: "完成",
                            time: `${time} 共${totalDay}天`,
                        };
                    }
                }
                if (item.role == 1) {
                    if (item.status == 1) {
                        if (moment(start).isAfter(moment(now))) {
                            return {
                                class: this.status[0],
                                text: "待开始",
                                time: `${time} 共${totalDay}天`,
                            };
                        } else {
                            if (receiveFinish == 0 && moment(now).isAfter(end)) {
                                return {
                                    class: this.status[2],
                                    text: "逾期",
                                    time: `${time} 逾期${overdueDay}天`,
                                };
                            } else {
                                if (item.completion == 0) {
                                    if (moment(now).isAfter(end)) {
                                        return {
                                            class: this.status[2],
                                            text: "逾期",
                                            time: `${time} 逾期${this.calcDiffDay(end, now)}天`,
                                        };
                                    }
                                    return {
                                        class: this.status[1],
                                        text: "进行中",
                                        time: `${time} 剩余${overdueDay}天`,
                                    };
                                }
                                else if (item.completion == 100) {
                                    if (moment(receiveFinish).isBefore(end)) {
                                        return {
                                            class: this.status[3],
                                            text: "已完成",
                                            time: `${time} 剩余${overdueDay}天`,
                                        };
                                    } else {
                                        return {
                                            class: this.status[2],
                                            text: "已逾期完成",
                                            time: `${time} 逾期${overdueDay}天`,
                                        };
                                    }
                                } else {
                                    return {
                                        class: this.status[3],
                                        text: "已完成"+item.completion+"%"
                                    };
                                }
                            }
                        }
                    } else {
                        if (receiveFinish == 0) {
                            return {
                                class: this.status[0],
                                text: "未完成",
                                time: `${time} 共${overdueDay}天`,
                            };
                        }
                        if (moment(receiveFinish).isBefore(now)) {
                            return {
                                class: this.status[3],
                                text: "已完成",
                                time: `${time} 剩余${overdueDay}天`,
                            };
                        } else {
                            return {
                                class: this.status[2],
                                text: "已逾期完成",
                                time: `${time} 逾期${overdueDay}天`,
                            };
                        }
                    }
                }
            },
            //计算时间差
            calcDiffDay(date1, date2) {
                let diffday = date2.diff(date1, "days");
                return Math.abs(Math.floor(diffday * 10) / 10);
            },
            //去任务详情
            goDetail(id,look){
                this.$router.push({
                    path:'/taskDetail/taskDetail',
                    query:{id:id,pageType:this.pageType,look:look}
                })
            }

        }
    }
</script>

<style scoped>
    @import "../assets/css/taskList.css";
</style>
<style scoped lang="less">
    .task-list {
        min-height: 200px;
    }
</style>