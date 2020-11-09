<template>
    <div>
        <a-modal title="更新进度"
                 :visible="updateWindow" :confirm-loading="confirmUpLoading" :centered="true"
                 :destroyOnClose="true"
                 @ok="updateProgress" @cancel="closeWindow">
            <div class="update-progress-content">
                <div class="update-progress-content-top">
                    <p class="progress-title">完成状态</p>
                    <a-radio-group v-model="dataForm.finishType">
                        <a-radio :value="0">未完成</a-radio>
                        <a-radio :value="1">已完成</a-radio>
                    </a-radio-group>
                    <div class="area-box">
                        <a-textarea placeholder="请输入..." :rows="4" v-model="dataForm.content"
                                    :maxLength="500"/>
                        <span class="count-length">{{dataForm.content.length}} / 500</span>
                    </div>
                </div>
                <div class="upload-box-window">
                    <div class="upload-annex">
                        <img src="@/assets/images/addTask/annex.png" alt="" class="icon-img">
                        <span>附件</span>
                        <!--                        <a-button type="link" id="openUpFileWindow" class="btn-text-underline" @click="modalUpShow = true">-->
                        <!--                            选择上传附件-->
                        <!--                        </a-button>-->
                    </div>
<!--                    <upload-drag></upload-drag>-->
                    <upload-drag ref="updateUpload" :default-file-list="dataForm.fileList"></upload-drag>
                </div>
                <div class="progress-people">
                    <p class="progress-title">选择通知人 <span>(除发起人\接收人以外的人员)</span></p>
                    <select-people-tags :people-arr="dataForm.userList" :filter-data="updateUserFilter"
                                        ref="updatePeople"></select-people-tags>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {task} from "@/api";
    import UploadDrag from "./uploadDrag";
    import SelectPeopleTags from "./selectPeopleTags";

    export default {
        name: "updateProgress",
        components: {
            SelectPeopleTags,
            UploadDrag,
        },
        props: {
            updateForm: {type: Object},
            show: {type: Boolean, default: false},
            filterPeople:{type:Array}
        },
        data() {
            return {
                // updateWindow: this.show,//更新进度弹窗
                dataForm: {
                    id: null,
                    taskId: null,
                    finishType: 0,//更新进度-完成状态
                    userList: [],//更新进度-选择的人
                    userId: [],//更新进度-选择的人的id
                    fileList: [],//更新进度 - 文件列表
                    content: '',//更新进度描述
                    isChild: 0,//是否是子任务 0主任务 1子任务
                },
                updateUserFilter: this.filterPeople ? this.filterPeople :[],//更新进度筛选人
                confirmUpLoading:false
            }
        },
        watch: {
            updateForm: {
                handler(val) {
                    this.dataForm = val;
                },
                deep: true
            },
        },
        computed: {
            updateWindow: {
                get: function () {
                    return this.show;
                },
                set: function (val) {
                    // console.log(val);
                    this.$emit("update:show", val);
                },
            }, 
        },
        methods: {
            async updateProgress() {
                // console.log(this.updateForm.isChild);
                this.confirmUpLoading = true
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
                if (this.updateForm.isChild == 1) {
                    params.pid = this.updateForm.taskId;
                }
                const {code, msg} = await task.updateProgress(params)
                if (code==1) {
                    this.confirmUpLoading = false;
                    this.updateWindow = false;
                    this.$message.success(msg, 2)
                    // this.$forceUpdate()
                    this.$emit('done',code)
                } else {
                    this.confirmUpLoading = false;
                    this.$message.error(msg, 2)
                }
            },
            //close
            closeWindow(){
                this.updateWindow = false;
            },
        },

    }
</script>

<style scoped>
/deep/.ant-modal-body{
    max-height: 700px;
    overflow-y: scroll;
}
</style>