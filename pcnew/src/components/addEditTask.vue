<template>
    <div class="task-detail add-task">
        <div v-if="!subTaskWindowShow">
            <header class="page-header"><span class="page-title">{{headerText}}</span>
                <div style="float: right; position: relative;" id="optionBtn">
                    <a-button @click="$router.go(-1)">返回</a-button>
                    <!--发起任务按钮-->
                    <a-button @click="submitMain(0)" :disabled="submitLoading" v-if="!form.id||(form.id&&form.type==0)"
                              :loading="submitDfratsLaoding">暂存草稿
                    </a-button>
                    <a-button type="primary" @click="debounce(submitMain(1))" :loading="submitLoading"
                              :aria-disabled="submitDfratsLaoding">提交
                    </a-button>
                </div>
            </header>
            <div class="split-box split-box-thin"></div>
            <!--        任务内容-->
            <div class="add-task-content">
                <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol"
                              :wrapper-col="wrapperCol">
                    <p class="section-title">任务内容</p>
                    <a-form-model-item label="级别">
                        <a-radio-group name="level" v-model="form.level" button-style="solid">
                            <a-radio :value="0">普通</a-radio>
                            <a-radio :value="1">紧急</a-radio>
                            <a-radio :value="2">非常紧急</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="任务标题" prop="name">
                        <a-input autocomplete="off" placeholder="请添加标题，限制20个字符"
                                 :maxLength="20" v-model="form.name"/>
                    </a-form-model-item>
                    <a-form-model-item label="任务内容" prop="content">
                        <editor-bar v-model="form.content" :isClear="isClear" @change="titleChange"></editor-bar>
                    </a-form-model-item>

                    <div class="split-box"></div>
                    <p class="section-title">任务安排</p>

                    <a-form-model-item label="发起人">
                        <img src="../assets/images/taskDetail/startPeopleIcon.png" alt="" class="label-icon">
                        <div class="people-list-box" id="promoter">
                            <span class="copy-people">{{form.addUserName}}</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="接收人" prop="receiveId">
                        <img src="../assets/images/taskDetail/receivePeopleIcon.png" alt="" class="label-icon">
                        <div class="people-list-box" id="receiver" title="点击选择人员" @click="reciveUserShow = true">
                            <span class="copy-people">{{reciveUserText}}</span>
                            <input type="text" v-show="false" v-model="form.receiveId">
                            <a-icon type="right"/>
                            <span class="copy-people-count">（{{reciveUsrList.length}}人）</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="抄送人">
                        <img src="../assets/images/taskDetail/copyPeopleIcon.png" alt="" class="label-icon">
                        <div class="people-list-box" id="cc" title="点击选择人员" @click="ccUserShow = true">
                            <span class="copy-people">{{ccUserText}}</span>
                            <a-icon type="right"/>
                            <span class="copy-people-count">（{{ccUserList.length}}人）</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="任务时间" prop="startTime">
                        <a-form-model-item prop="startTime">
                            <a-date-picker
                                    v-model="form.startTime"
                                    :disabled-date="disabledStartDate"
                                    :inputReadOnly="true"
                                    :show-time="{format:'HH:mm'}"
                                    format="YYYY-MM-DD HH:mm"
                                    @change="stratTimeChange"
                                    :allowClear="false"
                                    placeholder="开始时间"/>
                        </a-form-model-item>
                        <span style="margin: 0 20px">-</span>
                        <a-form-model-item prop="endTime">
                            <a-date-picker
                                    v-model="form.endTime"
                                    :disabled-date="disabledEndDate"
                                    :inputReadOnly="true"
                                    :show-time="{format:'HH:mm'}"
                                    format="YYYY-MM-DD HH:mm"
                                    :allowClear="false"
                                    @change="endTimeChange"
                                    placeholder="结束时间"/>
                        </a-form-model-item>
                    </a-form-model-item>
                    <a-form-model-item label=" ">   <!--通知模式-->
                        <img src="../assets/images/addTask/notice.png" alt="" class="icon-img">
                        <span class="greyFont notice-type-title">{{(noticeDataObj.remind_type == 1 || noticeDataObj.remind_type == 3 )? '基础模式' :'自定义模式'}}</span>
                        <!--                        <span class="notice-type-desc">截至 3 天前进行通知，3 天未读进行通知</span>-->
                        <a-button type="link" id="changeType" @click="noticeWindowShow = true">更改模式</a-button>
                    </a-form-model-item>
                    <a-form-model-item label=" ">         <!--允许转办-->
                        <img src="../assets/images/addTask/people1.png" alt="" class="icon-img">
                        <span class="switch-name">允许转办<span class="greyFont">（允许接收人把任务转交给其他人办理）</span></span>
                        <a-switch v-model="form.isAllowTransfer"/>
                    </a-form-model-item>
                    <a-form-model-item label=" ">         <!--一键拉群-->
                        <img src="../assets/images/addTask/people2.png" alt="" class="icon-img">
                        <span class="switch-name">一键拉群<span class="greyFont">（任务发起后建立任务群）</span></span>
                        <a-switch v-model="form.isPullGroup" @change="pullGroupChange" :disabled="canPullGroup"/>
                    </a-form-model-item>
                    <a-form-model-item label=" " v-show="form.isPullGroup">         <!--包括抄送人员-->
                        <img src="../assets/images/addTask/people3.png" alt="" class="icon-img">
                        <span class="switch-name">包括抄送人员<span class="greyFont">（把抄送人员拉进任务群）</span></span>
                        <a-switch v-model="form.isIncludeCc" @change="includeCc" :disabled="canPullGroup"/>
                    </a-form-model-item>
                    <a-form-model-item label="附件">          <!--上传附件-->
                        <img src="../assets/images/addTask/annex.png" alt="" class="label-icon-upload icon-img">
                        <a-button type="link" id="openUpFileWindow" class="btn-text-underline"
                                  @click="modalUpShow = true">
                            点击上传附件
                        </a-button>
                        <file-list-module :optionType="optionType" @data="getFileList"
                                          :file-arr="form.fileArr" ref="fileList"></file-list-module>
                    </a-form-model-item>
                </a-form-model>
                <!--子任务-->
                <div class="split-box"></div>
                <div class="section-title">子任务
                    <a-button type="primary" class="addSubTask" id="addSubTask"
                              @click="openAddSubTask">新增子任务
                    </a-button>
                </div>
                <ul class="subTask-list">
                    <li class="subTask-li" title="点击查看详情" v-for="(item,index) in form.subTask" :key="index">
                        <div class="subTask-name clear-fix">
                            <p class="left">{{index+1 + '. '+item.title}}</p>
                            <p class="right">
                                <span class="editSubTask" title="" @click="editSubTask(index,item.id,form.id)"><i
                                        class="iconfont">&#xe639;</i>编辑</span>
                                <a-popconfirm title="是否确定删除该子任务" ok-text="确定" cancel-text="取消"
                                              @confirm="delSubTask(index,item.id,form.id)">
                                    <span class="delSubTask" title="点击删除"><i class="iconfont">&#xe626;</i>删除</span>
                                </a-popconfirm>
                            </p>
                        </div>
                        <div class="subTask-describe" title="点击查看详情" v-html="item.content"></div>
                        <div class="list-icon" title="点击查看详情">
                            <i class="iconfont">&#xe638;</i>
                            <span class="list-count">{{item.file_url.length ? item.file_url.length  : 0}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="split-box"></div>
            <!--        //通知模式的弹窗-->
            <notice-window :noticeWindowShow.sync="noticeWindowShow" :page-type="pageType"
                           @done="getNoticeData" :notice-data="noticeDataObj"></notice-window>
            <!--选人的弹窗-->
            <pick-user :show.sync="ccUserShow" :selected-user="ccUserList" :filter-data="ccUserFilter"
                       @done="ccUserData"></pick-user>
            <pick-user :show.sync="reciveUserShow" :selected-user="reciveUsrList" :filter-data="reciveUsrFilter"
                       @done="reciveUserData"></pick-user>
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
        </div>
        <!--子任务弹窗-->
        <div v-else>
            <sub-task-module :page-type="subPageType" :sub-data="subTaskDataBack"
                             :show-sub.sync="subTaskWindowShow"
                             @subTaskData="subTaskData"></sub-task-module>
        </div>
    </div>
</template>

<script>
    import {task} from "@/api";
    import {createGroup} from "@/assets/js/wx";
    import {debounce} from '@/assets/js/common';
    import moment from 'moment'
    import EditorBar from './wangEnduit'
    import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
    import pickUser from '../components/pickUser'
    import NoticeWindow from "../components/noticeWindow";
    import FileListModule from "./fileListModule";
    import UploadDrag from "./uploadDrag";
    import SubTaskModule from "./subTaskModule";

    // const nowDate = new Date();

    export default {
        name: "taskDetailModule",
        props: ['pageType'],
        components: {
            SubTaskModule,
            UploadDrag, FileListModule, NoticeWindow, AFormModelItem, EditorBar, pickUser
        },
        data() {
            return {
                headerText: '',
                addTask: {
                    btnArrShow: true
                },
                addUser: {
                    name: '',
                    id: null
                },
                labelCol: {span: 2},
                wrapperCol: {span: 16},
                form: {
                    id: null,
                    level: 0,//任务等级
                    name: '',//任务名称
                    content: '',//任务内容
                    addUserName: '',//发起人姓名
                    addUserId: null,//发起人ID
                    receiveId: '',//接收人id
                    ccId: '',//抄送人id
                    noticeArr: [],
                    isAllowTransfer: false,
                    isPullGroup: false,
                    isIncludeCc: false,
                    startTime: null,//开始时间
                    endTime: null,//结束时间
                    fileArr: [],//任务文件
                    subTask: [],//子任务
                    chatId: '',
                },
                isClear: false,
                countLength: 0,//输入框的长度
                contentText: '',//输入框纯文本
                rules: {
                    name: [{required: true, message: '标题不能为空', trigger: 'blur'},
                        {max: 20, message: '输入字符应在20字内', trigger: 'blur'}],
                    content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
                    startTime: [{required: true, message: '开始时间不能为空', trigger: 'change'}],
                    endTime: [{required: true, message: '结束时间不能为空', trigger: 'change'}],
                    receiveId: [{required: true, message: '接收人不能为空', trigger: 'change'}],
                },
                noticeWindowShow: false,//通知模式弹窗
                noticeDataObj: {
                    remind_type: 1,
                    remind_data: [
                        {
                            id: null,
                            default_type: '1,2,3,4,5',
                            is_re_reminder: 2,
                            rate: 1,
                            reminder: 1,
                            operate_type: 1,//操作类型1新增2修改3删除
                        }
                    ]
                },//通知模式数据
                ccUserShow: false,//抄送人选人弹窗
                reciveUserShow: false,//接收人选人弹窗
                ccUserList: [],//抄送人选人列表
                reciveUsrList: [],//接收人选人列表
                ccUserFilter: [],//抄送用户列表限制
                reciveUsrFilter: [],//接收用户限制
                ccUserText: '',
                reciveUserText: '',
                // ccUserId: '',
                // receiveUserId: '',
                receiverDepId: '',
                optionType: this.pageType === 'taskDetail' ? 'detail' : 'add',
                submitLoading: false,//提交loading
                submitDfratsLaoding: false,

                /*上传弹窗*/
                modalUpTitle: '上传文件',
                modalUpType: 'add',//弹窗类型
                modalUpShow: false,//弹窗显示
                confirmUpLoading: false,//表单确定加载状态
                /*子任务*/
                subTaskWindowShow: false,//打开子任务弹窗
                subTaskIndex: null,//子任务下标
                subTaskId: null,//子任务id
                subTaskDataBack: {},//子任务回显数据
                subPageType: 'addSubTask',
                /*编辑任务*/
                taskId: this.$route.query.id,
                urgingUser: [],
                canPullGroup: false,
            }
        },
        watch: {
            reciveUsrList(val) {
                if (val.length > 0) {
                    this.ccUserFilter = []
                    val.forEach(item => {
                        this.ccUserFilter.push(item.id)
                    })
                }
            },
            ccUserList(val) {
                if (val.length > 0) {
                    this.reciveUsrFilter = []
                    val.forEach(item => {
                        this.reciveUsrFilter.push(item.id)
                    })
                }
            },
        },
        created() {
            this.getPageType();
        },
        methods: {
            moment,
            debounce,
            //统计字符数量
            titleChange(val) {
                this.form.content = val;
            },
            //获取页面类型
            getPageType() {
                if (this.pageType === 'addTask') {
                    this.headerText = '发起任务'
                    //获取发起人
                    let obj = sessionStorage.getItem('userInfo');
                    obj = JSON.parse(obj);
                    this.addUser = obj;
                    this.reciveUsrFilter = [];
                    this.ccUserFilter = [];
                    this.reciveUsrFilter.push(obj.user_login)
                    this.ccUserFilter.push(obj.user_login)
                    this.form.addUserName = obj.name
                    //获取初始任务时间
                    this.form.startTime = moment(new Date());
                    this.form.endTime = moment(new Date()).add(3, 'days');
                } else if (this.pageType === 'editTask') {
                    this.headerText = '编辑任务'
                    this.getData();
                } else {
                    this.headerText = '发起任务'
                }
            },
            //开始时间限制
            disabledStartDate(startValue) {
                const endValue = this.form.endTime;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            //结束时间限制
            disabledEndDate(endValue) {
                const startValue = this.form.startTime;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();

            },
            //开始时间改变时
            stratTimeChange(value) {
                this.form.startTime = value
            },
            //结束时间改变时
            endTimeChange(value) {
                this.form.endTime = value
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
            //选人组件的数据 --抄送人
            ccUserData(data) {
                this.ccUserList = [].concat(data.user)
                //关闭拉群
                let arr = this.reciveUsrList.concat(this.ccUserList)
                if (arr.length < 3) {
                    this.form.isPullGroup = false
                }
                if (this.ccUserList.length > 0) {
                    let name = [];
                    data.user.forEach((item) => {
                        name.push(item.name)
                    })
                    this.ccUserText = name.length > 0 ? name.join(',') : ''
                    this.form.ccId = data.userId.join(',')
                } else {
                    this.ccUserText = ''
                    this.form.ccId = ''
                }
            },
            //选人组件的数据 --接收人
            reciveUserData(data) {
                // console.log(data.user)
                this.reciveUsrList = [].concat(data.user)
                //关闭拉群
                let arr = this.reciveUsrList.concat(this.ccUserList)
                if (arr.length < 3) {
                    this.form.isPullGroup = false
                }
                this.urgingUser = data.user;
                if (this.reciveUsrList.length > 0) {
                    this.receiverDepId = data.dep.join(',');
                    let name = [];
                    data.user.forEach((item) => {
                        name.push(item.name)
                    })
                    // this.reciveUserText = name.join('，')
                    this.reciveUserText = name.length > 0 ? name.join(',') : ''
                    this.form.receiveId = data.userId.join(',')
                } else {
                    this.reciveUserText = ''
                    this.form.receiveId = ''
                }
            },
            //子任务组件的数据
            subTaskData(data) {
                // console.log(data)
                if (this.subPageType === 'editSubTask') {
                    this.form.subTask[this.subTaskIndex] = data;
                } else {
                    this.form.subTask.push(data);
                }
            },
            //获取通知模式数据
            getNoticeData(data) {
                console.log(data)
                this.noticeDataObj = data

            },
            //一键拉群
            pullGroupChange(val) {
                let arr = this.reciveUsrList.concat(this.ccUserList)
                if (val) {
                    if (arr.length < 2) {
                        this.$message.warning('当前任务相关人员不足三人，无法拉群！', 2)
                        this.form.isPullGroup = false
                    } else if (this.reciveUsrList.length === 1 && this.ccUserList.length >= 1) {
                        this.form.isIncludeCc = true
                    } else if (this.reciveUsrList.length === 1 && this.form.isIncludeCc == false) {
                        this.form.isIncludeCc = true
                    } else if (arr.length > 1999) {
                        this.form.isIncludeCc = false
                        this.form.isPullGroup = false
                        this.$message.warning('拉群人数不能大于两千！')
                    }
                } else {
                    this.form.isIncludeCc = false
                }
            },
            //包含抄送人
            includeCc() {
                let arr = this.reciveUsrList.concat(this.ccUserList)
                if (this.reciveUsrList.length === 1 && this.ccUserList.length >= 1) {
                    this.form.isIncludeCc = true
                    this.$message.warning('关闭后任务相关人数不足三人，无法拉群！')
                } else if (arr.length > 1999) {
                    this.form.isIncludeCc = false
                    this.form.isPullGroup = false
                    this.$message.warning('拉群人数不能大于两千！')
                }

            },
            //提交
            submitMain(type) {
                // 添加时 type=1提交，type=0 暂存草稿
                // console.log(this.form,this.noticeDataObj);
                var that = this
                that.$refs.ruleForm.validate(async valid => {
                    if (valid && that.reciveUsrList.length > 0) {
                        if (that.form.subTask.length > 0) {
                            that.form.subTask.forEach((item, index) => {
                                item.no = index
                            })
                        }
                        let param = {
                            level: that.form.level,
                            title: that.form.name,
                            content: that.form.content,
                            start_time: moment(that.form.startTime).format('YYYY-MM-DD HH:mm'),
                            end_time: moment(that.form.endTime).format('YYYY-MM-DD HH:mm'),
                            is_pull_group: that.form.isPullGroup ? 1 : 0,
                            is_includ_cc: that.form.isIncludeCc ? 1 : 0,
                            is_allow_transfer: that.form.isAllowTransfer ? 1 : 0,
                            receive_userid: that.form.receiveId,
                            dep_list: that.receiverDepId,
                            cc_userid: that.form.ccId,
                            remind_model_id: 1,//通知模式
                            file_url: that.form.fileArr,
                            son: that.form.subTask,
                            chatid: that.form.chatId,
                            remind_type: this.noticeDataObj.remind_type,
                            remind_data: this.noticeDataObj.remind_data
                        };
                        //判断当前发布的任务是否已逾期
                        if (param.end_time <= moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                            that.$message.error("任务结束时间必须大于开始时间");
                            // that.$confirm({
                            //     title: '任务结束时间小于现在时间，您是否确认发布一个已逾期的任务?',
                            //     content: '',
                            //     centered: true,
                            //     async onOk() {
                            //         try {
                            //             if (type === 1) {
                            //                 that.submitLoading = true;
                            //             } else {
                            //                 that.submitDfratsLaoding = true
                            //             }
                            //             let fn;
                            //             if (that.pageType === 'addTask') {
                            //                 param.type = type
                            //                 fn = await task.add(param)
                            //             } else if (that.pageType === 'editTask') {
                            //                 param.type = type
                            //                 param.id = that.form.id;
                            //                 param.tagid = that.form.tagid;
                            //                 param.parent_id = that.form.tagid;
                            //                 // if (param.remind_data.length > 0){
                            //                 //     param.remind_data.forEach(item=>{
                            //                 //         item.operate_type = 2
                            //                 //     })
                            //                 // }
                            //                 fn = await task.edit(param);
                            //             }
                            //             const {code, msg, data} = fn;
                            //             if (code === 1) {
                            //                 if (data.is_pull_group == 1 && data.type == 1) {
                            //                     createGroup(data);
                            //                 }
                            //                 if (type === 1) {
                            //                     that.submitDfratsLaoding = false;
                            //                     that.submitLoading = false;
                            //                     that.$message.success(msg + '  即将跳转到执行中任务列表...', 2);
                            //                     setTimeout(() => {
                            //                         that.$router.push('/taskList/executing')
                            //                     }, 2000)
                            //                 } else {
                            //                     that.submitDfratsLaoding = false;
                            //                     that.submitLoading = false;
                            //                     that.$message.success(msg + '  即将跳转到草稿箱任务列表...', 2);
                            //                     setTimeout(() => {
                            //                         that.$router.push('/taskList/drafts')
                            //                     }, 2000)
                            //                 }

                            //             } else {
                            //                 that.submitDfratsLaoding = false;
                            //                 that.submitLoading = false;
                            //                 that.$message.error(msg, 2)
                            //             }
                            //         } catch {
                            //             that.submitDfratsLaoding = false;
                            //             that.submitLoading = false;
                            //         }
                            //     }
                            // });
                        } else {
                            try {
                                if (type === 1) {
                                    that.submitLoading = true;
                                } else {
                                    that.submitDfratsLaoding = true
                                }
                                let fn;
                                if (that.pageType === 'addTask') {
                                    param.type = type
                                    fn = await task.add(param)
                                } else if (that.pageType === 'editTask') {
                                    param.type = type
                                    param.id = that.form.id;
                                    param.tagid = that.form.tagid;
                                    param.parent_id = that.form.tagid;
                                    // if (param.remind_data.length > 0){
                                    //     param.remind_data.forEach(item=>{
                                    //         item.operate_type = 2
                                    //     })
                                    // }
                                    fn = await task.edit(param);
                                }
                                const {code, msg, data} = fn;
                                if (code === 1) {
                                    if (data.is_pull_group == 1 && data.type == 1) {
                                        createGroup(data);
                                    }
                                    if (type === 1) {
                                        that.submitDfratsLaoding = false;
                                        that.submitLoading = false;
                                        that.$message.success(msg + '  即将跳转到执行中任务列表...', 2);
                                        setTimeout(() => {
                                            that.$router.push('/taskList/executing')
                                        }, 2000)
                                    } else {
                                        that.submitDfratsLaoding = false;
                                        that.submitLoading = false;
                                        that.$message.success(msg + '  即将跳转到草稿箱任务列表...', 2);
                                        setTimeout(() => {
                                            that.$router.push('/taskList/drafts')
                                        }, 2000)
                                    }

                                } else {
                                    that.submitDfratsLaoding = false;
                                    that.submitLoading = false;
                                    that.$message.error(msg, 2)
                                }
                            } catch {
                                that.submitDfratsLaoding = false;
                                that.submitLoading = false;
                            }
                        }
                    } else {
                        that.submitLoading = false;
                        that.submitDfratsLaoding = false
                        that.$message.error('检验失败，请检查输入项！', 2);
                        return false;
                    }
                });
            },

            /*
            * 子任务
            * */
            //打开新增子任务窗口
            openAddSubTask() {
                this.subTaskWindowShow = true;
                this.subPageType = 'addSubTask'
                let _subtask_lead_user = []
                let _subtask_lead_username = []
                this.reciveUsrList.forEach(item => {
                    let nameparams = {name: ''}
                    _subtask_lead_user.push(item.id)
                    nameparams.name = item.name
                    _subtask_lead_username.push(nameparams)
                })
                // this.subTaskDataBack.subtask_lead_user = _subtask_lead_user.join(',')
                // this.subTaskDataBack.subtask_lead_username = _subtask_lead_username
            },
            //打开编辑子任务窗口
            async editSubTask(index, id, pid) {
                this.subPageType = 'editSubTask'
                this.subTaskIndex = index;
                // console.log(id && pid)
                if (id && pid) {
                    this.subTaskId = id;
                    let params = {
                        id: id
                    }
                    const {msg, code, data} = await task.getSubInfoById(params)
                    if (code) {
                        this.subTaskDataBack = data;
                        // this.subTaskDataBack = this.form.subTask[index];
                        this.subTaskWindowShow = true;
                    } else {
                        this.$message.error(msg, 2)
                    }

                } else {
                    this.subTaskDataBack = this.form.subTask[index]
                    this.subTaskWindowShow = true;
                }
            },
            //删除子任务
            async delSubTask(index, id, pid) {
                if (id && pid) {
                    let params = {
                        id: id,
                        pid: pid,
                    }
                    const {msg, code} = await task.delSub(params)
                    if (code) {
                        this.$message.success('删除子任务成功！', 2)
                        this.getSubTask();
                    } else {
                        this.$message.error(msg, 2)
                    }
                } else {
                    this.form.subTask.splice(index, 1)
                    this.$message.success('删除子任务成功！', 2)
                }
            },
            /*
            * 编辑任务
            * */
            //获取任务数据
            async getData() {
                const {code, msg, data} = await task.getInfo({id: this.taskId})
                if (code) {
                    this.form.id = data.id;
                    this.form.chatId = data.chatid;
                    this.form.progress = data.completion;
                    this.form.level = data.level;
                    this.form.name = data.title;
                    this.form.content = data.content;
                    this.form.addUserName = data.username[0].name;
                    this.reciveUsrList = data.receive_username;
                    let dep = data.dep_list ? data.dep_list.split(",") : [];
                    this.reciveUsrList.forEach((item, index) => {
                        item.dep = dep[index];
                    })
                    this.form.receiveId = data.receive_userid;
                    this.ccUserList = data.cc_username;
                    this.receiverDepId = data.dep_list;
                    this.form.fileArr = data.file_url;
                    this.form.type = data.type;
                    // this.form.subTask = data.son;
                    this.form.startTime = moment(data.start_time);
                    this.form.endTime = moment(data.end_time);
                    this.form.taskRole = data.role;
                    this.form.isAllowTransfer = data.is_allow_transfer === 1 ? true : false;
                    this.form.isIncludeCc = data.is_includ_cc === 1 ? true : false;
                    this.form.isPullGroup = data.is_pull_group === 1 ? true : false;
                    this.noticeDataObj.remind_type = data.remind_type;
                    if (data.remind_model.length > 0) {
                        if (data.remind_type == 1) {
                            if (data.remind_model[0].is_re_reminder == 2)
                                Object.keys(this.noticeDataObj.remind_data[0]).forEach(item => {
                                    this.noticeDataObj.remind_data[0][item] = data.remind_model[0][item];
                                })
                        } else {
                            this.noticeDataObj.remind_data = data.remind_model;
                        }
                        this.noticeDataObj.remind_data.forEach(item => {
                            item.operate_type = 2
                        })
                    }
                    //判断拉群 有群聊id时候不能再次拉群
                    if (data.chatid && this.pageType === 'editTask') {
                        this.canPullGroup = true
                    }
                    //判断按钮
                    this.getSubTask()
                    //接收人名字
                    if (data.receive_username.length > 0) {
                        let receiveName = []
                        data.receive_username.forEach((item) => {
                            receiveName.push(item.name)
                        })
                        this.reciveUserText = receiveName.join(',')
                        this.urgingUser = data.receive_username;
                        this.urgingUser.forEach(item => {
                            if (!item.id) item.id = item.userid;
                        })
                    }
                    //抄送人名称
                    if (data.cc_username.length > 0) {
                        let ccName = []
                        data.cc_username.forEach((item) => {
                            ccName.push(item.name)
                        })
                        this.ccUserText = ccName.join(',')
                    }
                } else {
                    this.$message.error(msg)
                }
            },
            //获取子任务列表
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
                }
            },

        },

    }
</script>

<style scoped>
    @import "../assets/css/addTask.css";
</style>
