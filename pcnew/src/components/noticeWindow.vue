<template>
    <div>
        <a-modal title="提醒模式" :visible.sync="_show"
                 @ok="handleOk" @cancel="handlerCancle" width="700px">
            <div class="notice-window">
                <a-tabs v-model="noticeType">
                    <a-tab-pane :key="1" tab="基础模式">
                        <ul class="notice-list">
                            <li v-for="(item,index) in baseArr" :key="index">
                                <span>{{item.name}}</span>
                                <a-switch v-model="item.checked"/>
                            </li>
                            <hr>
                            <li>
                                <span>重复提醒</span>
                                <a-switch v-model="isRepeat"/>
                            </li>
                        </ul>
                        <div class="notice-repeat" v-show="isRepeat">
                            <div class="notice-repeat-item">
                                <div class="left">
                                    <span>提醒频率</span>
                                </div>
                                <div class="right">
                                    <a-radio-group name="type" v-model="rateType" button-style="solid">
                                        <a-radio-button :value="1">每天</a-radio-button>
                                        <a-time-picker v-model="dailyTime" :inputReadOnly="true"
                                                       format="HH:mm" :minuteStep="30"/>
                                        <br>
                                        <a-radio-button :value="2">每周</a-radio-button>
                                        <a-select placeholder="请选择周"
                                                  v-model="weekChecked">
                                            <a-select-option v-for="(item,index) in week" :value="item.value"
                                                             :key="index">{{item.label}}
                                            </a-select-option>
                                        </a-select>
                                        <a-time-picker v-model="weeklyTime" :inputReadOnly="true"
                                                       format="HH:mm" :minuteStep="30"/>
                                        <br>
                                        <a-radio-button :value="3">每月</a-radio-button>
                                        <a-select placeholder="请选择日"
                                                  v-model="dayChecked">
                                            <a-select-option v-for="item in 31" :value="item" :key="item">{{item+'号'}}
                                            </a-select-option>
                                        </a-select>
                                        <a-time-picker v-model="monthlyTime" :inputReadOnly="true"
                                                       format="HH:mm" :minuteStep="30"/>
                                    </a-radio-group>

                                </div>
                            </div>
                            <div class="notice-repeat-item">
                                <div class="left">
                                    <span>提醒人</span>
                                </div>
                                <div class="right">
                                    <a-select placeholder="请选择" v-model="peopleArrChecked" style="width: 150px">
                                        <a-select-option v-for="(item,index) in peopleArr" :value="item.value"
                                                         :key="index">{{item.label}}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane :key="2" tab="自定义提醒" force-render>
                        <ul class="notice-list">
                            <li v-for="(v,i) in diyArr" :key="'diy'+i" v-show="v.operate_type != 3">
                                <a-select placeholder="请选择阶段" width="110"
                                          v-model="v.custom_type">
                                    <a-select-option v-for="(item,index) in taskStage" :value="item.value" :key="index">
                                        {{item.label}}
                                    </a-select-option>
                                </a-select><!---->
                                <a-select placeholder="请选择时间" width="110"
                                          v-show="v.custom_type === 2 || v.custom_type === 3  || v.custom_type === 7 || v.custom_type === 5"
                                          v-model="v.num">
                                    <a-select-option v-for="item in timeNum" :value="item" :key="item">{{item}}
                                    </a-select-option><!--时间间隔-->
                                </a-select>
                                <a-select placeholder="请选择单位"
                                          v-show="v.custom_type === 2 || v.custom_type === 3  || v.custom_type === 7 || v.custom_type === 5"
                                          v-model="v.num_type">
                                    <a-select-option v-for="(item,index) in timeUnit" :value="item.value" :key="index"
                                                     :title="item.value">
                                        {{item.label}}
                                    </a-select-option><!--时间单位-->
                                </a-select>
                                <!--自定义提醒-自定义时间-->
                                <a-date-picker format="YYYY-MM-DD" v-model="v.diyDate" :allowClear="false"
                                               :inputReadOnly="true"
                                               :disabled-date="disabledDate" v-show="v.custom_type === 8"/><!--年 月 日-->
                                <a-time-picker v-show="v.custom_type === 8" v-model="v.diyTime" :allowClear="false"
                                               :inputReadOnly="true"
                                               format="HH:mm"/><!--时、分-->
                                <a-select placeholder="请选择人员范围" style="width: 150px"
                                          v-model="v.reminder">
                                    <a-select-option v-for="(item,index) in peopleArr" :value="item.value" :key="index">
                                        {{item.label}}
                                    </a-select-option>
                                </a-select>
                                <a-icon type="minus-circle" class="del" theme="filled" title="删除" @click="delDiy(i)"/>
                            </li>
                        </ul>
                        <a-button type="primary" class="add-notice-type" @click="addDiy" v-if="addBtnShow">
                            <a-icon type="plus"/>
                        </a-button>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import {deepClone} from "@/assets/js/common";

    export default {
        name: "noticeWindow",
        props: {
            noticeData: {
                type: Object,
            },
            noticeWindowShow: {
                type: Boolean,
                default: false
            },
            pageType: {
                type: String,
                defaule: '',
            }
        },
        data() {
            return {
                /*基础模式*/
                baseArr: [
                    {
                        name: "任务开始前30分钟提醒所有人",
                        value: 1,
                        checked: true,
                    },
                    {
                        name: "任务截至前30分钟提醒未完成任务人及发起人",
                        value: 2,
                        checked: true,
                    },
                    {
                        name: "主任务进度通知发起人",
                        value: 3,
                        checked: true,
                    },
                    {
                        name: "子任务进度通知发起人",
                        value: 4,
                        checked: true,
                    },
                    {
                        name: "主任务完成提醒发起人",
                        value: 5,
                        checked: true,
                    },
                ], // 基础模式的开关数组
                isRepeat: false, //是否可以重复
                /*提醒频率*/
                week: [
                    {value: 1, label: '星期一'},
                    {value: 2, label: '星期二'},
                    {value: 3, label: '星期三'},
                    {value: 4, label: '星期四'},
                    {value: 5, label: '星期五'},
                    {value: 6, label: '星期六'},
                    {value: 7, label: '星期天'},
                ],//周数组
                peopleArr: [
                    {value: 6, label: '所有人员'},
                    {value: 1, label: '发起人'},
                    {value: 2, label: '接收人'},
                    {value: 3, label: '抄送人'},
                    {value: 4, label: '未阅读人员'},
                    {value: 5, label: '任务未完成人员'},
                    {value: 7, label: '仅发起人和接收人'},
                ], //人员数组:1.发起人2.接收人3.抄送人4.未阅读人5.任务未完成人员6.所有人7.仅发起人和接收人
                /*自定义提醒*/
                taskStage: [
                    {value: 1, label: '任务开始时'},
                    {value: 2, label: '任务开始前'},
                    {value: 3, label: '任务开始后'},
                    {value: 4, label: '任务完成时'},
                    {value: 5, label: '任务逾期后'},
                    {value: 6, label: '任务截止时'},
                    {value: 7, label: '任务截止后'},
                    {value: 8, label: '自定义时间'},
                ],//任务阶段
                timeNum: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],//时间数组
                timeUnit: [
                    {value: 1, label: '分钟'},
                    {value: 2, label: '小时'},
                    {value: 3, label: '天'},
                ],

                /*自定义提醒结束*/
                //基础模式选中数据
                noticeType: 1,//提醒模式类型-tabs
                baseChecked: [1, 2, 3, 4, 5],//基础模式选中的
                rateType: 1,//提醒频率 天、周、月
                peopleArrChecked: 1, //基础模式-人员选中
                dailyTime: null,//天-时间
                weekChecked: 1,//周
                weeklyTime: '',//周-时间
                monthlyTime: null,//月-时间
                dayChecked: 1,//月
                baseId: null,
                //自定义提醒数据
                diyArr: [{
                    id: null,
                    custom_type: 2,//任务阶段选中
                    num_type: 1,//时间间隔单位
                    num: 5,//时间间隔
                    date: null,//年月日-后台字段
                    custom_hour: null,//时、分-后台字段
                    diyDate: moment(new Date()),//年月日-前端字段
                    diyTime: moment(new Date()),//年月日-前端字段
                    reminder: 6,//人员范围
                    operate_type: 1,//类型  this.pageType === 'addTask' ? 1 : 2
                }],//自定义提醒数组--最多十条
                addBtnShow: true,
            }
        },
        computed: {
            _show: {
                get: function () {
                    return this.noticeWindowShow;
                },
                set: function (val) {
                    this.$emit("update:noticeWindowShow", val);
                }
            },
        },
        watch: {
            //监听noticeData避免数据冲突 回显数据
            _show: {
                handler(show) {
                    // console.log(val)
                    console.log(this.noticeData)
                    if (show) {
                        let val = this.noticeData;
                        this.noticeType = val.remind_type
                        if (val.remind_type == 3) {
                            this.noticeType = 1
                        }
                        if (this.noticeType === 2) {
                            //自定义模式
                            if (val.remind_data && val.remind_data.length > 0) {
                                if (val.remind_data.length >= 10) {
                                    this.addBtnShow = false
                                }
                                val.remind_data.forEach(item => {
                                    item.diyDate = item.date ? moment(item.date, 'YYYY-MM-DD') : null;
                                    item.diyTime = item.custom_hour ? moment(item.custom_hour, 'HH:mm') : null;
                                    item.custom_type = parseInt(item.custom_type);
                                    item.num_type = parseInt(item.num_type);
                                    if (item.id) {
                                        item.operate_type = 2
                                    }
                                })
                            }
                            this.diyArr = [].concat(val.remind_data)
                            // console.log(this.diyArr)
                        } else if (this.noticeType === 1) {
                            //基础模式
                            let obj = val.remind_data[0]
                            if (obj) {
                                this.baseChecked = obj.default_type.split(',');
                                if (this.baseChecked.length > 0) {
                                    this.baseArr.forEach((v) => {
                                        if (this.baseChecked.indexOf(v.value + '') > -1) {
                                            v.checked = true;
                                        } else {
                                            v.checked = false;
                                        }
                                    })
                                }
                                this.isRepeat = obj.is_re_reminder === 1 ? true : false;
                                this.rateType = obj.rate
                                this.baseId = obj.id
                                this.peopleArrChecked = obj.reminder
                                if (obj.rate === 1) {
                                    this.dailyTime = obj.default_hour ? moment(obj.default_hour, 'HH:mm') : null
                                } else if (obj.rate === 2) {
                                    this.weeklyTime = obj.default_hour ? moment(obj.default_hour, 'HH:mm') : null
                                    this.weekChecked = obj.week
                                } else if (obj.rate === 3) {
                                    this.monthlyTime = obj.default_hour ? moment(obj.default_hour, 'HH:mm') : null
                                    this.dayChecked = obj.num
                                }
                            }

                        }
                    }
                    return false


                },
                deep: true
            },
            diyArr(val){
                if (val.length >= 10){
                    this.addBtnShow = false
                    this.$message.warning('自定义提醒最多十条！', 3)
                }
            },
        },
        methods: {
            moment,
            //弹窗确定
            handleOk() {
                //基础模式
                if (this.noticeType === 1) {
                    let data = {
                        remind_type: null,
                        remind_data: []
                    };
                    let _default_type = []
                    this.baseArr.forEach(item => {
                        if (item.checked) {
                            _default_type.push(item.value)
                        }
                    })
                    let obj = {
                        id: this.baseId,
                        default_type: _default_type.join(','),
                        is_re_reminder: this.isRepeat ? 1 : 2,
                        rate: this.rateType,
                        reminder: this.peopleArrChecked,
                        operate_type: this.baseId ? 2 : 1,//操作类型1新增2修改3删除
                    }
                    if (this.rateType === 1) {
                        obj.default_hour = this.dailyTime ? moment(this.dailyTime).format('HH:mm') : null
                    } else if (this.rateType === 2) {
                        obj.default_hour = this.weeklyTime ? moment(this.weeklyTime).format('HH:mm') : null
                        obj.week = this.weekChecked
                    } else if (this.rateType === 3) {
                        obj.default_hour = this.monthlyTime ? moment(this.monthlyTime).format('HH:mm') : null
                        obj.num = this.dayChecked
                    }
                    if (this.isRepeat && (this.rateType === 1 || this.rateType === 2 || this.rateType === 3) && !obj.default_hour) {
                        this.$message.error('时间不能为空', 2)
                    } else {
                        data = {
                            remind_type: this.noticeType,
                            remind_data: [obj]
                        }
                        // console.log(data);
                        this.$emit('done', data)
                        this._show = false;
                    }

                } else {
                    let data2 = {
                        remind_type: null,
                        remind_data: []
                    };
                    //自定义模式
                    //处理自定义时间的年月日、时分
                    let arr = deepClone(this.diyArr)
                    if (arr.length > 0) {
                        arr.forEach(item => {
                            item.date = item.diyDate ? moment(item.diyDate).format('YYYY-MM-DD') : null;
                            item.custom_hour = item.diyTime ? moment(item.diyTime).format('HH:mm') : null;
                            delete item.diyDate
                            delete item.diyTime
                        })
                        data2 = {
                            remind_type: this.noticeType,
                            remind_data: arr
                        }
                        this.$emit('done', data2)
                        this._show = false;
                    } else {
                        this.$message.error('请至少选择一条数据')
                    }
                }

            },
            //时间显示
            disabledDate(current) {
                // return current && current <= moment().endOf('yesterday');
                return current && current < moment().subtract(1, 'days');//“今天”的日期可以显示
            },
            //添加一条自定义
            addDiy() {
                if (this.diyArr.length >= 10) {
                    this.addBtnShow = false;
                    this.$message.warning('自定义提醒最多十条！', 3)
                }else {
                    let obj = {
                        id: null,
                        custom_type: 2,//任务阶段选中
                        num_type: 1,//时间间隔单位
                        num: 5,//时间间隔
                        date: null,//年月日-后台字段
                        custom_hour: null,//时、分-后台字段
                        diyDate: moment(new Date()),//年月日-前端字段
                        diyTime: moment(new Date()),//年月日-前端字段
                        reminder: 6,//人员范围
                        operate_type: 1,
                    }
                    this.diyArr.push(obj)
                }



            },
            //删除当前项
            delDiy(index) {
                if (this.pageType === 'addTask') {
                    this.diyArr.splice(index, 1)
                } else if (this.pageType === 'editTask') {
                    this.diyArr[index].operate_type = 3
                    this.$forceUpdate()
                }

            },
            handlerCancle() {
                // console.log(this.isRepeat)
                // this._show = false;
                // let data2 = {
                //         remind_type: null,
                //         remind_data: []
                //     };
                // let arr = deepClone(this.diyArr)
                if (this.diyArr.length > 0) {
                    this.diyArr.forEach(item => {
                        item.date = item.diyDate ? moment(item.diyDate).format('YYYY-MM-DD') : null;
                        item.custom_hour = item.diyTime ? moment(item.diyTime).format('HH:mm') : null;
                        delete item.diyDate
                        delete item.diyTime
                    })
                    this._show = false;
                    //     data2 = {
                    //         remind_type: this.noticeType,
                    //         remind_data: arr
                    //     }
                    // this.$emit('done', data2)
                    // this._show = false;
                }
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/addTask.css";
</style>
<style scoped lang="less">
    /deep/ .notice-window .ant-select {
        min-width: 60px;
    }

    /deep/ .ant-modal {
        width: 700px;
    }


    .notice-list {
        li {
            display: flex;
            justify-content: space-between;
        }

    }
</style>