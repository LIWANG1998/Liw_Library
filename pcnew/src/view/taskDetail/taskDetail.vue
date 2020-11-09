<template>
    <div class="task-detail add-task">
        <div v-if="!subTaskWindowShow">
            <header class="page-header"><span class="page-title">任务详情</span>
                <div style="float: right; position: relative;" id="optionBtn">
                    <a-button @click="$router.go(-1)">返回</a-button>
                    <a-button type="button" class="btn-drafts" v-if="btnDrafts" @click="goEditTask()">编辑</a-button>
                    <a-button type="button" class="btn-drafts" v-if="btnDrafts" @click="startTaskWindow = true">立即开始
                    </a-button>
                    <a-button type="primary" class="btn-drafts" v-if="btnDrafts" @click="delTask">删除</a-button>
                    <!--已结束按钮-->
                    <a-button type="primary" class="btn-finished" v-if="btnFinished" @click="seeTaskFile()">查看任务文件
                    </a-button>
                    <!--执行中-执行者按钮-->
<!--                    <a-button type="button" class="btn-executing-do isAllowTransfer" @click="transferWindow = true">任务转办-->
<!--                    </a-button>-->
                    <a-button type="button" class="btn-executing-do isAllowTransfer"
                              v-if="btnExecutingDo && btnIsAllowTransfer && btnIsStart" @click="transferWindow = true">任务转办
                    </a-button>
                    <a-button type="primary" class="btn-executing-do" v-if="btnExecutingDo && btnIsStart"
                              @click="openUpdatePregress(0,taskId,0)">更新进度
                    </a-button>
                    <!--执行中-发起者按钮-->
                    <a-button type="button" class="btn-executing-start" v-if="btnExecutingStart" @click="goEditTask()">
                        编辑
                    </a-button>
                    <a-button type="primary" class="btn-executing-start" v-if="btnExecutingStart && btnIsStart" @click="urgingTask">
                        催办
                    </a-button>
                    <a-button type="button" class="btn-executing-start" v-if="btnExecutingStart"
                              @click="finishTaskWindow = true">结束
                    </a-button>
                </div>
            </header>
            <div class="split-box split-box-thin"></div>
            <!--        任务内容-->
            <div class="add-task-content">
                <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <p class="section-title">任务内容</p>
                    <a-form-model-item label=" ">
                        <div class="task-level" v-if="form.level === 0">
                            <img src="@/assets/images/taskDetail/blueTags.png" alt="" class="tag-img">
                            <span class="status-text blue">普通</span>
                        </div>
                        <div class="task-level" v-else-if="form.level === 1">
                            <img src="@/assets/images/taskDetail/orangeTags.png" alt="" class="tag-img">
                            <span class="status-text orange">紧急</span>
                        </div>
                        <div class="task-level" v-else>
                            <img src="@/assets/images/taskDetail/redTags.png" alt="" class="tag-img">
                            <span class="status-text red">非常紧急</span>
                        </div>

                        <span class="task-name">{{form.name}}</span>
                    </a-form-model-item>
                    <a-form-model-item label="任务内容">
                        <div class="task-describe" v-html="form.content"></div>
                    </a-form-model-item>
                    <a-form-model-item label="进度">
                        <div class="progress-box"
                             :class="form.progress == 100 ? 'barGreen' : (form.progress == 0 ? 'barGrey' : 'barBlue')">
                            <div class="progress-bar" :style="{width:form.progress+'%'}"></div>
                            <span class="progress-text">{{form.progress+'%'}}</span>
                        </div>
                    </a-form-model-item>
                    <div class="split-box"></div>
                    <p class="section-title">任务安排</p>

                    <a-form-model-item label="发起人" >
                        <img src="@/assets/images/taskDetail/startPeopleIcon.png" alt="" class="label-icon">
                        <div class="people-list-box" id="promoter" @click="openInfo">
                            <span class="copy-people">{{form.addUserName}}</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="接收人">
                        <img src="@/assets/images/taskDetail/receivePeopleIcon.png" alt="" class="label-icon">
                        <div class="people-list-box" id="receiver" title="点击选择人员" @click="urgingShow = true;dataType=1;preview=true;">
                            <span class="copy-people">{{reciveUserText}}</span>
                            <input type="text" v-show="false" v-model="form.receiveId">
                            <a-icon type="right"/>
                            <span class="copy-people-count">（{{reciveUsrList.length}}人）</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="抄送人">
                        <img src="@/assets/images/taskDetail/copyPeopleIcon.png" alt="" class="label-icon">
                        <div class="people-list-box" id="cc" title="点击选择人员" @click="urgingShow = true;dataType=2;preview=true;">
                            <span class="copy-people">{{ccUserText}}</span>
                            <a-icon type="right"/>
                            <span class="copy-people-count">（{{ccUserList.length}}人）</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="任务时间">
                        <a-form-model-item prop="startTime">
                            <a-date-picker
                                    :value="form.startTime" :allowClear="false"  :inputReadOnly="true"
                                    format="YYYY-MM-DD HH:mm" :open="false"
                                    placeholder="开始时间"/>
                        </a-form-model-item>
                        <span style="margin: 0 20px">-</span>
                        <a-form-model-item>
                            <a-date-picker :value="form.endTime" :open="false" :allowClear="false" :inputReadOnly="true"
                                           format="YYYY-MM-DD HH:mm" placeholder="结束时间"/>
                        </a-form-model-item>
                    </a-form-model-item>
                    <a-form-model-item label="附件" v-show="form.fileArr.length > 0">          <!--上传附件-->
                        <img src="@/assets/images/addTask/annex.png" alt="" class="label-icon-upload icon-img">
                        <file-list-module :optionType="optionType" @data="getFileList" :is-cc="form.taskRole == 2"
                                          :file-arr="form.fileArr" ref="fileList"></file-list-module>
                    </a-form-model-item>
                </a-form-model>
                <!--子任务-->
                <div class="split-box" v-if="form.subTask.length > 0"></div>
                <div class="section-title" v-if="form.subTask.length > 0">子任务</div>
                <ul class="subTask-list">
                    <li class="subTask-li" title="点击查看详情" v-for="(item,index) in form.subTask" :key="index"
                        @click="goSubTaskDetacil(item.id,item.pid)">
                        <div class="subTask-name clear-fix">
                            <p class="left">
                                {{index+1 + '. '+item.title}}
                                <span class="file-status" :class="item.statusClass">{{item.statusName}}</span>
                            </p>
                            <p class="right">
                                <a-icon type="right" class="go-sub-task-icon"/>
                            </p>
                        </div>
                        <div class="subTask-describe" title="点击查看详情" v-html="item.content"></div>
<!--                        <div class="subTask-describe" title="点击查看详情">{{item.content}}</div>-->
                        <div class="list-icon" title="点击查看详情">
                            <i class="iconfont">&#xe638;</i>
                            <span class="list-count">{{item.file_url.length ? item.file_url.length  : 0}}</span>
                        </div>
                    </li>
                </ul>
                <!-- <div class="no-data" v-else>
                    <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
                </div> -->
                <!--任务进度-->
                <div class="split-box"></div>
                <schedule-list-module :id="parseInt(taskId)" :pid="0" ref="taskSchedule" :is-cc="form.taskRole == 2"></schedule-list-module>
            </div>
            <!--选人的弹窗-->
            <pick-user :show.sync="ccUserShow" :selected-user="ccUserList" :is-look='true'></pick-user><!--抄送人-->
            <pick-user :show.sync="reciveUserShow" :selected-user="reciveUsrList" :is-look='true'></pick-user><!--接收人-->
            <!--上传的弹窗-->
            <a-modal :title="modalUpTitle"
                     :visible=" modalUpShow" :confirm-loading="confirmUpLoading" :centered="true"
                     :destroyOnClose="true"
                     @ok="modalUpSure" @cancel="modalUpShow = false">
                <div class="plan-file-window clear-fix">
                    <div class="upload-annex">
                        <img src="@/assets/images/addTask/annex.png" alt="" class="icon-img">
                        <span class="label">附件</span>
                        <!--                    <a-button class="uploadFile">本地上传</a-button>-->
                    </div>
                </div>
                <div class="upload-box-window">
                    <upload-drag ref="upload" :default-file-list="form.fileArr"></upload-drag>
                </div>
            </a-modal>

            <!--操作的弹窗-->
            <!--结束任务的弹窗-->
            <a-modal title="结束任务"
                     :visible="finishTaskWindow" :confirm-loading="confirmUpLoading" :centered="true"
                     :destroyOnClose="true"
                     @ok="finishTask" @cancel="finishTaskWindow = false">
                <div class="end-content"><p class="start-title">结束方式：</p>
                    <div class="end-radio">
                        <a-radio-group v-model="finishType">
                            <a-radio value="complete">任务完成</a-radio>
                            <a-radio value="cancel">任务取消</a-radio>
                        </a-radio-group>
                    </div>
                </div>
            </a-modal>
            <!--催办的弹窗-->
            <urging-module :show.sync="urgingShow" :user="urgingUser" :data-type="dataType" :id="form.id" :is_recovery="isRecovery" :preview="preview"></urging-module>
            <!-- 任务开始的弹窗-->
            <a-modal title="开始任务"
                     :visible="startTaskWindow" :confirm-loading="confirmUpLoading" :centered="true"
                     :destroyOnClose="true"
                     @ok="startTask" @cancel="startTaskWindow = false">
                <div class="end-content"><p class="start-title">结束方式：</p>
                    <div class="end-radio">
                        <a-radio-group v-model="startType">
                            <a-radio value="rightNow">立即开始</a-radio>
                            <a-radio value="timing">定时开始</a-radio>
                        </a-radio-group>
                    </div>
                    <div class="start-timing" v-show="startType == 'timing'">
                        <div class="time-box">
                            <span class="start-title ">开始时间：</span>
                            <a-date-picker
                                    v-model="startTime.begin"
                                    :allowClear="false"
                                    :disabled-date="disabledStartDate"
                                    :inputReadOnly="true"
                                    :show-time="{format:'HH:mm'}"
                                    format="YYYY-MM-DD HH:mm"
                                    @change="stratTimeChange"
                                    placeholder="开始时间"/>
                        </div>
                        <div class="time-box">
                            <span class="start-title">结束时间：</span>
                            <a-date-picker
                                    :allowClear="false"
                                    v-model="startTime.end"
                                    :disabled-date="disabledEndDate"
                                    :inputReadOnly="true"
                                    :show-time="{format:'HH:mm'}"
                                    format="YYYY-MM-DD HH:mm"
                                    @change="endTimeChange"
                                    placeholder="结束时间"/>
                        </div>
                    </div>
                </div>
            </a-modal>
            <!-- 转办的弹窗-->
            <pick-user :show.sync="transferWindow" :radio="true" @done="sureTransfer" :filter-data="updateUserFilter"></pick-user>
        </div>
        <!--子任务弹窗-->
        <div v-else>
            <sub-task-module :page-type="subPageType" :sub-data="subTaskDataBack" :page-role="form.taskRole"
                             :show-sub.sync="subTaskWindowShow"></sub-task-module>
        </div>
        <!--更新进度的弹窗-->
        <update-progress :show.sync="updateWindow" :update-form="updateForm" :filter-people="updateUserFilter"
                         @done="sureUpdateProgress"></update-progress>
    </div>
</template>

<script>
    import {task} from "@/api";
    import moment from 'moment'
    import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
    import scheduleListModule from '@/components/scheduleListModule'
    import pickUser from '@/components/pickUser'
    import FileListModule from "@/components/fileListModule";
    import UploadDrag from "@/components/uploadDrag";
    import UrgingModule from "../../components/urgingModule";
    // import SelectPeopleTags from "../../components/selectPeopleTags";
    import SubTaskModule from "../../components/subTaskModule";
    import UpdateProgress from "../../components/updateProgress";
    import { openUserInfo } from "@/assets/js/wx";

    // const nowDate = new Date();
    export default {
        name: "taskDetail",
        components: {
            UpdateProgress,
            SubTaskModule,
            // SelectPeopleTags,
            UrgingModule,
            UploadDrag, FileListModule, AFormModelItem,
            scheduleListModule, pickUser
        },
        data() {
            return {
                taskId: this.$route.query.id,
                pageType: this.$route.query.pageType,
                labelCol: {span: 2},
                wrapperCol: {span: 16},
                form: {
                    level: 0,//任务等级
                    name: '',//任务名称
                    content: '',//任务内容
                    progress: 0,
                    addUserName: '',//发起人姓名
                    addUserId: null,//发起人ID
                    startTime: null,
                    endTime: null,//结束时间
                    fileArr: [],//任务文件
                    subTask: [],//子任务
                    taskRole: null,
                },
                ccUserShow: false,//抄送人选人弹窗
                reciveUserShow: false,//接收人选人弹窗
                ccUserList: [],//抄送人选人列表
                reciveUsrList: [],//接收人选人列表
                ccUserText: '',
                reciveUserText: '',
                ccUserId: '',
                receiveUserId: '',
                receiverDepId: '',
                userId:'',//发起人用户id
                optionType: 'detail',
                /*上传弹窗*/
                modalUpTitle: '上传文件',
                modalUpType: 'add',//弹窗类型
                modalUpShow: false,//弹窗显示
                confirmUpLoading: false,//表单确定加载状态
                submitLoading: false,//提交loading
                /*子任务*/
                subTaskWindowShow: false,//打开子任务弹窗
                subTaskId: null,//子任务id
                subTaskDataBack: {},//子任务回显数据
                subPageType: 'subTaskDetail',
                /*操作按钮显示隐藏*/
                btnDrafts: false,//草稿箱
                btnFinished: false,//已结束
                btnExecutingDo: false,//执行中-接收者
                btnExecutingStart: false,//执行中-发起者
                btnIsAllowTransfer: false,//执行中-接收者-是否允许转办
                /*任务操作*/
                finishTaskWindow: false,//结束任务弹窗
                finishType: 'complete',//结束类型
                urgingShow: false,//催办的弹窗
                urgingUser: [],//催办的人员
                urgingUserFilter: [],//催办人员的限制
                preview:false,//是否为人员预览
                startTaskWindow: false,//开始任务弹窗
                startType: 'rightNow',
                startTime: {
                    begin: moment(new Date()),
                    end:  moment(new Date()).add(3, 'days'),
                    //获取初始任务时间
                },
                updateWindow: false,//更新进度弹窗
                updateForm: {
                    id: null,
                    taskId: null,
                    finishType: 0,//更新进度-完成状态
                    userList: [],//更新进度-选择的人
                    userId: [],//更新进度-选择的人的id
                    fileList: [],//更新进度 - 文件列表
                    content: '',//更新进度描述
                    isChild: 0,//是否是子任务 0主任务 1子任务
                },
                updateUserFilter: [],//转办催办进度筛选人
                testShow: true,//选人测试
                transferWindow: false,//转办弹窗,
                dataType:"0",//催办数据类型
                isRecovery:this.$route.query.pageType == 'recycleBin' ? 1 : 0,//是否是回收站
                btnIsStart:false,
            }
        },
        watch: {
            // reciveUsrList(val) {
            //     console.log(val)
            //     if (val.length > 0){
            //         val.forEach(item=>{
            //             this.updateUserFilter.push(item.id)
            //         })
            //     }
            // },
        },
        created() {
            this.getData();
            // this.judgeBtn();
            if(this.pageType == 'recycleBin'){
                this.isRecovery = 1;
            }
        },
        methods: {
            moment,
            //获取数据
            async getData() {
                let params ={
                    id: this.taskId,
                    look:this.$route.query.look
                }
                if (this.pageType == 'recycleBin') {
                    params.is_recovery = true
                }
                const {code, msg, data} = await task.getInfo(params)
                if (code) {
                    this.form.id = data.id;
                    this.form.progress = data.completion;
                    this.form.level = data.level;
                    this.form.name = data.title;
                    this.form.content = data.content;
                    this.form.addUserName = data.username.length > 0 ? data.username[0].name : '';
                    this.reciveUsrList = data.receive_username;
                    this.ccUserList = data.cc_username;
                    this.form.fileArr = data.file_url;
                    // this.form.subTask = data.son;
                    this.form.startTime = moment(data.start_time);
                    this.form.endTime = moment(data.end_time);
                    this.form.taskRole = data.role;
                    this.form.isAllowTransfer = data.is_allow_transfer;
                    this.userId = data.userid;
                    //判断按钮
                    this.judgeBtn();
                    this.getSubTask()
                    //接收人名字
                    if (data.receive_username.length > 0) {
                        let receiveName = []
                        data.receive_username.forEach((item) => {
                            receiveName.push(item.name)
                        })
                        this.reciveUserText = receiveName.join(',')
                    }
                    //接收人id
                    this.receiveUserId = data.receive_userid
                    //抄送人名称
                    if (data.cc_username.length > 0) {
                        let ccName = []
                        data.cc_username.forEach((item) => {
                            ccName.push(item.name)
                        })
                        this.ccUserText = ccName.join(',')
                    }
                    //催办人员的数据-筛选人员
                    let ids = [], text = [];
                    this.urgingUser = []
                    ids = this.receiveUserId ? this.receiveUserId.split(',') : []
                    text = this.reciveUserText ? this.reciveUserText.split(',') : []
                    if (ids.length > 0) {
                        ids.forEach((item, index) => {
                            let obj = {};
                            obj.id = item;
                            obj.name = text[index]
                            this.urgingUser.push(obj)
                            this.updateUserFilter.push(item)//接收人id
                        })
                    }
                    this.updateUserFilter.push(data.userid)//发起人id
                } else {
                    this.$message.error(msg+'即将返回执行中任务列表...',2)
                    setTimeout(()=>{
                        this.$router.push('/taskList/executing')
                    },2000)
                }
            },
            //获取子任务
            async getSubTask() {
                let params = {
                    pid: this.form.id
                }
                if (this.pageType == 'recycleBin') {
                    params.is_recovery = true;
                }
                const {code, data} = await task.getSubList(params)
                if (code) {
                    this.form.subTask = data
                    if (this.form.taskRole === 1 && this.pageType !== 'drafts' && data.length > 0) {
                        this.form.subTask.forEach(item => {
                            if (item.completion === 1) { //0未完成 1已完成
                                item.statusName = '已完成';
                                item.statusClass = 'green'
                            } else {
                                item.statusName = '未完成';
                                item.statusClass = 'red'
                            }
                        })

                    }
                }
            },
            //判断操作按钮
            judgeBtn() {
                //判断按钮
                var pageType = this.pageType;
                if (pageType === 'drafts') { //草稿箱详情按钮:返回、修改、立即开始、删除
                    this.btnDrafts = true;//草稿箱
                } else if (pageType === 'recycle') { //回收站详情按钮：返回

                } else if (pageType === 'finished') { //已结束详情按钮:传阅、执行：返回，发起：返回、查看文件
                    if (this.form.taskRole === 0) {
                        this.btnFinished = true;
                    }
                } else if (pageType === 'executing') { //执行中详情按钮：传阅：返回，执行：返回、任务转办、更新进度，发起：编辑、催办、结束
                    if (this.form.taskRole == 0) { //发起
                        this.btnExecutingStart = true
                    } else if (this.form.taskRole == 1) { //执行
                        this.btnExecutingDo = true
                        if (this.form.isAllowTransfer == 1) {
                            this.btnIsAllowTransfer = true
                        } else {
                            this.btnIsAllowTransfer = false
                        }
                    }
                }
                //判断任务开始时间 没开始不能转办、催办、更新进度
                if (moment(new Date()).format('YYYY-MM-DD HH:mm') < moment(this.form.startTime).format('YYYY-MM-DD HH:mm')){
                    console.log(1)
                    this.btnIsStart = false
                }else {
                    this.btnIsStart = true
                }
            },
            //任务文件删除时
            getFileList(data) {
                this.form.fileArr = [].concat(data)
            },
            //上传弹窗确定
            modalUpSure() {
                this.modalUpShow = false
                this.form.fileArr = this.$refs.upload.fileList;
            },
            /*
            * 任务操作
            * */
            //去编辑任务
            goEditTask() {
                this.$router.push({
                    path: '/taskDetail/editTask',
                    query: {id: this.form.id}
                })
            },
            //结束任务
            async finishTask() {
                this.confirmUpLoading = true
                let parasm = {};
                if (this.finishType == 'complete') { //完成
                    parasm = {
                        id: this.form.id,
                        status: 2
                    }
                    const {code, msg} = await task.complete(parasm)
                    if (code) {
                        this.confirmUpLoading = false
                        this.$message.success(msg + ' 即将跳转到已结束页面...', 2)
                        setTimeout(() => {
                            this.$router.push('/taskList/finished')
                        }, 2000)
                    } else {
                        this.confirmUpLoading = false
                        this.$message.error(msg, 2)
                    }
                } else if (this.finishType == 'cancel') { //取消
                    parasm = {
                        id: this.form.id
                    }
                    const {code, msg} = await task.del(parasm)
                    if (code) {
                        this.confirmUpLoading = false
                        this.$message.success(msg + ' 即将跳转到回收站页面...', 2)
                        setTimeout(() => {
                            this.$router.push('/taskList/recycleBin')
                        }, 2000)
                    } else {
                        this.confirmUpLoading = false
                        this.$message.error(msg, 2)
                    }
                }
            },
            //催办任务
            urgingTask() {
                this.urgingShow = true;
                this.preview = false;
                this.dataType=1;
            },
            //查看任务文件
            seeTaskFile() {
                this.$router.push({
                    path: '/taskDetail/seeTaskFile',
                    query: {id: this.taskId, pageType: this.pageType}
                })
            },
            //开始任务
            async startTask() {
                let that = this
                // that.confirmUpLoading = true
                let params = {};
                params = {
                    id: that.form.id,
                    status: 1,//任务状态 0未发布 1执行中 2已完成 3取消
                    type: 1, //0草稿 1发布
                }
                if (that.startType === 'timing') {//定时开始
                    params.start_time = moment(that.startTime.begin).format('YYYY-MM-DD HH:mm');
                    params.end_time = moment(that.startTime.end).format('YYYY-MM-DD HH:mm')
                } else if (that.startType === 'rightNow') { //立即开始
                    params.start_time = moment(new Date()).format('YYYY-MM-DD HH:mm');
                }
                if (that.startType === 'timing' && params.end_time <= moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                    that.$confirm({
                        title: '任务结束时间小于现在时间，您是否确认发布一个已逾期的任务?',
                        content: '',
                        centered: true,
                        async onOk() {
                            const {code, msg} = await task.complete(params)
                            if (code) {
                                that.confirmUpLoading = false
                                that.$message.success(msg + ' 即将跳转到执行中列表...', 2)
                                setTimeout(() => {
                                    that.$router.push('/taskList/executing')
                                }, 2000)
                            } else {
                                that.confirmUpLoading = false
                                that.$message.error(msg, 2)
                            }
                        }
                    })
                }else {
                    const {code, msg} = await task.complete(params)
                    if (code) {
                        that.confirmUpLoading = false
                        that.$message.success(msg + ' 即将跳转到执行中列表...', 2)
                        setTimeout(() => {
                            that.$router.push('/taskList/executing')
                        }, 2000)
                    } else {
                        that.confirmUpLoading = false
                        that.$message.error(msg, 2)
                    }
                }


            },
            //开始时间限制
            disabledStartDate(startValue) {
                const endValue = this.startTime.end;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            //结束时间限制
            disabledEndDate(endValue) {
                const startValue = this.startTime.begin;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            //开始时间改变时
            stratTimeChange(value) {
                this.startTime.begin = value
            },
            //结束时间改变时
            endTimeChange(value) {
                this.startTime.end = value
            },
            /*更新进度*/
            //打开更新进度弹窗
            async openUpdatePregress(type, id, pid) {
                //type 0主任务  1子任务
                this.updateWindow = true;
                let params = {
                    task_id: id,
                    task_pid: pid,
                }
                if (this.pageType == 'recycleBin') {
                    params.is_recovery = true
                }
                this.updateForm.isChild = type;
                const {code, msg, data} = await task.getProgressInfo(params)
                if (code) {
                    this.updateForm.id = data.id ? data.id : null;
                    this.updateForm.taskId = data.task_id ? data.task_id : null;
                    this.updateForm.finishType = data.status ? data.status : 0;
                    this.updateForm.content = data.remarks ? data.remarks : '';
                    this.updateForm.fileList = data.file_url ? data.file_url : [];
                    this.updateForm.userId = data.notice_userid ? data.notice_userid : [];
                    if (data.notice_userid && data.notice_userid.length > 0) {
                        data.notice_userid.forEach(item => {
                            this.updateForm.userId = item.userid
                        })
                    }
                    this.updateForm.userList = data.notice_userid;//需要重组数组
                } else {
                    this.$message.error(msg, 2)
                }
            },
            sureUpdateProgress(val){
                if (val){
                    this.$refs.taskSchedule.getSchedule()
                    this.getData()
                    this.updateWindow = false
                }
            },
            /*转办*/
            //确定转办
            async sureTransfer(data) {
                // console.log(data)
                if (data.userId && data.userId.length > 0) {
                    let text = [];
                    data.user.forEach(item => {
                        text.push(item.name)
                    })
                    let params = {
                        id: this.taskId,
                        name: text.join(),
                        userid: data.userId.join(),
                        dep: data.dep.join(),
                    }
                    if (this.$refs.taskSchedule.scheduleList.length > 0) {
                        let _this = this
                        this.$confirm({
                            title: '当前有更新任务记录，转办将删除记录，是否确定转办?',
                            content: '',
                            centered: true,
                            async onOk() {
                                const {code, msg} = await task.transfer(params)
                                if (code) {
                                    _this.$message.success(msg, 2)
                                    _this.getData()
                                    _this.judgeBtn()
                                    _this.btnIsAllowTransfer = false;
                                    _this.btnExecutingDo = false
                                } else {
                                    _this.$message.error(msg, 2)
                                }
                            },
                        });
                    } else {
                        const {code, msg} = await task.transfer(params)
                        if (code) {
                            this.$message.success(msg, 2)
                            this.getData()
                            this.judgeBtn()
                            this.btnIsAllowTransfer = false;
                            this.btnExecutingDo = false
                        } else {
                            this.$message.error(msg, 2)
                        }
                    }
                } else {
                    this.$message.warning('未选择人员', 2)
                }
            },
            //删除任务
            async delTask() {
                let _this = this
                _this.$confirm({
                    title: '是否确定删除该任务?',
                    content: '',
                    centered: true,
                    async onOk() {
                        _this.confirmUpLoading = true
                        let parasm = {};
                        parasm = {
                            id: _this.form.id,
                        }
                        const {code, msg} = await task.del(parasm)
                        if (code) {
                            _this.confirmUpLoading = false
                            _this.$message.success(msg + ' 即将返回上一页', 2)
                            setTimeout(() => {
                                _this.$router.go(-1)
                            }, 2000)
                        } else {
                            _this.confirmUpLoading = false
                            _this.$message.error(msg, 2)
                        }
                    },
                });


            },


            /*子任务*/
            //去子任务详情
            async goSubTaskDetacil(id, pid) {
                this.subTaskWindowShow = true;
                if (id && pid) {
                    this.subTaskId = id;
                    let params = {
                        id: id
                    }
                    const {msg, code, data} = await task.getSubInfoById(params)
                    if (code) {
                        this.subTaskDataBack = data
                    } else {
                        this.$message.error(msg, 2)
                    }
                }
            },

            //打开发起人信息弹窗
            openInfo() {
                openUserInfo(this.userId);
            },
        },

    }
</script>

<style scoped>
    @import "../../assets/css/addTask.css";
</style>
<style scoped lang="less">
    .add-task .add-task-content .label-icon-upload {
        top: 10px;
    }

    /*去子任务详情的icon*/
    .go-sub-task-icon {
        font-size: 18px;
        font-weight: bold;
    }

    /*任务进度*/
    .task-level {
        position: absolute;
        left: -90px;
        top: -10px;
        width: 90px;
        text-align: right;
        padding-right: 10px;

        .tag-img {
            width: 14px;
            height: 14px;
            margin-right: 5px;
        }
    }

    /*更新进度*/
    .update-progress-content-top {
        margin-bottom: 20px;
    }

</style>
