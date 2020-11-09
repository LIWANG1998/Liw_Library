<template>
    <div class="task-detail add-task">
        <header class="page-header"><span class="page-title">子任务详情</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button @click="back">返回</a-button>
                <!--执行中-执行者按钮-->
                <a-button type="button" class="btn-executing-do isAllowTransfer"
                          v-if="btnExecutingDo && btnIsAllowTransfer">任务转办
                </a-button>
                <a-button type="primary" class="btn-executing-do" v-if="btnExecutingDo"
                          @click="openUpdatePregress(1)">更新进度
                </a-button>
                <!--执行中-发起者按钮-->
                <a-button type="primary" class="btn-executing-start" v-if="btnExecutingStart" @click="urgingTask()">催办</a-button>
            </div>
        </header>
        <div class="split-box split-box-thin"></div>
        <!--        任务内容-->
        <div class="add-task-content">
            <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                <p class="section-title">任务内容</p>
                <a-form-model-item label="">
                    <span class="task-name">{{form.name}}</span>
                </a-form-model-item>
                <a-form-model-item label="">
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

                <a-form-model-item label="负责人">
                    <img src="@/assets/images/taskDetail/receivePeopleIcon.png" alt="" class="label-icon">
                    <div class="people-list-box" id="receiver" title="点击选择人员" @click="reciveUserShow = true">
                        <span class="copy-people">{{reciveUserText}}</span>
                        <input type="text" v-show="false" v-model="form.receiveId">
                        <a-icon type="right"/>
                        <span class="copy-people-count">（{{reciveUsrList.length}}人）</span>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="附件" v-show="form.fileArr.length > 0">          <!--上传附件-->
                    <img src="@/assets/images/addTask/annex.png" alt="" class="label-icon-upload icon-img">
                    <file-list-module :optionType="optionType" @data="getFileList"
                                      :file-arr="form.fileArr" ref="fileList"></file-list-module>
                </a-form-model-item>
            </a-form-model>
            <!--任务进度-->
            <div class="split-box"></div>
            <schedule-list-module :isChild="true"></schedule-list-module>
        </div>
    </div>
</template>

<script>
    import {task} from "@/api";
    import moment from 'moment'
    import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
    import scheduleListModule from '@/components/scheduleListModule'
    import FileListModule from "@/components/fileListModule";
    import SubTaskModule from "@/components/subTaskModule";
    import FileListModule from "@/components/fileListModule";
    import scheduleListModule from '@/components/scheduleListModule'

    export default {
        name: "taskDetail",
        components: {
            SubTaskModule,FileListModule, AFormModelItem,
            scheduleListModule,EditorBar
        },
        data() {
            return {
                taskId: this.$route.query.id,
                pageType: this.$route.query.pageType,
                labelCol: {span: 2},
                wrapperCol: {span: 16},
                ccUserShow: false,//抄送人选人弹窗
                reciveUserShow: false,//接收人选人弹窗
                ccUserList: [],//抄送人选人列表
                reciveUsrList: [],//接收人选人列表
                ccUserText: '',
                reciveUserText: '',
                ccUserId: '',
                receiveUserId: '',
                receiverDepId: '',
                optionType: 'detail',
                /*上传弹窗*/
                modalUpTitle: '上传文件',
                modalUpType: 'add',//弹窗类型
                modalUpShow: false,//弹窗显示
                confirmUpLoading: false,//表单确定加载状态
                submitLoading: false,//提交loading
                /*操作按钮显示隐藏*/
                btnExecutingDo: false,//执行中-接收者
                btnExecutingStart: false,//执行中-发起者
                btnIsAllowTransfer: false,//执行中-接收者-是否允许转办
            }
        },
        methods: {
            moment,
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
                    if (this.form.taskRole === 0) { //发起
                        this.btnExecutingStart = true
                    } else if (this.form.taskRole === 1) { //执行
                        this.btnExecutingDo = true
                        if (this.form.isAllowTransfer === 1) {
                            this.btnIsAllowTransfer = true
                        } else {
                            this.btnIsAllowTransfer = false
                        }
                    }
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
            //催办任务
            urgingTask() {
                this.urgingShow = true
            },
            /*更新进度*/
            //打开更新进度弹窗
            async openUpdatePregress(type) {
                //type 0主任务  1子任务
                this.updateWindow = true;
                let params = {
                    task_id: this.taskId,
                    task_pid: type,
                }
                this.updateForm.isChild = type;
                const {code, msg, data} = await task.getProgressInfo(params)
                if (code) {
                    this.updateForm.id = data.id;
                    this.updateForm.taskId = data.task_id;
                    this.updateForm.finishType = data.status;
                    this.updateForm.content = data.remarks;
                    this.updateForm.fileList = data.file_url ? data.file_url : [];
                    this.updateForm.userId = data.notice_userid;
                    if (data.notice_userid.length > 0) {
                        data.notice_userid.forEach(item => {
                            this.updateForm.userId = item.userid
                        })
                    }
                    this.updateForm.userList = data.notice_userid;//需要重组数组
                } else {
                    this.$message.error(msg, 2)
                }
            },
            //确定更新进度
            async updateProgress() {
                this.submitLoading = true
                this.updateForm.userList = this.$refs.updatePeople.peopleList;
                this.updateForm.userId = this.$refs.updatePeople.peopleId;
                this.updateForm.fileList = this.$refs.updateUpload.fileList
                let params = {
                    id: this.updateForm.id,
                    task_id: this.updateForm.taskId,
                    status: this.updateForm.finishType,
                    remarks: this.updateForm.content,
                    file_url: this.updateForm.fileList,
                    notice_userid: this.updateForm.userId.length > 0 ? this.updateForm.userId.join(',') : ''
                }
                if (this.updateForm.isChild === 1) {
                    params.pid = this.taskId
                }
                const {code, msg} = await task.updateProgress(params)
                if (code) {
                    this.submitLoading = false;
                    this.updateWindow = false;
                    this.$message.success(msg, 2)
                    this.$forceUpdate()
                    // this.
                } else {
                    this.submitLoading = false
                    this.$message.error(msg, 2)
                }
            },
            back() {
                this.$emit('update:showSub', false);
            }

        },
        created() {
            this.getData()
            this.judgeBtn()
        }
    }
</script>

<style scoped>
    @import "../assets/css/addTask.css";
</style>
<style scoped lang="less">
    .add-task .add-task-content .label-icon-upload {
        top: 10px;
    }
    .task-name{
        font-size: 16px;
        color: #303133;
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
