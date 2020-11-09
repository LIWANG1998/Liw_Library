<template>
    <div>
        <div class="task-search-title">
            <span @click="filterBoxShow = !filterBoxShow" :class="filterBoxShow ? '' : 'black'">{{filterBoxShow ? '收起' : '展开'}}筛选  <a-icon
                    :type="filterBoxShow ? 'caret-up' : 'caret-down'"/></span>
        </div>
        <div class="split-box split-box-thin"></div>
        <div class="search-box task-search" v-show="filterBoxShow">
            <div class="search-content search-status" v-show="(!rankTask && !rankCount)">
                <span class="label-span">人员范围</span>
                <a-radio-group name="status" v-model="dataObj.statUser">
                    <!--                    <a-radio :value="1">全部</a-radio>-->
                    <a-radio :value="1">我的</a-radio>
                    <a-radio :value="2" v-if="parseInt(userInfo.type) > 0">部门</a-radio>
                    <a-radio :value="0" v-if="parseInt(userInfo.type) > 1">全部</a-radio>
                    <a-radio :value="3" v-if="parseInt(userInfo.type) > 0">自定义用户</a-radio>
                </a-radio-group>
                <a-button v-show="dataObj.statUser === 3" @click="startUserWindow = true">选择人员</a-button>
                <span v-show="dataObj.statUser === 3" class="user-span">已选{{startUserList.length}}人</span>
            </div>
            <div class="search-content search-status" v-show="rankCount">
                <span class="label-span">排行维度</span>
                <a-radio-group name="status" v-model="dataObj.statUser">
                    <!--                    <a-radio :value="1">全部</a-radio>-->
                    <a-radio :value="1">个人</a-radio>
                    <a-radio :value="2">部门</a-radio>
                    <!--                    <a-radio :value="0">公司</a-radio>-->
                    <a-radio :value="3" v-if="parseInt(userInfo.type) > 0">自定义用户</a-radio>
                </a-radio-group>
                <a-button v-show="dataObj.statUser === 3" @click="startUserWindow = true">选择人员</a-button>
                <span v-show="dataObj.statUser === 3" class="user-span">已选{{startUserList.length}}人</span>
            </div>
            <!-- <div class="search-content search-level" v-show="!rankCount && !rankTask">
                <span class="label-span">任务角色</span>
                <a-radio-group name="level" v-model="dataObj.taskRole">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="1">发起</a-radio>
                    <a-radio :value="2">接收</a-radio>
                    <a-radio :value="3">抄送</a-radio>
                </a-radio-group>
            </div> -->
            <div class="search-content search-level" v-show="!rankCount && !rankDetail&&!rankList">
                <span class="label-span">任务角色</span>
                <a-checkbox :checked="isRoleAll" @change="roleAllChange">全部</a-checkbox>
                <a-checkbox-group name="level" v-model="roleChecked" @change="roleChange">
                    <a-checkbox :value="1">发起</a-checkbox>
                    <a-checkbox :value="2">接收</a-checkbox>
                    <a-checkbox :value="3">抄送</a-checkbox>
                </a-checkbox-group>
            </div>
            <div class="search-content search-level" v-show="!rankCount && !rankDetail && !rankList">
                <span class="label-span">任务状态</span>
                <a-checkbox :checked="isStatusAll" @change="statusAllChange">全部</a-checkbox>
                <a-checkbox-group name="level" v-model="statusChecked" @change="statusChange">
                    <!--                    <a-checkbox :value="1">全部</a-checkbox>-->
                    <a-checkbox :value="1">待开始</a-checkbox>
                    <a-checkbox :value="2">执行中</a-checkbox>
                    <a-checkbox :value="3">逾期已完成</a-checkbox>
                    <a-checkbox :value="5">逾期未完成</a-checkbox>
                    <a-checkbox :value="4">已完成</a-checkbox>
                </a-checkbox-group>
            </div>
            <div class="search-content search-level" v-show="!rankDetail">
                <span class="label-span">任务级别</span>
                <a-checkbox :checked="isLevelAll" @change="levelAllChange">全部</a-checkbox>
                <a-checkbox-group name="level" v-model="levelChecked" @change="levelChange">
                    <!--                    <a-checkbox :value="-1">全部</a-checkbox>-->
                    <a-checkbox :value="0">普通</a-checkbox>
                    <a-checkbox :value="1">紧急</a-checkbox>
                    <a-checkbox :value="2">非常紧急</a-checkbox>
                </a-checkbox-group>
            </div>
            <div class="search-content search-time">
                <span class="label-span">发起时间</span>
                <a-radio-group name="type" v-model="dataObj.startTimeType">
                    <a-radio :value="0">不限</a-radio>
                    <a-radio :value="1">近一周</a-radio>
                    <a-radio :value="2">近一个月</a-radio>
                    <a-radio :value="3">自定义</a-radio>
                </a-radio-group>
                <div style="display: inline-block" v-show="dataObj.startTimeType === 3">
                    <a-date-picker
                            :allowClear="false"
                            v-model="dataObj.sStartTime"
                            :inputReadOnly="true"
                            format="YYYY-MM-DD"
                            @change="stratTimeChange"
                            placeholder="开始时间"/>
                    -
                    <a-date-picker
                            :allowClear="false"
                            v-model="dataObj.sEndTime"
                            :inputReadOnly="true"
                            :disabled-date="disabledEndDate"
                            format="YYYY-MM-DD"
                            @change="endTimeChange"
                            placeholder="结束时间"/>
                </div>
            </div>
            <div class="search-content search-time">
                <span class="label-span">结束时间</span>
                <a-radio-group name="areaRecycle" v-model="dataObj.endTimeType">
                    <a-radio :value="0">不限</a-radio>
                    <a-radio :value="1">近一周</a-radio>
                    <a-radio :value="2">近一个月</a-radio>
                    <a-radio :value="3">自定义</a-radio>
                </a-radio-group>
                <div style="display:inline-block" v-show="dataObj.endTimeType === 3">
                    <a-date-picker
                            :allowClear="false"
                            v-model="dataObj.eStartTime"
                            :inputReadOnly="true"
                            format="YYYY-MM-DD"
                            @change="stratTimeChange2"
                            placeholder="开始时间"/>
                    -
                    <a-date-picker
                            :allowClear="false"
                            v-model="dataObj.eEndTime"
                            :inputReadOnly="true"
                            :disabled-date="disabledEndDate2"
                            format="YYYY-MM-DD"
                            @change="endTimeChange2"
                            placeholder="结束时间"/>
                </div>
                <a-button type="primary" class="filter-search-btn" @click="search">搜索</a-button>
            </div>

        </div>
        <!--发起人员选人的弹窗-->
        <pick-user :show.sync="startUserWindow" :selected-user="startUserList" @done="getStartUser" :is-data="1"></pick-user>
    </div>

</template>

<script>

    import PickUser from "./pickUser";

    export default {
        name: "filterComponents",
        components: {PickUser},
        props: {
            rankCount: {//汇总排行榜-排行榜的筛选
                type: Boolean,
                default: false
            },
            rankTask: {//任务排行榜
                type: Boolean,
                default: false
            },
            rankDetail:{//排行详情-xx
                type: Boolean,
                default: false
            },
            rankList:{
                type: Boolean,
                default: false
            },
            backObj: {
                type: Object
            }
        },
        data() {
            return {
                filterBoxShow: true,
                dataObj: {
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
                isStatusAll: true,//状态是否全选
                isLevelAll: true,//级别是否全选
                isRoleAll: true,//角色状态是否全选
                roleChecked: [1, 2, 3],//角色状态多选
                statusChecked: [1, 2, 3, 4,5],//状态选中
                levelChecked: [0, 1, 2],//级别选中
                startUserWindow: false,//发起人选人的弹窗
                stratUserText: '',//发起人员名字串
                startUserList: [],//发起人员列表
                userInfo: JSON.parse(sessionStorage.getItem('userInfo'))//用户信息
            }
        },
        watch: {
            // backObj: {
            //     handler(val) {
            //         console.log(val)
            //     },
            //     deep: true,
            // },
            roleChecked(val) {
                this.isRoleAll = val.length === 3
            },
            statusChecked(val) {
                this.isStatusAll = val.length === 5
            },
            levelChecked(val) {
                this.isLevelAll = val.length === 3
            },
        },
        created() {
            if (this.backObj) {
                this.getPropsObj(this.backObj)
                // console.log(this.backObj)
            }
        },
        methods: {
            //处理传进来的值
            getPropsObj(val) {
                // console.log(val)
                if (val) {
                    console.log(val);
                    let pageObj = this.dataObj
                    pageObj.statUser = val.statUser;
                    pageObj.strarUserId = val.strarUserId;
                    pageObj.taskLevel = val.taskLevel === -1 ? '0,1,2' : val.taskLevel;
                    pageObj.taskStatus = val.taskStatus;
                    pageObj.startTimeType = val.startTimeType;
                    pageObj.sStartTime = val.sStartTime;
                    pageObj.sEndTime = val.sEndTime;
                    pageObj.endTimeType = val.endTimeType;
                    pageObj.eStartTime = val.eStartTime;
                    pageObj.eEndTime = val.eEndTime;
                    this.roleChecked = val.taskRole ? val.taskRole.split(',').map(Number) : [1, 2, 3]
                    this.statusChecked = val.taskStatus ? val.taskStatus.split(',').map(Number) : [1,2, 3, 4,5]
                    this.levelChecked = val.taskLevel ? val.taskLevel.split(',').map(Number) : [2, 3, 4]
                    if (pageObj.strarUserId) {
                        let arr = JSON.parse(sessionStorage.getItem('diyUser'))
                        this.startUserList = [].concat(arr)
                    }
                }
            },
            //发起人-选人数据
            getStartUser(data) {
                if (data.userId && data.userId.length > 0) {
                    this.dataObj.strarUserId = data.userId.join(',')
                }
                if (data.user && data.user.length > 0) {
                    let text = []
                    this.startUserList = [].concat(data.user)
                    data.user.forEach(item => {
                        text.push(item.name)
                    })
                    this.stratUserText = text.join(',')
                } else {
                    this.stratUserText = ''
                    this.startUserList = []
                }
            },
            //开始时间--结束时间限制
            disabledEndDate(endValue) {
                const startValue = this.dataObj.sStartTime;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            //开始时间--开始时间改变时
            stratTimeChange(value) {
                this.dataObj.sStartTime = value
            },
            //开始时间--结束时间改变时
            endTimeChange(value) {
                this.dataObj.sEndTime = value
            },
            //结束时间--结束时间限制
            disabledEndDate2(endValue) {
                const startValue = this.dataObj.eStartTime;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            //结束时间--开始时间改变时
            stratTimeChange2(value) {
                this.dataObj.eStartTime = value
            },
            //结束时间--结束时间改变时
            endTimeChange2(value) {
                this.dataObj.eEndTime = value
            },
            //状态全选
            statusAllChange(e) {
                if (e.target.checked) {
                    this.statusChecked = [1, 2, 3, 4,5]
                    this.isStatusAll = true
                } else {
                    this.statusChecked = []
                    this.isStatusAll = false
                }

            },
            //状态多选
            statusChange(checkedList) {
                this.isStatusAll = checkedList.length === 4;
                this.taskStatus = checkedList.length > 0 ? checkedList.join(',') : 0
            },
            //级别全选
            levelAllChange(e) {
                if (e.target.checked) {
                    this.levelChecked = [0, 1, 2]
                    this.isLevelAll = true
                } else {
                    this.levelChecked = []
                    this.isLevelAll = false
                }
            },
            //级别多选
            levelChange(checkedList) {
                this.isLevelAll = checkedList.length === 3
                this.taskLevel = checkedList.length > 0 ? checkedList.join(',') : -1
            },
            //角色全选
            roleAllChange(e) {
                if (e.target.checked) {
                    this.roleChecked = [1, 2, 3]
                    this.isRoleAll = true
                } else {
                    this.roleChecked = []
                    this.isRoleAll = false
                }
            },
            //角色多选
            roleChange(checkedList) {
                this.isRoleAll = checkedList.length === 3
                this.taskStatus = checkedList.length > 0 ? checkedList.join(',') : 0
            },
            //搜索
            search() {
                // console.log(this.dataObj)
                if (this.dataObj.statUser == 3 && this.startUserList.length == 0) {
                    this.$message.error('发起人员自定义用户未选择人员')
                }  else if (this.dataObj.startTimeType == 3 && (this.dataObj.sStartTime == null || this.dataObj.sEndTime == null)) {
                    this.$message.error('发起时间自定义时间不能为空', 2)
                } else if (this.dataObj.endTimeType == 3 && (this.dataObj.eStartTime == null || this.dataObj.eEndTime == null)) {
                    this.$message.error('结束时间自定义时间不能为空', 2)
                } else {
                    //处理多选的字符串 人员任务排行榜的角色是多选
                    this.dataObj.taskRole = this.roleChecked.length > 0 ? this.roleChecked.join(',') : 0
                    this.dataObj.taskLevel = this.levelChecked.length > 0 ? this.levelChecked.join(',') : -1
                    this.dataObj.taskStatus = this.statusChecked.length > 0 ? this.statusChecked.join(',') : 0
                    this.$emit('done', this.dataObj)
                    sessionStorage.setItem('diyUser', JSON.stringify(this.startUserList))
                    sessionStorage.setItem('staCountFilter', JSON.stringify(this.dataObj));
                }
            }
        }

    }
</script>

<style scoped lang="less">
    .search-content {
        width: 100%;
    }

    .user-span {
        display: inline-block;
        margin-left: 15px;
        font-size: 14px;
        color: #B2BCCC;
    }

    .filter-search-btn {
        margin-left: 50px;
    }


    /*.task-search{*/
    /*    width: 100%;*/
    /*    display: flex;*/
    /*    flex-wrap: wrap;*/
    /*    .search-content{*/
    /*        width: 50%;*/
    /*    }*/
    /*    .search-time{*/
    /*        width: 100%;*/
    /*    }*/
    /*}*/

</style>