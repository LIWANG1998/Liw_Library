<template>
    <div>
        <div class="task-search-title">
            <span @click="filterBoxShow = !filterBoxShow" :class="filterBoxShow ? '' : 'black'">{{filterBoxShow ? '收起' : '展开'}}筛选  <a-icon :type="filterBoxShow ? 'caret-up' : 'caret-down'" /></span>
        </div>
        <div class="split-box split-box-thin"></div>
        <div class="search-box task-search" v-show="filterBoxShow">
<!--            <div class="search-content search-status" v-show="!peopleFilter">-->
<!--                <span class="label-span">人员范围</span>-->
<!--                <a-radio-group name="status" v-model="dataObj.statUser"> &lt;!&ndash; button-style="solid"    a-radio-button按钮形式 &ndash;&gt;-->
<!--                    <a-radio :value="1" v-if="userInfo.type >=0">我的</a-radio>&lt;!&ndash;0个人 1部门 2公司&ndash;&gt;-->
<!--                    <a-radio :value="2" v-if="userInfo.type >= 1">所在部门</a-radio>-->
<!--                    <a-radio :value="3" v-if="userInfo.type >= 2">全部</a-radio>-->
<!--                    <a-radio :value="4" v-if="userInfo.type > 0 && (userInfo.type == userInfo.cooperation)">自定义用户</a-radio>-->
<!--                </a-radio-group>-->
<!--                <a-button  v-show="dataObj.statUser === 4" @click="startUserWindow = true">选择人员</a-button>-->
<!--                <span v-show="dataObj.statUser === 4" class="user-span">已选{{startUserList.length}}人</span>-->
<!--            </div>-->
            <div class="search-content search-status">
                <span class="label-span">发起人员</span>
                <a-radio-group name="status" v-model="dataObj.statUser">
                    <a-radio :value="1">全部</a-radio>
                    <a-radio :value="2">我发起的</a-radio>
                    <a-radio :value="3" v-if="parseInt(userInfo.type) > 0">自定义用户</a-radio>
                </a-radio-group>
                <a-button  v-show="dataObj.statUser === 3" @click="startUserWindow = true">选择人员</a-button>
                <span v-show="dataObj.statUser === 3" class="user-span">已选{{startUserList.length}}人</span>
            </div>
            <div class="search-content search-sort">
                <span  class="label-span">参与人员</span>
                <a-radio-group name="area" v-model="dataObj.partakeUser">
                    <a-radio :value="1">全部</a-radio>
                    <a-radio :value="2">我参与的</a-radio>
                    <a-radio :value="3" v-if="parseInt(userInfo.type) > 0">自定义用户</a-radio>
                </a-radio-group>
                <a-button v-show="dataObj.partakeUser === 3" @click="partakeUserWindow = true">选择人员</a-button>
                <span v-show="dataObj.partakeUser === 3" class="user-span">已选{{partakeUserList.length}}人</span>
            </div>
            <div class="search-content search-sort">
                <span  class="label-span">归属类型</span>
                <a-radio-group name="area" v-model="dataObj.partakeUser">
                    <a-radio :value="1">全部</a-radio>
                    <a-radio :value="2">我发起的</a-radio>
                    <a-radio :value="3">我参与的</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-level">
                <span  class="label-span">任务状态</span>
                <a-radio-group name="level" v-model="dataObj.taskStatus">
                    <a-radio :value="1">全部</a-radio>
                    <a-radio :value="2">待开始</a-radio>
                    <a-radio :value="3">执行中</a-radio>
                    <a-radio :value="4">已逾期</a-radio>
                    <a-radio :value="5">已完成</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-level">
                <span  class="label-span">任务级别</span>
                <a-radio-group name="level" v-model="dataObj.taskLevel">
                    <a-radio :value="-1">全部</a-radio>
                    <a-radio :value="0">普通</a-radio>
                    <a-radio :value="1">紧急</a-radio>
                    <a-radio :value="2">非常紧急</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-type" >
                <span  class="label-span">统计时间</span>
                <a-radio-group name="type" v-model="dataObj.startTimeType">
<!--                    <a-radio-button :value="1" >不限</a-radio-button>-->
                    <a-radio :value="1" >近一周</a-radio>
                    <a-radio :value="2" >近一个月</a-radio>
                    <a-radio :value="3" >近半年</a-radio>
                    <a-radio :value="4" >自定义</a-radio>
                </a-radio-group>
                <div style="display: inline-block"  v-show="dataObj.startTimeType === 4">
                    <a-date-picker
                            :allowClear="false"
                            v-model="dataObj.sStartTime"
                            :inputReadOnly="true"
                            format="YYYY-MM-DD"
                            @change="stratTimeChange"
                            placeholder="开始时间"/> -
                    <a-date-picker
                            :allowClear="false"
                            v-model="dataObj.sEndTime"
                            :inputReadOnly="true"
                            :disabled-date="disabledEndDate"
                            format="YYYY-MM-DD"
                            @change="endTimeChange"
                            placeholder="结束时间"/>
                </div>
                <a-button type="primary" class="btn-home-search" @click="search">搜索</a-button>
            </div>
        </div>
        <!--发起人员选人的弹窗-->
        <pick-user :show.sync="startUserWindow" :selected-user="startUserList"  @done="getStartUser"></pick-user>
        <!--参与人员选人的弹窗-->
        <pick-user :show.sync="partakeUserWindow" :selected-user="partakeUserList"  @done="getPartakeUser"></pick-user>
    </div>

</template>

<script>
    import moment from 'moment';
    import PickUser from "./pickUser";
    export default {
        name: "taskCountFilter",
        components: {PickUser},
        props:{
            peopleFilter:{//人员数据详情
                type:Boolean,
                default:false
            },
        },
        data(){
            return{
                filterBoxShow:true,
                countRole:this.$route.query.role ? this.$route.query.role : 1,
                dataObj:{
                    statUser: this.$route.query.role ? parseInt(this.$route.query.role) : 1,//人员范围
                    strarUserId:'',//发起人id
                    partakeUserId:'',//参与人员id
                    partakeUser:1,//归属类型
                    taskLevel:-1,//任务级别
                    taskStatus:1,//任务状态
                    startTimeType:1,//开始时间
                    sStartTime:null,//开始时间-开始时间
                    sEndTime:null,//开始时间-结束时间
                },
                startUserWindow:false,//发起人选人的弹窗
                stratUserText:'',//发起人员名字串
                startUserList:[],//发起人员列表
                partakeUserWindow:false,//参与人员选人弹窗
                partakeUserText:'',//参与人员名字串
                partakeUserList:[],//参与人员列表
                userInfo:JSON.parse(sessionStorage.getItem('userInfo'))
            }
        },
        methods:{
            //发起人-选人数据
            getStartUser(data){
                if (data.userId && data.userId.length > 0){
                    this.dataObj.strarUserId = data.userId.join(',')
                }
                if (data.user && data.user.length > 0){
                    let text = []
                    this.startUserList = [].concat(data.user)
                    data.user.forEach(item=>{
                        text.push(item.name)
                    })
                    this.stratUserText = text.join(',')
                }
            },
            //开始时间--结束时间限制
            disabledEndDate(endValue) {
                const startValue = this.dataObj.sStartTime;
                if (!endValue || !startValue) {
                    return false;
                }
                return moment(startValue).diff(endValue,"day") <= 0?false:true;
            },
            //开始时间--开始时间改变时
            stratTimeChange(value) {
                this.dataObj.sStartTime = value
            },
            //开始时间--结束时间改变时
            endTimeChange(value) {
                this.dataObj.sEndTime = value
            },
            //搜索
            search(){
                // console.log(this.dataObj.sStartTime,this.dataObj.sEndTime)
                if (this.dataObj.startTimeType == 4 && (this.dataObj.sStartTime == null || this.dataObj.sEndTime == null)){
                    this.$message.error('自定义时间不能为空',2)
                } else if (this.dataObj.statUser == 4  && this.dataObj.strarUserId == ''){
                    this.$message.error('自定义人员不能为空',2)
                } else {
                    this.$emit('done',this.dataObj)
                }
                // console.log(this.dataObj)
            }
        }

    }
</script>

<style scoped lang="less">
    .search-content{
        width: 100%;
    }
    .user-span{
        display: inline-block;
        margin-left: 15px;
        font-size: 14px;
        color: #B2BCCC;
    }
</style>