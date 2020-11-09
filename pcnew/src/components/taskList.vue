<template>
    <div class="task-list">
        <header class="page-header">{{headerText}}</header>
        <div class="split-box split-box-thin"></div>
        <div class="task-search-title">
            <span @click="filterBoxShow = !filterBoxShow" :class="filterBoxShow ? '' : 'black'">{{filterBoxShow ? '收起' : '展开'}}筛选  <a-icon
                    :type="filterBoxShow ? 'caret-up' : 'caret-down'"/></span>
        </div>
        <div class="split-box split-box-thin"></div>
        <div class="search-box task-search" v-show="filterBoxShow">
            <div class="search-content search-status"
                 v-show="(pageType !== 'drafts' && pageType !== 'recycleBin' && pageType !== 'overdueList')">
                <span class="label-span">状态</span>
                <a-radio-group name="status" v-model="searchObj.status">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="1">逾期</a-radio>
                    <a-radio :value="2">正常</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-sort" v-show=" pageType !== 'recycleBin'">
                <span class="label-span">创建时间</span>
                <a-radio-group name="area" v-model="searchObj.area">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="3">3日内</a-radio>
                    <a-radio :value="7">7日内</a-radio>
                    <a-radio :value="15">15日内</a-radio>
                    <a-radio :value="30">30日内</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-level">
                <span class="label-span">级别</span>
                <a-radio-group name="level" v-model="searchObj.level">
                    <a-radio :value="-1">全部</a-radio>
                    <a-radio :value="0">普通</a-radio>
                    <a-radio :value="1">紧急</a-radio>
                    <a-radio :value="2">非常紧急</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-type" v-show=" pageType !== 'recycleBin' && pageType !== 'drafts'">
                <span class="label-span">类型</span>
                <a-radio-group name="type" v-model="searchObj.type">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="3">抄送</a-radio>
                    <a-radio :value="2">接收</a-radio>
                    <a-radio :value="1">发起</a-radio>
                </a-radio-group>
            </div>
            <div class="search-content search-type" v-show=" pageType === 'recycleBin'">
                <span class="label-span">创建时间</span>
                <a-radio-group name="areaRecycle" v-model="searchObj.areaRecycle">
                    <a-radio :value="0">全部</a-radio>
                    <a-radio :value="1">一个月内</a-radio>
                    <a-radio :value="6">半年内</a-radio>
                    <a-radio :value="12">一年内</a-radio>
                </a-radio-group>
            </div>
            <div class="search-input">
                <p class="search-group">
                    <a-input-search placeholder="任务名称" class="search-inp"
                                    :maxLength="20" v-model="searchObj.inp" @keyup.enter="search"/>
                </p>
            </div>
            <a-button type="primary" class="search-btn" @click="search">搜索</a-button>
        </div>
        <div class="split-box"></div>
        <task-list-module :page-type="pageType" :filter="filterObj"
                          :show-pagination="true" ref="taskListModule"
        ></task-list-module>

    </div>
</template>

<script>
    import taskListModule from '../components/taskListModule'

    export default {
        name: "taskList",
        props: ['pageType'],
        components: {
            taskListModule
        },
        data() {
            return {
                headerText: '',
                filterBoxShow: true,
                filterObj:{},
                searchObj: {
                    status:0,//状态
                    area: 0,//创建时间
                    level: -1,//级别
                    type: 0,//类型
                    areaRecycle: 0,//范围搜索
                    inp:''//输入框
                }
            }
        },
        created() {
            this.getType()
        },
        methods: {
            //页码改变时
            pageChange(current) {
                this.pageIndex = current;
            },
            getType() {
                if (this.pageType === 'executing') {
                    this.headerText = '执行中'
                } else if (this.pageType === 'finished') {
                    this.headerText = '已结束'
                } else if (this.pageType === 'drafts') {
                    this.headerText = '草稿箱'
                } else if (this.pageType === 'recycleBin') {
                    this.headerText = '回收站'
                } else if (this.pageType === 'allTask') {
                    this.headerText = '所有任务'
                } else if (this.pageType === 'overdueList') {
                    this.headerText = '逾期任务'
                }
            },
            //搜索
            search(){
               this.filterObj = Object.assign({},this.searchObj);
            }
        },

    }
</script>

<style lang="less" scoped>
    @import "../assets/css/taskList.less";
</style>