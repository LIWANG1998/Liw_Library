<template>
    <div class="task-detail-schedule">
        <div class="task-detail-title section-title">
            <p class="title">进度 （<span class="schedule-count">{{scheduleList.length}}</span>）</p>
            <div class="search-input">
                <p class="search-group">
                    <a-input-search placeholder="请输入用户名" class="search-inp" v-model="searchName" @keyup.enter.native="getSchedule"/>
                </p>
                <a-button type="primary" class="search-btn" id="searchSchedule" @click="getSchedule">查询</a-button>
            </div>
        </div>
        <ul class="task-schedule-ul clear-fix" v-if="scheduleList.length > 0">
            <li class="task-schedule-li clear-fix" v-for="(item,index) in scheduleList" :key="index"
                v-show="!item.isEmpty">
                <div class="person-info">
                    <img :src="item.username.length > 0 ? item.username[0].avatar: errorImg"
                         :onerror="errorImg" alt="" class="person-avatar">
                    <span class="user-name">{{item.username.length > 0 ? item.username[0].name : '未知'}}</span>
                    <span class="file-status greenFont" :class="item.statusClass">{{item.statusName}}</span>
                </div>
                <div class="schedule-desc"><span>备注：</span>{{item.remarks ? item.remarks : '(空)'}}</div>
                <div class="schedule-file clear-fix">
                    <div class="schedule-file-list" v-for="(v,i) in item.file_url" :key="index+'-'+i">
                        <div class="top">
                            <img :src="v.fileIcon ? v.fileIcon : v.save_path" alt="" class="file-icon"  :onerror="errorImg2">
                            <span class="file-name">{{v.name}}</span>
                        </div>
                        <div class="bottom">
                            <span class="upload-people">{{v.username}}</span>
                            <span class="upload-time">上传日期：{{v.time}}</span>
                            <a-button type="link" class="btn-text-underline" @click="down(v.name,v.save_path)" v-if="!isCc">下载</a-button>
                            <a-button type="link" class="btn-text-underline" @click="viewFile(v)">预览</a-button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="no-data" v-else>
            <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
        </div>
        <view-file :viewData="viewData" @viewCancel="viewCancel($event)"></view-file>
    </div>
</template>

<script>
    import {task} from "@/api";
    import commonFn from '@/assets/js/common'
    import viewFile from "./viewFile";
    // import moment from 'moment'
    export default {
        name: "scheduleListModule",
        props: {
            id: {type: Number},
            pid: {type: Number},
            dataArr: {type: Array},
            isCc:{type:Boolean,default: false}//抄送人不能下载
        },
        components:{
            viewFile,
        },
        data() {
            return {
                pageType: this.$route.query.pageType,
                taskId:this.id,
                pId:this.pid,
                searchName: '',
                scheduleList: [],
                errorImg: 'this.src="' + require('@/assets/images/userDefault.png') + '"',
                errorImg2: 'this.src="'+require('@/assets/images/nodata.png')+'"',
                viewData:{
                    showPdf: false,
                    show:false,//是否显示生成预览页提示
                    fileData:{},
                },//预览页组件data
            }
        },

        watch:{
            id(val){
                this.taskId = val;
                this.pId = this.pid;
                this.getSchedule()
            },
        },
        mounted() {
            this.getSchedule()
        },
        methods: {
            //获取任务进度
            async getSchedule() {
                let params = {
                    id: this.taskId,
                    pid: this.pId,
                    page: 1,
                    num: 1000,
                    name: this.searchName,
                };
                if (this.pageType == 'recycleBin') {
                    params.is_recovery = true
                }
                const {code, data} = await task.getProgressList(params);
                if (code) {
                    if (data.data) {
                        this.scheduleList = data.data;
                        this.scheduleList.forEach(item => {
                            if (item.status === 1) { //0未完成 1已完成
                                item.statusClass = 'green';
                                if (item.pid === 0) {
                                    item.statusName = '已完成-主任务-' + item.title;
                                } else {
                                    item.statusName = '已完成-子任务-' + item.title;
                                }
                            } else {
                                item.statusClass = 'red';
                                if (item.pid === 0) {
                                    item.statusName = '未完成-主任务-' + item.title;
                                } else {
                                    item.statusName = '未完成-子任务-' + item.title;
                                }
                            }
                            // 判断是否为空状态 --空状态不显示
                            if (item.status === 0 && item.file_url.length === 0 && item.remarks === '') {
                                item.isEmpty = false
                            }
                            //判断任务文件类型
                            if (item.file_url.length > 0) {
                                item.file_url.forEach(v => {
                                    let fileType = v.name.split('.')[1];
                                    if (!v.fileIcon) {
                                        v.fileIcon = commonFn.judeFileType(fileType, item.save_path)
                                    }
                                })
                            }
                        });
                    }
                }
            },
            //下载文件
            down(name, url) {
                commonFn.downLoadFile(name, url)
            },
            //预览
            viewFile(v){
                this.viewData.fileData = JSON.parse(JSON.stringify(v))
                this.viewData.show = true
            },
            //取消预览
            viewCancel(val){
                this.viewData.show = val
            }

        }
    }
</script>

<style scoped>
    @import "../assets/css/addTask.css";
</style>