<template>
    <div class="report">
        <div class="report-search">
            <div class="task-search-title">
                <span @click="filterBoxShow = !filterBoxShow" :class="filterBoxShow ? '' : 'black'">{{filterBoxShow ? '收起' : '展开'}}筛选  <a-icon
                        :type="filterBoxShow ? 'caret-up' : 'caret-down'"/></span>
            </div>
            <div class="split-box split-box-thin"></div>
            <div class="search-box task-search" v-show="filterBoxShow">
                <div class="search-content search-status">
                    <span class="label-span">报表类型</span>
                    <a-radio-group name="status" v-model="filterObj.type">
                        <a-radio :value="1">周报表</a-radio>
                        <a-radio :value="2">月报表</a-radio>
                    </a-radio-group>
                </div>
                <div class="search-content search-level">
                    <span class="label-span">报表范围</span>
                    <a-radio-group name="level" v-model="filterObj.area" >
                        <a-radio :value="1">个人</a-radio>
                        <a-radio :value="2" v-if="parseInt(userInfo.type) >= 1">部门</a-radio>
                        <a-radio :value="3" v-if="parseInt(userInfo.type) === 2">全员</a-radio>
                    </a-radio-group>
                </div>
                <div class="search-content search-level">
                    <span class="label-span">报表时间</span>
                    <a-month-picker placeholder="请选择时间" v-model="filterObj.time" :allowClear="false"></a-month-picker>
                    <a-select v-model="filterObj.week" style="margin-left: 20px" placeholder="请选择周"
                              v-show="filterObj.type === 1">
                        <a-select-option :value="item.value" v-for="(item,index) in weekArr" :key="index">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </div>
                <a-button type="primary" class="search-btn" @click="getData">搜索</a-button>
            </div>
        </div>

        <div class="report-content">
            <ul class="report-ul" v-if="dataArr.length > 0">
                <li class="report-li" v-for="(item,index) in dataArr" :key="index">
                    <span style="display: none">{{item}}</span>
                    <div class="top">
                        <span class="time-title">{{item.titleTime}}</span>
                        <a-button type="link" @click="seeDeatail(item)">查看详情</a-button>
                    </div>
                    <div class="bottom">
                        <div class="left">
                            <span class="tags person" v-show="item.range == 1">个人</span>
                            <span class="tags dep" v-show="item.range == 2">部门</span>
                            <span class="tags all" v-show="item.range == 3">全员</span>
                        </div>
                        <div class="right">
                            <p class="summary">{{item.summaryText}}</p>
                            <div class="count-list">
                                <p><span class="title">相关任务总数</span><span class="num">{{item.total_count}}</span></p>
                                <p><span class="title">我发起的任务数</span><span class="num">{{item.total_count}}</span></p>
                                <p><span class="title">逾期任务数</span><span class="num">{{item.overdue_num}}</span></p>
                                <p><span class="title">逾期率</span><span class="num">{{item.overdue_rate}}%</span></p>
                            </div>
                            <p class="encourage-words">{{item.excitation}}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
            <a-modal :title="dataObj.titleTime"
                     :visible=" modalShow" :centered="true" :destroyOnClose="true"
                     @ok=" modalShow = false" @cancel="modalShow = false">
                <div class="modal-content">
                    <p class="summary-text">{{dataObj.summaryText}}</p>
                    <div class="count-list">
                        <p><span class="title">相关任务总数</span><span class="num">{{dataObj.total_count}}</span></p>
                        <p><span class="title">我发起的任务数</span><span class="num">{{dataObj.total_count}}</span></p>
                        <p><span class="title">逾期任务数</span><span class="num">{{dataObj.overdue_num}}</span></p>
                        <p><span class="title">逾期率</span><span class="num">{{dataObj.overdue_rate}}%</span></p>
                    </div>
                    <p class="status">{{dataObj.overdue_num > 0 ? '当前有' + dataObj.overdue_num + '个逾期任务'
                        :'当前没有逾期任务'}}</p>
                    <p class="status">本周任务按时完成率为{{dataObj.ontime_finish_rate > 0 ? dataObj.ontime_finish_rate : 0}}%</p>
                    <!--                    <p class="status-desc">(结束时间在本周的任务≥1:当前没有逾期任务，本周完成任务按时完成率为{{dataObj.ontime_finish_rate > 0 ? dataObj.ontime_finish_rate : 0}}%）</p>-->
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import {statistics} from '@/api'

    export default {
        name: "MonthlyReport",
        data() {
            return {
                filterBoxShow: true,
                filterObj: {
                    type: 2,
                    area: 1,
                    time: moment(new Date(), 'YYYY-MM'),
                    week: 1
                },
                dataArr: [],
                weekArr: [
                    {value: 1, label: '第1周'},
                    {value: 2, label: '第2周'},
                    {value: 3, label: '第3周'},
                    {value: 4, label: '第4周'},
                    {value: 5, label: '第5周'},
                ],
                modalShow: false,
                dataObj: {
                    excitation: "加油加油",
                    launch_count: "0",
                    month: "01",
                    ontime_finish_rate: 0,
                    overdue_num: "0",
                    overdue_rate: 0,
                    range: "1",
                    summaryText: "本月任务执行情况不是很理想，继续努力哦！",
                    summary_type: 2,
                    theweek_end_count: "0",
                    titleTime: "2020年01月第1周",
                    total_count: "0",
                    week: "1",
                    year: "2020"
                },//弹窗数据
                userInfo: {
                    type: 0
                }
            }
        },
        mounted() {
            const {year, month, week, rang} = this.$route.query;
            if (year != "null" && month != "null" && rang) {
                this.filterObj.type = parseInt(rang);
                this.filterObj.time = moment(`${year}-${month}`);
                this.filterObj.week = week ? parseInt(week) : 4;
            }
            this.getData();
            window.addEventListener('setItem', () => {
                this.userName = sessionStorage.getItem('watchStorage');
                this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            });
            let user = JSON.parse(sessionStorage.getItem('userInfo'));
            if (user && user.name) {
                this.userInfo = user;
            }
        },
        methods: {
            //获取数据
            async getData() {
                let time = this.filterObj.time ? moment(this.filterObj.time).format('YYYY-MM') : '';
                let params = {
                    type: this.filterObj.type,
                    range: this.filterObj.area,
                    year: time ? time.split('-')[0] : '',
                    month: time ? time.split('-')[1] : '',
                }
                if (this.filterObj.type === 1) {
                    params.week = this.filterObj.week
                }
                const {code, msg, data} = await statistics.summary(params)
                if (code) {
                    this.dataArr = [].concat(data)
                    if (this.dataArr.length > 0) {
                        this.dataArr.forEach(item => {
                            item.titleTime = item.year + '年' + item.month + '月第' + item.week + '周'
                            if (item.summary_type === 1){
                                item.summaryText = '本周的任务执行情况非常优秀，再接再厉！'
                            } else  if (item.summary_type === 2){
                                item.summaryText = '本周任务执行情况不是很理想，继续努力哦！'
                            }else  if (item.summary_type === 3){
                                item.summaryText = '目前还没有相关任务，快来体验吧！'
                            }else {
                                item.summaryText = ''
                            }
                        })
                    }

                } else {
                    this.$message.error(msg, 2)
                }
            },
            //查看详情
            seeDeatail(data) {
                this.dataObj = data;
                this.modalShow = true;
            },
            //弹窗确定
            modalSure() {

            },
        }
    }
</script>

<style scoped lang="less">
    .report {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        background-color: #F5F7FA;
    }

    .report-search {
        background-color: #fff;
        padding-bottom: 20px;
    }

    .report-content {
        width: 100%;
        margin-top: 20px;

        .report-ul {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .report-li {
                width: 23%;
                margin-right: 2%;
                height: 260px;
                background: #FFFFFF;
                box-shadow: 0 2px 12px rgba(48, 49, 51, 0.06);
                opacity: 1;
                border-radius: 4px;
                box-sizing: border-box;
                padding: 15px;
                margin-bottom: 20px;

                .top {
                    height: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #E8E8E8;
                    line-height: 24px;
                    margin-bottom: 10px;

                    .time-title {
                        color: #909399;
                        font-weight: 500;
                    }

                    /deep/ .ant-btn {
                        padding: 0;
                    }
                }

                .bottom {
                    width: 100%;
                    height: 200px;
                    display: flex;

                    .left {
                        width: 52px;
                        height: 200px;
                        margin-right: 10px;

                        .tags {
                            width: 52px;
                            height: 26px;
                            border-radius: 2px;
                            font-size: 13px;
                            text-align: center;
                            display: block;
                            line-height: 26px;
                        }

                        .person {
                            background: #FFF6E8;
                            color: #FCA822;
                        }

                        .dep {
                            background: #DFF0FF;
                            color: #0082EF;
                        }

                        .all {
                            color: #39D513;
                            background: #EDFCEA;
                        }
                    }

                    .right {
                        .summary {
                            width: 100%;
                            font-size: 16px;
                            font-weight: bold;
                            line-height: 22px;
                            color: #3F434E;
                            margin-bottom: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2; //行数
                            -webkit-box-orient: vertical;
                        }

                        .count-list {
                            margin-bottom: 10px;

                            p {
                                line-height: 23px;
                            }

                            .title {
                                font-size: 13px;
                                color: #909399;
                                margin-right: 10px;
                            }

                            .num {
                                font-size: 13px;
                                font-weight: bold;
                                line-height: 18px;
                                color: #1F305B;
                            }
                        }

                        .encourage-words {
                            width: 100%;
                            font-size: 13px;
                            font-weight: 500;
                            line-height: 20px;
                            color: #C8AF87;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2; //行数
                            -webkit-box-orient: vertical;
                        }
                    }
                }
            }

            .report-li:nth-child(4n) {
                margin-right: 0;
            }
        }
    }

    .modal-content {
        width: 100%;
        min-height: 300px;

        .summary-text {
            width: 100%;
            font-size: 16px;
            font-weight: bold;
            line-height: 22px;
            color: #3F434E;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; //行数
            -webkit-box-orient: vertical;
        }

        .count-list {
            width: 100%;
            background-color: #F5F6FB;
            border-radius: 4px;
            padding: 10px;
            margin-top: 20px;
            margin-bottom: 10px;

            p {
                height: 33px;
                line-height: 33px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 15px;
                font-weight: 500;
                box-sizing: border-box;


                .title {
                    color: #A2A8C5;
                }

                .num {
                    color: #1F305B;
                }
            }
        }

        .status {
            font-size: 15px;
            font-weight: bold;
            line-height: 24px;
            color: #72737E;
        }

        .status-desc {
            font-size: 14px;
            font-weight: 500;
            line-height: 24px;
            color: #C0C4CC;
        }
    }
</style>