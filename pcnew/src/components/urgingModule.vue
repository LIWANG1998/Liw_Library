<template>
    <a-modal
            title="请选择人员"
            :visible.sync="_show"
            v-if="_show"
            footer
            centered
            width="600px"
            class="pickUserBox"
            @cancel="_show = false;checkUserId=[];"
            :destroyOnClose="true"
            :center="true"
    >   
        <a-spin :spinning="loadding">
            <div>
                <a-row>
                    <a-col :span="12" class="left-box" style="position: relative">
                        <template v-if="!dataType">
                            <!--左边节点-->
                            <div class="box" v-if="userList && userList.length > 0">
                                <a-checkbox-group @change="checkChange" v-model="idArr">
                                    <a-row v-for="(item, index) in userList" :key="index">
                                        <a-checkbox :value="item.id" :disabled="isLook">{{ item.name }}</a-checkbox>
                                    </a-row>
                                </a-checkbox-group>
                            </div>
                            <!--搜索空数据-->
                            <div class="no-data" v-else>
                                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img"/>
                            </div>
                        </template>
                        <template v-else>
                            <a-row v-if="!preview">
                                <!--搜索-->
                                <a-col :span="18" height>
                                    <a-input style="width: 100%" clearable
                                            v-model="keyword" @clear="btnSearch" @keyup.enter.native="btnSearch"
                                            placeholder="请输入成员姓名查询" size="small"></a-input>
                                </a-col>
                                <a-col :span="5" style="margin-left: 4px">
                                    <a-button type="primary" icon="search" size="small" @click="btnSearch"></a-button>
                                </a-col>
                            </a-row>
                            <div class="tree-box" v-if="treeData.length> 0 || userIdList.length > 0">
                                <a-tree v-if="dataType==1" node-key="checkId" ref="struct" checkable blockNode
                                        :show-icon="true" :check-strictly="true" :check-on-click-node="true"
                                        :default-expand-all="true"
                                        :expand-on-click-node="false" :tree-data="treeData" :replace-fields="replaceFields"
                                        v-model="checkUserId" @select="checkChange"
                                >
                                    <a-icon slot="switcherIcon" type="folder"/>
                                </a-tree>
                                <div v-else class="box">
                                    <div class="item" v-for="(item, index) in userIdList" :key="index">
                                        {{item.name}}
                                    </div>
                                </div>
                            </div>
                            <div class="no-data" v-else>
                                <img
                                        src="@/assets/images/nodata.png"
                                        alt="暂无数据"
                                        class="no-data-img"
                                />
                            </div>
                        </template>
                    </a-col>
                    <!--右边选中的人-->
                    <a-col :span="12" class="right-box">
                        <div class="selectedNum">已选中（ {{ userIdList.length }} ）</div>
                        <div class="checkedBox">
                            <!-- 已选用户 -->
                            <div
                                    v-for="(value, key) in userIdList"
                                    :key="key"
                                    class="checkedUser"
                                    @click="openInfo(value)"
                            >
                                <div :key="key">
                                    <span>{{ value.name }}</span>
                                    <span v-if="dataType==1&&preview">
                                        <span class="gray" v-if="value.is_look==0">
                                            未阅读
                                        </span>
                                        <span class="blue" v-if="value.is_look==1&&value.receive_status==0">
                                            已阅读
                                        </span>
                                        <span class="green" v-if="value.is_look==1&&value.receive_status==1">
                                            已完成
                                        </span>
                                    </span>
                                    <span v-if="dataType==2&&preview">
                                        <span class="gray" v-if="value.is_see==0">
                                            未阅读
                                        </span>
                                        <span class="blue" v-else>
                                            已阅读
                                        </span>
                                    </span>
                                    <a-icon
                                            v-if="!preview&&!isLook"
                                            type="close"
                                            @click.stop="delChecked(key)"
                                            class="close-icon"
                                    />
                                </div>
                            </div>
                        </div>
                    </a-col>
                </a-row>
                <div slot="footer" class="dialog-footer alignR pd20">
                    <a-button @click="_show = false" slot-scope>取 消</a-button>
                    <a-button type="primary" @click="btnSave" style="margin-left: 20px" v-if="!preview&&!isLook">确 定
                    </a-button>
                </div>
            </div>
        </a-spin>
    </a-modal>
</template>

<script>
    import {task} from "@/api";
    //催办弹窗，没有回显，显示数据只有接收人
    //子任务负责人 有回显 ，显示数据也只有接收人
    //数据列表渲染-传userList回来 [{id:1,name:'aaa'}]格式
    //回显数据传userId回来 [{id:1,name:'aaa'}]格式
    import {openUserInfo} from "@/assets/js/wx";

    export default {
        name: "urgingModule",
        props: [
            "show", //显示
            "userId", //回显的id
            "user", //渲染的数据列表
            "type",//页面类型
            "dataType",//数据类型
            "id",
            "is_recovery",
            "preview",
            "isLook"
        ],
        computed: {
            _show: {
                get: function () {
                    return this.show;
                },
                set: function (val) {
                    this.$emit("update:show", val);
                },
            },
        },
        watch: {
            _show(val) {
                if (val) {
                    // console.log(this.is_recovery)
                    if (this.dataType > 0) {
                        this.getData();
                    }
                }
            },
            userId: {
                handler(val) {
                    this.userIdList = val;
                    this.idArr = val.map(item=>item.id);
                    // if (this.userIdList.length > 0){
                    //     this.userIdList.forEach(item=>{
                    //         this.idArr.push(item.id)
                    //     })
                    // }
                },
                deep: true,
            },
            user: {
                handler(val) {
                    if (!this.dataType) {
                        // if (val.length > 0){
                        //     val.forEach(item=>{
                        //        delete item.userid
                        //     })
                        // }
                        const that = this;
                        setTimeout(function(){
                            that.loadding = false;
                        },500)
                        this.userList = val;
                    }
                },
                deep: true,
                immediate: true
            },
        },
        data() {
            return {
                loading: true,
                keyword: "", //搜索关键字
                userIdList: this.userId ? this.userId : [], //选中的数据 回显的数据
                idArr:[],
                userList: [], //用户列表
                treeData: [],//树形结构数据，转办，接收，抄送等相关数据
                pageType: this.type ? this.type : "", //urging催办  head负责人
                checkUserId: [],//转办选中id
                userData: [],//转办，接收，抄送等人员相关数据
                replaceFields: {
                    title: "name",
                    key: "checkId",
                },
                loadding:true
            };
        },
        created(){},
        methods: {
            async getData() {
                this.checkUserId = [];
                if (!this.preview) {
                    this.userIdList = [];
                }
                let isRecovery = this.is_recovery ? this.is_recovery : 0;
                const {data} = await task.getRemindUser({
                    id: this.id,
                    type: this.dataType,
                    is_recovery: isRecovery,
                    keyword: this.keyword,
                });
                const that = this;
                setTimeout(function(){
                    that.loadding = false;
                },500)
                if(this.dataType==1){
                   this.treeData = this.convertData(data);
                } else {
                     this.userIdList = data;
                }
            },
            // 转换数据为树形结构数据
            convertData(data) {
                this.userIdList = [];
                data.forEach(item => {
                    item.name = item.dep_name;
                    item.checkId = item.id;
                    item.checkable = false;
                    item.selectable = false;
                    item.user_list.forEach(item => {
                        item.checkId = item.userid;
                        if (this.preview) {
                            item.checkable = false;
                            item.selectable = false;
                        } else {
                            item.class = "user-select";
                        }
                    })
                    if (this.preview) {
                        item.user_list = item.user_list.filter(item => !item.is_leader);
                        this.userIdList.push(...item.user_list);
                    }
                    item.children = item.user_list;
                    this.userData.push(...item.children);
                })
                return data;
            },
            /**选中状态改变 */
            checkChange(data, e) {
                if (this.dataType) {
                    let value = e.node.dataRef;
                    let index = this.checkUserId.findIndex(item => item == value.checkId);
                    if (index > -1) {
                        this.userIdList.splice(index, 1);
                        this.checkUserId.splice(index, 1);
                    } else {
                        this.userIdList.push(value);
                        this.checkUserId.push(value.checkId);
                    }
                } else {
                    // this.userIdList = [].concat(data);
                    this.userIdList = this.userList.filter(item=>this.idArr.indexOf(item.id) >- 1);
                    console.log(this.idArr);
                    // if (data.length > 0){
                    //     this.idArr = [].concat(data)
                    //     data.forEach(item=>{
                    //         this.userList.forEach(v=>{
                    //             if (v.id == item){
                    //                 this.userIdList.push(v)
                    //             }
                    //         })
                    //     })
                    // }
                }
            },
            /** 右边 删除选中的项 */
            delChecked(key) {
                this.userIdList.splice(key, 1);
                if (this.dataType) {
                    this.checkUserId.splice(key, 1);
                }
            },
            btnSave: async function () {
                //请求数据
                if (this.pageType === "head") {
                    this.$emit("done", this.userIdList);
                    this._show = false;
                } else {
                    if (this.userIdList.length > 0) {
                        let params = {
                            id: this.$route.query.id,
                            userid: this.checkUserId,
                        };
                        const {msg, code} = await task.remind(params);
                        if (code) {
                            this.$message.success(msg, 2);
                            this._show = false;
                        } else {
                            this.$message.error(msg, 2);
                        }
                    }
                }
            },
            async btnSearch() {
                this.getData();
            },
            // 打开用户个人信息
            openInfo(value) {
                if (this.preview) {
                    let id = value.userid;
                    openUserInfo(id);
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .no-data {
        width: 100%;

        img {
            width: 100%;
        }
    }

    .tree-box {
        min-height: 300px;
    }

    .gray {
        color: #c8c9cc;
        float: right;
    }

    .blue {
        color: #0082EF;
        float: right;
    }

    .green {
        color: #67C23A;
        float: right;
    }

    //左侧样式
    .box {
        .ant-row {
            line-height: 36px;
            color: #2d3034;
            font-size: 14px;
        }
        .item {
            height: 36px;
            line-height: 36px;
        }
    }
    //关闭样式
    /deep/ .ant-tree-switcher-close {
        background: url("../assets/images/folderIcon.png") no-repeat !important;

        i {
            display: none;
        }
    }

    //文件夹图标
    /deep/ .ant-tree li .ant-tree-node-content-wrapper:hover {
        background-color: transparent;
    }

    /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background-color: transparent;
    }

    /deep/ .ant-tree .ant-tree-switcher-icon {
        font-size: 18px !important;
        color: #707070;
    }

    /deep/ .ant-tree li span.ant-tree-switcher.ant-tree-switcher_close
    .ant-tree-switcher-icon svg {
        transform: rotate(0deg);
    }

    //选择的人
    .checkedUser {
        height: 36px;
        line-height: 36px;
        position: relative;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;

        .close-icon {
            position: absolute;
            right: 10px;
            top: 5px;
            color: #909399;
        }
    }

    .checkedUser:hover {
        color: #0082ef;

        .close-icon {
            color: #0082ef;
        }
    }

    //转办选人
    /deep/ .user-select {
        position: relative;

        .ant-tree-node-content-wrapper-normal {
            position: absolute;
            background: none;
            left: 19px;
            padding-left: 32px;
            z-index: 2;
        }
    }

    //文件夹图标
    .folder-icon {
        font-size: 16px !important;
        color: #707070;
        transform: rotate(90deg) !important;
    }

    .pickUserBox {
        height: 50px;

        .a-input {
            .a-input__inner {
                width: 100%;
            }
        }

        .searchBox div {
            line-height: 20px;
            padding: 4px 8px;

            div:hover {
                background: #f5f7fa;
            }
        }

        /deep/ .a-dialog__body {
            padding: 20px;
        }

        .box {
            height: 300px;
            overflow: auto;
            margin-top: 10px;
        }

        .left-box {
            min-height: 300px;
            max-height: 500px;
            overflow-y: auto;
            border-right: 1px solid #ededed;
        }

        .right-box {
            min-height: 300px;
            max-height: 500px;
            padding-left: 20px;
            overflow-y: auto;

            .a-icon-close {
                float: right;
                cursor: pointer;
            }

            .selectedNum {
                overflow: hidden;
                position: relative;
                padding-top: 2px;
                border-bottom: 1px solid #ededed;
                padding-bottom: 10px;
                color: #959595;

                input {
                    position: absolute;
                    border: 0;
                    text-align: right;
                    width: 50%;
                    right: 0;
                    outline: none;
                    line-height: 17px;
                }
            }
        }

        input::-webkit-input-placeholder {
            color: #c5c5c5;
        }

        .checkedBox {
            margin-top: 20px;
            line-height: 24px;
            /*height: 260px;*/
            overflow: auto;
            & > div {
                transition: 0.2s;

                &:hover {
                    background: #e9f2fe;
                }
            }

            i {
                margin-top: 6px;
            }
        }

        .dialog-footer {
            text-align: right;
            padding-top: 20px;
        }
    }
</style>
