<template>
    <div class="task-detail add-task">
        <header class="page-header">
            <span class="page-title">{{ headerText }}</span>
            <div style="float: right; position: relative" id="optionBtn">
                <a-button @click="back()">返回</a-button>
                <!--新增按钮-->
                <a-button type="primary" @click="submitSub" v-show="pageType !== 'subTaskDetail'">确定</a-button>
                <a-button type="primary" @click="openUpdatePregress(1, form.id, form.pid)"
                          v-show="pageType === 'subTaskDetail' && $parent.pageType === 'executing' && pageRole === 1">
                    更新进度
                </a-button>
                <!--                <a-button type="primary" @click="transferBtnShow = true" v-show="transferBtnShow">-->
                <!--                    任务转办-->
                <!--                </a-button>-->
            </div>
        </header>
        <div class="split-box split-box-thin"></div>
        <!--        任务内容-->
        <div class="add-task-content">
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <p class="section-title">任务内容</p>
                <a-form-model-item label=" " v-show="pageType === 'subTaskDetail'">
                    <span class="subTask-detail-title">{{ form.name }}</span>
                </a-form-model-item>
                <a-form-model-item label=" " v-show="pageType === 'subTaskDetail'">
                    <!--                    <span class="subTask-detail-content">{{form.content}}</span>-->
                    <span class="subTask-detail-content" v-html="form.content">{{form.content}}</span>
                </a-form-model-item>
                <a-form-model-item label="任务标题" prop="name" v-show="pageType !== 'subTaskDetail'">
                    <a-input autocomplete="off" placeholder="请添加标题，限制20个字符" :maxLength="20" v-model="form.name"/>
                </a-form-model-item>
                <a-form-model-item label="任务内容" prop="content" v-show="pageType !== 'subTaskDetail'">
                    <editor-bar v-model="form.content" :isClear="isClear" @change="titleChange"></editor-bar>
                </a-form-model-item>
                <div class="split-box"></div>
                <p class="section-title">任务安排</p>
                <a-form-model-item label="负责人">
                    <a-icon type="user" class="label-icon"/>
                    <!--                    <img src="../assets/images/taskDetail/receivePeopleIcon.png" alt="" class="label-icon">-->
                    <div class="people-list-box" id="receiver" title="点击选择人员" @click="reciveUserShow = true">
                        <span class="copy-people">{{ reciveUserText }}</span>
                        <input type="text" v-show="false" v-model="form.receiveId"/>
                        <a-icon type="right"/>
                        <span class="copy-people-count"
                        >（{{ reciveUsrList ? reciveUsrList.length : 0 }}人）</span
                        >
                    </div>
                    <p class="reciver-tips">
                        （未选择人员，则全员可见，选择负责人员后，仅选择的人员可见）
                    </p>
                </a-form-model-item>
                <!--                <a-form-model-item label=" " v-show="pageType !== 'subTaskDetail'">
                                    &lt;!&ndash;允许转办&ndash;&gt;
                                    <span class="switch-name">允许转办<span class="greyFont">（允许接收人把任务转交给其他人办理）</span></span>
                                    <a-switch v-model="form.isAllowTransfer"/>
                                </a-form-model-item>-->
                <a-form-model-item label="附件" class="file-color">
                    <!--上传附件-->
                    <img src="../assets/images/addTask/annex.png" alt="" class="label-icon-upload icon-img"/>
                    <a-button type="link" id="openUpFileWindow" class="btn-text-underline"
                              @click="modalUpShow = true" v-show="pageType !== 'subTaskDetail'">
                        点击上传附件
                    </a-button>
                    <file-list-module :optionType="optionType" @data="getFileList" :file-arr="form.fileArr" :is-cc="pageRole == 2"
                                      ref="fileList"></file-list-module>
                </a-form-model-item>
            </a-form-model>
            <!--任务进度-->
            <div class="split-box" v-if="pageType === 'subTaskDetail'"></div>
            <schedule-list-module v-if="pageType === 'subTaskDetail'" :id="form.id" ref="subTaskSchedule" :is-cc="pageRole == 2"
                                  :pid="form.pid"></schedule-list-module>
        </div>
        <!--子任务负责人 选人的弹窗-->
        <urging-module :show.sync="reciveUserShow" :user="userList" @done="reciveUserData"
                       type="head" :user-id="reciveUsrList" :is-look="isLook"></urging-module>
        <!--上传的弹窗-->
        <a-modal
                :title="modalUpTitle"
                :visible="modalUpShow"
                :confirm-loading="confirmUpLoading"
                :centered="true"
                :destroyOnClose="true"
                @ok="modalUpSure"
                @cancel="modalUpShow = false"
        >
            <div class="plan-file-window clear-fix">
                <div class="upload-annex">
                    <img
                            src="@/assets/images/addTask/annex.png"
                            alt=""
                            class="icon-img"
                    />
                    <span class="label">附件</span>
                    <!--                    <a-button class="uploadFile">本地上传</a-button>-->
                </div>
            </div>
            <div class="upload-box-window">
                <upload-drag
                        ref="upload"
                        :default-file-list="form.fileArr"
                ></upload-drag>
            </div>
        </a-modal>
        <!--更新进度的弹窗-->
        <update-progress :show.sync="updateWindow" :update-form="updateForm" :filter-people="$parent.updateUserFilter"
                         @done="sureUpdateProgress"></update-progress>
        <!--任务转办的弹窗   暂不做-->
        <!--  <a-modal title="任务转办"
                     :visible="subTaskTransferWindow" :confirm-loading="confirmUpLoading" :centered="true"
                     :destroyOnClose="true"
                     @ok="openTransferWindow" @cancel="subTaskTransferWindow = false">
                <a-form-model ref="ruleForm" :model="transferForm" :rules="rules" :label-col="labelCol"
                              :wrapper-col="wrapperCol">
                    <a-form-model-item label="转办类型">
                        <a-radio-group v-model="transferForm.type">
                            <a-radio :value="1">仅转出子任务</a-radio>
                            <a-radio :value="0">转出整个任务</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="转办接收人员">
                        <div class="people-list-box" id="receiver" title="点击选择人员" @click="transferPickShow = true">
                            <span class="copy-people">{{transferForm.userText}}</span>
                        </div>
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
            <pick-user :show.sync="transferPickShow" :radio="true" @done="getTransferData"></pick-user>-->
    </div>
</template>


<script>
    import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
    import scheduleListModule from "../components/scheduleListModule";
    import {task} from "@/api";
    import UrgingModule from "./urgingModule";
    import UploadDrag from "./uploadDrag";
    import FileListModule from "./fileListModule";
    import EditorBar from "./wangEnduit";
    import UpdateProgress from "./updateProgress";
    // import PickUser from "./pickUser";

    export default {
        name: "subTaskModule",
        props: ["pageType", "show", "subData", "showSub", "pageRole"],
        components: {
            UrgingModule,
            FileListModule,
            AFormModelItem,
            scheduleListModule,
            UploadDrag,
            EditorBar,
            UpdateProgress
        },
        data() {
            return {
                headerText: "",
                labelCol: {span: 2},
                wrapperCol: {span: 16},
                form: {
                    id: null,
                    pid: null,
                    name: "",
                    content: "",
                    receiveId: "",
                    taskRole:null,
                    // isAllowTransfer: false,
                    fileArr: [],
                },
                userList:this.$parent.urgingUser,
                reciveUserText: "",
                reciveUsrList: [],
                reciveUserId:[],
                isClear: false,
                countLength: 0, //输入框的长度
                contentText: "", //输入框纯文本
                rules: {
                    name: [
                        {required: true, message: "标题不能为空", trigger: "blur"},
                        {max: 12, message: "输入字符应在12字内", trigger: "blur"},
                    ],
                    content: [
                        {required: true, message: "任务内容不能为空", trigger: "blur"},
                        {max: 500, message: "输入字符应在500字内", trigger: "blur"},
                    ],
                },
                reciveUserShow: false, //选人弹窗
                optionType: this.pageType === "subTaskDetail" ? "detail" : "add",
                /*上传弹窗*/
                modalUpTitle: "上传文件",
                modalUpType: "add", //弹窗类型
                modalUpShow: false, //弹窗显示
                confirmUpLoading: false, //表单确定加载状态
                submitLoading: false,
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
                isLook:false,
                /*任务转办 暂不做*/
                /*     transferBtnShow: false,
                          subTaskTransferWindow: false,//转办弹窗的显示
                          transferType: 1,//转办类型
                          transferForm: {
                              type: '',
                              userList: [],
                              userId: '',
                              userText: '',
                          },
                          transferPickShow:false,*/
            };
        },
        watch: {
            subData: {
                handler(val) {
                    this.getSubData(val);
                },
                deep: true,
            },
        },
        methods: {
            //统计字符数量
            titleChange(val) {
                this.form.content = val;
            },
            //获取数据
            getSubData(val) {
                // console.log(val);
                // pageType === 'subTaskDetail' && $parent.pageType === 'executing'&& pageRole === 1
                this.form.name = val.title;
                this.form.content = val.content;
                this.form.id = val.id;
                this.form.pid = val.pid;
                // this.form.isAllowTransfer = val.is_allow_transfer === 1 ? true : false;
                this.form.receiveId = val.subtask_lead_user;
                this.form.fileArr = val.file_url;
                if (val.subtask_lead_username && val.subtask_lead_username.length > 0) {
                    let nameArr = [], idArr = [];
                    idArr = val.subtask_lead_user ? val.subtask_lead_user.split(",") : [];
                    val.subtask_lead_username.forEach((item, index) => {
                        nameArr.push(item.name);
                        let obj = {}
                        obj.id = idArr[index];
                        obj.name = item.name;
                        this.reciveUsrList.push(obj); //负责人列表
                    });
                    // this.reciveUserId = [].concat(idArr);
                    this.reciveUserText = nameArr ? nameArr.join(",") : [];
                }
                // //转办按钮显示
                // if (this.pageType === "subTaskDetail" &&
                //     this.$parent.pageType === "executing" &&
                //     this.pageRole === 1 && val.is_allow_transfer === 1) {
                //     this.transferBtnShow = true;
                // }
            },
            //获取页面类型
            getPageType() {
                if (this.pageType === "addSubTask") {
                    this.headerText = "新增子任务";
                    this.form = {
                        id: null,
                        name: "",
                        content: "",
                        receiveId: "",
                        isAllowTransfer: false,
                        fileArr: [],
                    };
                } else if (this.pageType === "editSubTask") {
                    this.headerText = "编辑子任务";
                    //没有id时的数据回显
                    this.getSubData(this.subData);
                    this.isLook = false;
                } else if (this.pageType === "subTaskDetail") {
                    this.headerText = "子任务详情";
                    this.isLook = true;
                } else {
                    this.headerText = "新增子任务";
                    this.isLook = false;
                }
            },
            //上传弹窗确定
            modalUpSure() {
                this.modalUpShow = false;
                this.form.fileArr = this.$refs.upload.fileList;
            },
            //任务文件删除时
            getFileList(data) {
                this.form.fileArr = [].concat(data);
            },
            //选人组件的数据
            reciveUserData(data) {
                this.reciveUsrList = [].concat(data);
                if (this.reciveUsrList.length > 0) {
                    let name = [],
                        ids = [];
                    data.forEach((item) => {
                        name.push(item.name);
                        ids.push(item.id);
                    });
                    this.reciveUserText = name.join(",");
                    this.form.receiveId = ids.join(",");
                }
            },
            //确定 添加-编辑
            submitSub() {
                this.$refs.ruleForm.validate(async (valid) => {
                    if (valid) {
                        let obj = {
                            title: this.form.name,
                            content: this.form.content,
                            // is_allow_transfer: this.form.isAllowTransfer ? 1 : 0,
                            subtask_lead_user: this.form.receiveId,
                            file_url: this.form.fileArr,
                        };
                        obj.subtask_lead_username = [];
                        let nameArr = this.reciveUserText.split(',');
                        let ids = this.form.receiveId.split(',')
                        nameArr.forEach((item, index) => {
                            obj.subtask_lead_username.push({name: item, id: ids[index]})
                        })

                        if (
                            this.pageType === "editSubTask" &&
                            this.form.id &&
                            this.form.pid
                        ) {
                            obj.id = this.form.id;
                            obj.pid = this.form.pid;
                            const {msg, code} = await task.editSub(obj);
                            if (code) {
                                this.$message.success(msg, 2);
                                this.$parent.getSubTask();
                                this.$emit("update:showSub", false);
                            } else {
                                this.$message.error(msg, 2);
                            }
                        } else {
                            this.$emit("subTaskData", obj);
                            this.$emit("update:showSub", false);
                        }
                    } else {
                        this.$message.error("检验失败，请检查输入项！", 2);
                        return false;
                    }
                });
            },
            //返回
            back() {
                this.$parent.getSubTask()
                this.$emit("update:showSub", false);
            },
            /*任务详情*/
            //更新进度
            //打开更新进度弹窗
            async openUpdatePregress(type, id, pid) {
                //type 0主任务  1子任务
                this.updateWindow = true;
                let params = {
                    task_id: id,
                    task_pid: pid,
                }
                this.updateForm.isChild = type;
                const {code, msg, data} = await task.getProgressInfo(params)
                if (code) {
                    this.updateForm.id = data.id ? data.id : null;
                    this.updateForm.taskId = data.main_task_id ? data.main_task_id : null;
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
            //确定更新进度
            sureUpdateProgress(val) {
                if (val) {
                    this.$refs.subTaskSchedule.getSchedule()
                    // this.getData();
                    this.updateWindow = false
                }
            },

            /*任务转办  暂不做*/
            /*    //任务转办
                    openTransferWindow() {
                        // this.transferBtnShow = true
                    },
                    //任务转办选人的数据
                    getTransferData(data){
                        if (data.userId && data.userId.length > 0) {
                            let text = [];
                            data.user.forEach(item=>{
                                text.push(item.name)
                            })
                            this.transferForm.userText = text.join()
                            this.transferForm.user = [].concat(data.user)
                        }
                    }*/
        },
        mounted() {
            this.getPageType();
        },
    };
</script>

<style scoped>
    @import "../assets/css/addTask.css";
</style>

<style scoped lang="less">
    /deep/ .file-color {
        label {
            color: #303133 !important;
        }
    }

    .label-icon {
        color: #dcdcdc;
    }

    .reciver-tips {
        color: #c0c4cc;
        font-size: 14px;
    }

    /*子任务详情*/
    .subTask-detail-title {
        color: #303133;
        font-size: 16px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .subTask-detail-content {
        color: #606266;
        font-size: 14px;
    }
</style>
