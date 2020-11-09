<template>
    <div class="task-detail add-task">
        <header class="page-header"><span class="page-title">任务详情</span>
            <div style="float: right; position: relative;" id="optionBtn">
                <a-button @click="$router.go(-1)">返回</a-button>
                <a-button type="primary" class="btn-drafts" @click="downLadMore">下载文件到本地</a-button>
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
            </a-form-model>
        </div>
        <div class="split-box"></div>
        <div class="file-table">
            <div class="file-table-title">
                <div></div>
                <div class="content">
                    <a-input-search placeholder="请输入用户名或文件名" v-model="searchWord" @keyup.enter.native="getFile"/>
                    <a-button type="primary" class="search-btn" @click="getFile">查询</a-button>
                </div>
            </div>
            <div class="table-content" v-if="data.length > 0">
                <a-table :data-source="data" :pagination="false" :loading="loading"
                         @change="handleTableChange" :row-selection="rowSelection"
                         :rowKey="(record,index)=>{return index}">
                    <!--title 标题  dataIndex数据字段 key vue需要的key-->
                    <a-table-column key="username" title="上传人" data-index="username" :width="180" align="center"/>
                    <a-table-column key="dep" title="归属公司部门" data-index="dep" :width="180" align="center">
                        <template slot-scope="record">
                            <span>{{record ? record : '（空）'}}</span>
                        </template>
                    </a-table-column>
                    <a-table-column key="" title="文件名" :ellipsis="true">
                        <template slot-scope="record">
                            <div>
                                <img :src="record.fileIcon" alt="" class="file-icon" align="middle">
                                <span>{{record.name}}</span>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column key="time" title="上传时间" data-index="time" :width="180"
                                    align="center"></a-table-column>
                    <a-table-column key="action" title="操作" align="center" :width="180">
                        <template slot-scope="record">
                            <span>
                                 <a-button type="link" @click="viewFile(record)">查看</a-button>
                                 <a-button type="link" @click="download(record)">下载</a-button>
                            </span>
                        </template>
                    </a-table-column>
                </a-table>
            </div>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </div>
        <view-file :viewData="viewData" @viewCancel="viewCancel($event)"></view-file>
        <a-modal
                title="生成压缩文件"
                :visible="downZipShow"
                :footer="null"
                centered
                @cancel="downZipShow = false"
        >
            <div class="view_text">
                <div>提示</div>
                <div>压缩文件生成中，请稍等...</div>
                <a-progress :percent="downPrecent" status="active"/>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {task} from "@/api";
    import commonFn from '@/assets/js/common';
    import viewFile from "../../components/viewFile";
    export default {
        name: "seeTaskFile",
        components:{
            viewFile,
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
                    taskRole: null,
                },
                data: [],//表格数据
                selectedRows: [],//选择列
                loading: false,//加载
                pagination: {
                    current: 1,//当前页
                    pageSize: 2,//每页多少条
                    total: 1//总条数
                },
                searchWord: '',//搜索
                tableCheck: [],
                viewData:{
                    showPdf: false,
                    show:false,//是否显示生成预览页提示
                    fileData:{},
                },//预览页组件data
                downZipShow:false,//下载压缩包弹窗
                downPrecent:0,//下载压缩包进度

            }
        },
        computed: {
            //勾选列
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys)
                        this.tableCheck = [].concat(selectedRows)
                    },
                };
            },
        },
        methods: {
            //获取数据
            async getData() {
                const {code, msg, data} = await task.getInfo({id: this.taskId});
                if (code) {
                    this.form.id = data.id;
                    this.form.progress = data.completion;
                    this.form.level = data.level;
                    this.form.name = data.title;
                    this.form.content = data.content;
                } else {
                    this.$message.error(msg)
                }
            },
            //获取文件
            async getFile() {
                let params = {
                    name: this.searchWord,
                    id: this.taskId,
                }
                const {code, msg, data} = await task.getFileTask(params);
                if (code) {
                    data.forEach(item=>{
                        if(!item.fileIcon){
                            item.fileIcon = item.save_path?this.getIcon(item.save_path):require(`@/assets/images/defaultImg.jpg`);
                        }
                    })
                    this.data = data;
                } else {
                    this.$message.error(msg)
                }
            },
            getIcon(file) {
                let index1 = file.lastIndexOf(".") + 1;
                let index2 = file.length;
                let type = file.substring(index1,index2);
                if (type == "7z" || type == "zip") {
                    type = "rar";
                }
                let typeList = ["doc", "xls", "ppt", "pdf", "zip", "7z", "rar"];
                let icon = require("@/assets/images/defaultImg.jpg");
                let iconType = typeList.find((item) => type.includes(item));
                if (iconType) {
                    icon = require(`@/assets/images/taskDetail/${iconType}.png`);
                } else {
                 icon = require(`@/assets/images/defaultImg.jpg`);
                }
                return icon;
            },
            //页码改变时
            handleTableChange(pagination) {
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                this.getData();
            },
            //下载
            download(data) {
                commonFn.downLoadFile(data.name, data.save_path)
            },
            //批量下载
            async downLadMore() {
                let name = [], path = [];
                if (this.tableCheck.length > 0) {
                    this.downZipShow = true
                    this.downPrecent = 0
                    let timer = setInterval(()=>{
                        this.downPrecent = this.downPrecent + 5
                        this.downPrecent = this.downPrecent == 95 ? 95 : this.downPrecent;
                    },600)
                    // setTimeout(()=>{
                    //     clearInterval(timer);
                    //     this.$message.error('压缩文件生成失败',2)
                    // },10000)
                    this.tableCheck.forEach(item => {
                        name.push(item.name)
                        path.push(item.save_path)
                    })
                    let params = {
                        id: this.taskId,
                        file_name: name ? name.join(',') : '',
                        file_path: path ? path.join(',') : '',
                    }
                    const {code, data, msg} = await task.downLoadMoreFile(params)
                    if (code) {
                        setTimeout(()=>{
                            clearInterval(timer)
                            this.downPrecent = 100
                            this.downZipShow = false
                            setTimeout(()=>{
                                commonFn.downLoadFile(data.name, data.url)
                            },500)
                        },2000)
                    } else {
                        clearInterval(timer)
                        this.downZipShow = false
                        this.downPrecent = 0
                        this.$message.error(msg, 2)
                    }
                }else {
                    this.$message.warning('请至少选择一个文件',2)
                }
            },
            //预览
            viewFile(v){
                // console.log(v, this.viewData.show)
                this.viewData.fileData = JSON.parse(JSON.stringify(v))
                this.viewData.show = true
            },
            //取消预览
            viewCancel(val){
                this.viewData.show = val
            }

        },
        created() {
            this.getData();
            this.getFile();
        }
    }
</script>

<style scoped>
    @import "../../assets/css/addTask.css";
</style>
<style scoped lang="less">
    .add-task .add-task-content .label-icon-upload {
        top: 10px;
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

    /*任务表格*/
    .file-table {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        margin-top: 20px;

        .file-table-title {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: right;
            margin-bottom: 10px;

            .content {
                width: 30%;
                height: 100%;
                display: inline-flex;
                justify-content: flex-end;
                align-items: center;
                text-align: right;
            }

            .search-btn {
                margin-left: 10px;
            }
        }

        .file-icon {
            width: 26px;
            height: 26px;
            margin-right: 10px;
            vertical-align: middle;
        }
    }
</style>