<template>
    <a-modal
            title="请选择人员"
            :visible.sync="_show"
            v-if="_show"
            footer
            centered
            width="600px"
            height="600px"
            class="pickUserBox"
            @cancel="_show = false"
            :destroyOnClose="true"
    >
        <div>
            <a-row>
                <a-col :span="12" class="left-box" style="position: relative">
                    <a-row>
                        <!--搜索-->
                        <a-col :span="18" height>
                            <a-input
                                    style="width: 100%"
                                    v-model="keyword"
                                    allowClear
                                    @keyup.enter.native="btnSearch"
                                    placeholder="请输入成员名称"
                                    size="small"
                                    @change="inputChange"
                            ></a-input>
                        </a-col>
                        <a-col :span="5" style="margin-left: 4px">
                            <a-button
                                    type="primary"
                                    icon="search"
                                    size="small"
                                    @click="btnSearch"
                            ></a-button>
                        </a-col>
                    </a-row>
                    <!--搜索空数据-->
                    <div class="searchBox box" v-show="searchShow">
                        <span v-if="!searchList.length">没有搜索到相关内容</span>
                        <div v-for="item in searchList" :key="item.id" class="item">
                            <a-checkbox
                                    @change="
                  (e) => {
                    checkChange(e, item.id);
                  }
                "
                                    :checked="item.checked"
                                    :disabled="item.disabled"
                            >
                                {{ item.label }}
                            </a-checkbox>
                        </div>
                    </div>
                    <!--左边节点-->
                    <div v-if="isLoad" class="box" v-show="!searchShow">
                        <a-tabs v-model="tabKey" type="card" class="tabs-card" animated>
                            <a-tab-pane :key="1" tab="组织架构">
                                <a-directory-tree
                                        node-key="id"
                                        ref="struct"
                                        class="struct"
                                        checkable
                                        blockNode
                                        :show-icon="true"
                                        :check-strictly="true"
                                        :check-on-click-node="true"
                                        :expand-on-click-node="false"
                                        :load-data="loadNode"
                                        :tree-data="treeData"
                                        :replace-fields="replaceFields"
                                        v-model="checkUserId"
                                        @select="checkChange"
                                >
                                </a-directory-tree>
                            </a-tab-pane>
                            <a-tab-pane :key="2" tab="标签">
                                <a-tree
                                        node-key="id"
                                        ref="tag"
                                        class="tag"
                                        checkable
                                        blockNode
                                        :show-icon="true"
                                        :check-strictly="true"
                                        :check-on-click-node="true"
                                        :expand-on-click-node="false"
                                        :load-data="loadTagNode"
                                        :tree-data="tagsData"
                                        :replace-fields="replaceFields"
                                        v-model="checkUserId"
                                        @select="checkChange"
                                >
                                    <a-icon slot="switcherIcon" type="folder"/>
                                    <template slot="custom" slot-scope="{ selected }">
                                        <a-icon type="check" class="checked" v-if="selected"/>
                                    </template>
                                </a-tree>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </a-col>
                <!--右边选中的人-->
                <a-col :span="12" class="right-box">
                    <div class="selectedNum">
                        已选中（ {{ Object.keys(checkedList.user).length }} ）
                    </div>
                    <div class="checkedBox">
                        <!-- 已选用户 -->
                        <div
                                v-for="(value, key) in checkedList.user"
                                :key="key"
                                class="checkedUser"
                                @click="openInfo(value)"
                        >
                            <div
                                    :key="key"
                                    v-show="
                  !checkedList.filter ||
                  (checkedList.filter && value.indexOf(checkedList.filter) > -1)
                "
                            >
                                <span>{{ value.label }}</span>
                                <a-icon
                                        type="close"
                                        v-if="!isLook"
                                        @click.stop="delChecked('user', key, value)"
                                        class="close-icon"
                                />
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <div slot="footer" class="dialog-footer alignR pd20" v-if="!isLook">
                <a-button @click="_show = false" slot-scope>取 消{{ isLook }}</a-button>
                <a-button type="primary" @click="btnSave" style="margin-left: 20px"
                >确 定
                </a-button
                >
            </div>
        </div>
    </a-modal>
</template>

<script>
    import {common} from "@/api";
    import {openUserInfo} from "@/assets/js/wx";

    export default {
        name: "pickUser",
        //是否显示; 已选用户; 已选部门; 是否单选; 类型:默认部门.keshi按照科室查询; 只显示同级并不包含自己; 不将部门转换为用户; 是否为问诊; 是否开启查询类型切换
        props: [
            "show",
            "selectedUser",
            "selectedDep",
            "radio",
            "type",
            "onlyShowSiblings",
            "noConversionDep",
            "noGroupUser",
            "diag",
            "isChangeType",
            "filterData",
            "isLook",
            "isData",//统计选人的权限 1是数据查看范围 0不是
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
            _selectedUser: {
                get: function () {
                    return this.selectedUser || [];
                },
                set: function (val) {
                    this.$emit("update:selectedUser", val);
                },
            },
            _selectedDep: {
                get: function () {
                    return this.selectedDep || {};
                },
                set: function (val) {
                    this.$emit("update:selectedDep", val);
                },
            },
        },
        watch: {
            _show(isShow) {
                //打开时初始化数据
                if (isShow) {
                    this.keyword = "";
                    this.searchShow = false;
                    this.loading = true;
                    this.isLoad = true;
                    this.getTreeData();
                    this.getTagsData();
                    this.userData = this._selectedUser.map((item) => {
                        if (item.name) {
                            item.label = item.name;
                            item.id = item.userid ? item.userid : item.id;
                        }
                        return item;
                    });
                    this.checkedList.userId = this.checkUserId = this._selectedUser.map(
                        (item) => (item.userid ? item.userid : item.id)
                    );
                    this.checkedList.dep = this._selectedUser.map((item) =>
                        item.dep ? item.dep : item.dep_id
                    );
                    this.checkedList.user = JSON.parse(JSON.stringify(this._selectedUser));

                    this.$nextTick().then(() => {
                        //更新选中状态到Tree组件
                        // this.$refs.treeDom.setCheckedKeys( Object.keys(this._selectedUser) );
                    });
                }
            },
        },
        data() {
            return {
                loading: true,
                keyword: "",
                checkedList: {userId: [], user: [], dep: []},
                checkUserId: [],
                userParentId: {},
                searchShow: false,
                searchList: [],
                searchUser: [],
                activeName: "",
                dataType: "",
                isLoad: true,
                treeData: [],
                replaceFields: {
                    title: "label",
                    key: "id",
                },
                tagsData: [],
                userData: [],
                currentDepart: {
                    // // parentId: this.$store.state.user.d_info.parent_id,
                    // parentId: JSON.parse(sessionStorage.getItem('userInfo')).user.d_info.parent_id,
                    // departmentName: this.$store.state.user.d_info.d_name
                },
                showIcon: true, //展示文件夹icon
                tabKey: 1,
            };
        },
        methods: {
            async getTreeData() {
                let params = {};
                if (this.isData) {
                    params.is_data = this.isData
                }
                const {data} = await common.getDepartNodeInit(params);
                this.treeData = this.convertData(data);
                this.treeData.forEach((item) => {
                    item.name = item.label;
                });
            },
            /**动态加载 */
            async loadNode(node) {
                const {data} = await common.getDepartNodeChild({
                    parentId: node.eventKey,
                });
                node.dataRef.children = this.convertData(data, node.eventKey);
                this.userData = this.unique([
                    ...this.userData,
                    ...data.filter((item) => item.isuser),
                ]);
                this.treeData = [...this.treeData];
            },
            /**
             * 加载标签数据
             */
            async getTagsData() {
                const {data} = await common.getTags();
                data.personal.forEach((item) => {
                    item.label = item.tag_name;
                    item.isuser = 0;
                });
                this.tagsData = this.convertData(data.personal, null, "tab");
                this.tagsData.forEach((item) => {
                    item.name = item.label;
                });
            },
            async loadTagNode(node, type) {
                const {
                    data: {data},
                } = await common.getTagsUser({
                    id: node.eventKey,
                });
                data.userid_list.forEach((item) => {
                    item.label = item.name;
                    item.isuser = 1;
                    item.id = item.userid;
                    if (type) {
                        let index = this.checkedList.userId.findIndex((id) => id == item.id);
                        if (node.checked) {
                            if (index < 0) {
                                if (this.filterData && this.filterData.indexOf(item.id) < 0) {
                                    this.checkedList.userId.push(item.id);
                                }
                            }
                        } else {
                            this.checkedList.userId.splice(index, 1);
                        }
                    }
                });
                node.dataRef.children = this.convertData(data.userid_list);
                this.userData = this.unique([...this.userData, ...data.userid_list]);
                this.tagsData = [...this.tagsData];
                if (type) {
                    this.setCheckData();
                }
            },

            /**tree 选中状态改变 */
            checkChange(data, e) {
                if (this.tabKey == 2) {
                    this.loadTagNode(e.node, "parent");
                }
                let id = e;
                if (e.node) {
                    id = e.node.dataRef.id;
                } else {
                    this.searchList.forEach((item) => {
                        if (item.id == id) {
                            item.checked = data.target.checked;
                        } else {
                            if (this.radio) {
                                item.checked = false;
                            }
                        }
                    });
                }
                let index = this.checkedList.userId.findIndex((item) => item == id);
                if (index > -1) {
                    this.checkedList.userId.splice(index, 1);
                } else {
                    if (this.radio) {
                        this.checkedList.userId = [];
                    }
                    this.checkedList.userId.push(id);
                }
                this.checkUserId = this.checkedList.userId;
                this.setCheckData();
            },
            /**
             *判断唯一值
             */
            unique(array) {
                let user = {};
                array = array.reduce((cur, next) => {
                    user[next.id] ? "" : (user[next.id] = true && cur.push(next));
                    return cur;
                }, []);
                return array;
            },
            /**
             * 设置选中数据
             */
            setCheckData() {
                this.checkedList.user = this.userData.filter(
                    (item) => this.checkedList.userId.indexOf(item.id) > -1
                );
                this.checkedList.user.forEach((item) => {
                    item.name = item.label;
                });
                let depId = [];
                this.checkedList.user.forEach((item) => {
                    depId.push(item.dep);
                });
                this.checkedList.dep = [].concat(depId);
            },
            /**
             * 区分是部门还是用户
             * @param data 数据列表
             * @param dep 部门id
             */
            convertData(data, dep, type) {
                data.forEach((item) => {
                    if (item.isuser) {
                        item.isLeaf = true;
                        item.dep = dep ? dep : item.dep_id;
                        item.class = "user-select";
                        if (this.filterData && this.filterData.indexOf(item.id) > -1) {
                            item.disabled = true;
                        }
                    } else {
                        item.checkable = false;
                        if (!type) {
                            item.selectable = false;
                        } else {
                            item.scopedSlots = {icon: "custom"};
                            if (this.radio) {
                                item.selectable = false;
                            }
                        }
                    }
                });
                return data;
            },
            /** 删除选中的项 */
            delChecked(type, key, value) {
                let index = this.checkedList.userId.findIndex((item) => item == value.id);
                this.$delete(this.checkedList.userId, index);
                this.checkUserId = this.checkedList.userId;
                this.setCheckData();
                this.searchList.forEach((item) => {
                    if (item.id == value.id) {
                        item.checked = false;
                    }
                });
            },
            btnSave: function () {
                this.$emit("done", this.checkedList);
                this._show = false;
            },
            inputChange() {
                if (this.keyword == "") {
                    this.searchShow = false;
                }
            },
            // 搜索
            async btnSearch() {
                if (!Array.isArray(this.checkUserId)) {
                    this.checkUserId = Object.assign([], this.checkUserId.checked);
                }
                const {data} = await common.getUserSearch({
                    keyword: this.keyword,
                });
                data.forEach((item) => {
                    item.value = item.id;
                    item.dep = item.parentid.split(",")[0];
                    if (this.filterData && this.filterData.indexOf(item.id) > -1) {
                        item.disabled = true;
                    }
                });
                this.searchList = data;
                this.searchList.forEach((item) => {
                    if (this.checkUserId.indexOf(item.id) > -1) {
                        item.checked = true;
                    }
                });
                // console.log(this.searchList)
                this.userData = this.unique([
                    ...this.userData,
                    ...data.filter((item) => item.isuser),
                ]);
                this.treeData = [...this.treeData];
                this.searchShow = Boolean(this.keyword);
            },
            // 打开用户个人信息
            openInfo(value) {
                if (this.isLook) {
                    let id = value.id ? value.id : value.userid;
                    openUserInfo(id);
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    /deep/ .ant-tree li .ant-tree-node-content-wrapper:hover {
        background-color: transparent;
    }

    /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background-color: transparent;
    }

    /deep/ .ant-tree-treenode-checkbox-checked {
        .ant-tree-title {
            color: #0082ef;
        }
    }

    /deep/ .ant-tree-child-tree li {
        margin: 5px 0;
    }

    //关闭样式
    /deep/ .ant-tree-switcher-close {
        background: url("../assets/images/folderIcon.png") no-repeat !important;

        i {
            display: none;
        }
    }

    //打开样式
    /deep/ .ant-tree-switcher-open {
        background: url("../assets/images/folderIcon.png") no-repeat !important;

        i {
            display: none;
        }
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

    // tab選項裏
    /deep/ .ant-tree {
        max-height: 344px;
        overflow: auto;
    }

    //文件夹图标
    /deep/ .ant-tree .ant-tree-switcher-icon {
        font-size: 16px !important;
        color: #707070;
    }

    /deep/ .ant-tree.tag
    li
    span.ant-tree-switcher.ant-tree-switcher_close
    .ant-tree-switcher-icon
    svg {
        transform: scale(1) rotate(0deg);
    }

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

    /deep/ .ant-tree-node-content-wrapper {
        position: relative;

        .ant-tree-icon__customize {
            position: absolute;
            right: 10px;
            color: #909090;
        }
    }

    /deep/ .tabs-card {
        .ant-tabs-card-bar .ant-tabs-tab-active {
            border: 1px solid #e8e8e8 !important;
            border-bottom: 1px solid #fff !important;

            &:active {
                border-color: #fff !important;
            }
        }

        .ant-tabs-tab {
            border-color: #fff !important;
            border-bottom: 1px solid #e8e8e8 !important;
            background: none !important;
            width: 110px;
            text-align: center;
            border-radius: 0 !important;
        }
    }

    .struct {
        /deep/ .ant-tree-node-content-wrapper::before {
            display: none !important;
        }

        /deep/ .user-select {
            .ant-tree-checkbox-inner {
                border-color: #d9d9d9 !important;
            }

            .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
                background: #0082ef !important;
                border-color: #0082ef !important;
                color: #fff !important;

                &::after {
                    border-color: #fff !important;
                }
            }

            .ant-tree-iconEle.ant-tree-icon__customize {
                display: none !important;
            }

            .ant-tree-node-selected {
                color: rgba(0, 0, 0, 0.65) !important;
            }

            .ant-tree-node-content-wrapper {
                width: 100% !important;

                &:hover {
                    background-color: transparent;
                }
            }
        }
    }

    .pickUserBox {
        height: 50px;

        .a-input {
            .a-input__inner {
                width: 100%;
            }
        }

        .searchBox .item {
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
            min-height: 300px;
            max-height: 400px;
            /*height: 300px;*/
            overflow: auto;
            margin-top: 10px;
        }

        .left-box {
            border-right: 1px solid #ededed;
        }

        .right-box {
            padding-left: 20px;

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

    //left-box
    /*/deep/ .ant-modal-body .left-box{*/
    /*  max-height: 400px;*/
    /*  !*overflow-y: scroll;*!*/
    /*}*/
    /deep/ .ant-modal-body .ant-row .right-box {
        max-height: 400px;
        overflow-y: scroll;
    }
</style>
