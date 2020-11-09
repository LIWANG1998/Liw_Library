<template>
    <div class="labelManage">
        <header class="page-header">
            标签管理
            <div class="is-system" id="optionBtn" v-if="!delMore">
                <a-button @click="delMore = true">批量删除</a-button>
                <a-button type="primary" @click="openModal('add')">添加</a-button>
            </div>
            <div class="is-system" id="delBtn" v-else>
                <a-button @click="delMore = false">取消</a-button>
                <a-button type="primary" @click="delData('delMore')" :disabled="addBtnShow">确定</a-button>
            </div>
        </header>
        <div class="split-box split-box-thin"></div>
        <div class="label-content">
            <div class="section-title title">个人标签</div>
            <a-checkbox-group v-model="tableCheck" v-if="data.length > 0">
                <ul class="label-list" id="personUl">
                    <li v-for="(item,index) in  data" :key="index" :title="item.tag_name">
                        <a-checkbox :value="item.id" v-if="delMore">
                            <div class="label-list-li">
                                <div class=" layout"><span class="label-name">{{item.tag_name}}</span> <span
                                        class="count">(共{{item.num }}人）</span>
                                </div>
                                <div class="layout label-option">
                                    <span class="seeData" @click="openModal('see',item.id)"><i
                                            class="iconfont">&#xe600;</i>查看</span>
                                    <span class="editData" @click="openModal('edit',item.id)"><i class="iconfont">&#xe639;</i>编辑</span>
                                    <span class="delData"><i class="iconfont"
                                                             @click="delData(item.id)">&#xe626;</i>删除</span>
                                </div>
                            </div>
                        </a-checkbox>
                        <div class="label-list-li" v-else>
                            <div class=" layout"><span class="label-name"> {{item.tag_name}}</span> <span
                                    class="count">(共{{item.num }}人）</span>
                            </div>
                            <div class="layout label-option">
                                    <span class="seeData" @click="openModal('see',item.id)"><i
                                            class="iconfont">&#xe600;</i>查看</span>
                                <span class="editData" @click="openModal('edit',item.id)"><i
                                        class="iconfont">&#xe639;</i>编辑</span>
                                <span class="delData" @click="delSure(item.id,1)"><i class="iconfont"
                                >&#xe626;</i>删除</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </a-checkbox-group>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </div>
        <!--编辑弹窗 -->
        <a-modal :title="modalTitle"
                 :visible=" modalShow" :confirm-loading="confirmLoading" :centered="true"
                 :destroyOnClose="true"
                 @ok="modalSure" @cancel="cancelModel">
            <a-form-model ref="formName" :model="form" :rules="rules"
                          :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="标签名称" prop="name">
                    <a-input placeholder="请输入标签名称(15字内)" v-model="form.name" :maxLength="15" :disabled="isSee"/>
                </a-form-model-item>
                <a-form-model-item label="标签人员" prop="people">
                    <select-people-tags :people-arr="form.people" ref="selectPeople"
                                        :can-edit="isSee"></select-people-tags>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>

</template>

<script>
    import {common} from "@/api";
    import SelectPeopleTags from "../components/selectPeopleTags";

    export default {
        name: "labelManage",
        components: {SelectPeopleTags},
        data() {
            return {
                data: [
                    // {
                    //     "id": 17,
                    //     "tagid": 17,    //int    企业微信的标签id
                    //     "tag_name": "adad",    //string    标签名称
                    //     "create_time": 1111,    //int    创建时间
                    //     "update_time": 111,    //int    更新时间
                    //     "parent_id": 4,    //int    父级id
                    //     "status": "1",    //int    状态 0禁用 1启用
                    //     "sort": 100,    //int    排序
                    //     "is_ban": 1,    //int    是否禁用 1否  2禁用
                    //     "num": 1    //int    标签人数
                    // },
                ],//表格数据
                modalType: 'add',//弹窗类型
                modalShow: false,//弹窗显示
                confirmLoading: false,//表单确定加载状态
                labelCol: {span: 4},
                wrapperCol: {span: 18},
                form: {
                    id: null,
                    name: '',
                    people: {dep: [], userId: [], user: []},
                    tagid: null,
                },
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'},
                        {max: 20, message: '输入字符应在20字内', trigger: 'blur'}],
                    people: [{required: true, message: '排序不能为空', trigger: 'change'}],
                },
                tableCheck: [],//批量删除id
                delMore: false,
                modalTitle: '',
                addBtnShow:false,
                isSee: false,
            }
        },
        watch:{
            data(val){
                if (val.length >= 20){
                    this.addBtnShow = true
                }
            },
        },
        created() {
            this.getData();
        },
        methods: {
            //获取数据
            async getData() {
                const {code, data, msg} = await common.getTags();
                if (code) {
                    this.data = [].concat(data.personal);
                    if (this.data.length >= 20){
                        this.addBtnShow = true
                    }
                } else {
                    this.$message.error(msg, 2);
                }
            },

            //打开弹窗
            async openModal(type, id) {
                this.modalType = type;
                this.modalShow = true;
                if (type === 'add') {
                    this.modalTitle = '新增标签'
                    this.isSee = false
                } else if (type === 'edit') {
                    this.modalTitle = '编辑标签'
                    this.isSee = false
                } else if (type === 'see') {
                    this.modalTitle = '查看标签'
                    this.isSee = true
                }
                if (id) {
                    this.form.id = id;
                    const {code, data, msg} = await common.getTagsUser({id: id});
                    if (code) {
                        console.log(data)
                        this.form.name = data.data.tag_name;
                        this.form.people.user = [].concat(data.data.userid_list);
                        this.form.tagid = data.data.parent_id;
                        this.form.people.dep = data.data.dep_list ? data.data.dep_list.split(',') : [];
                        this.form.people.userId = data.data.userid ? data.data.userid.split(',') : [];
                    } else {
                        this.$message.error(msg, 2);
                    }
                } else {
                    this.form = {
                        id: null,
                        name: '',
                        people: {dep: [], userId: [], user: []},
                    }
                }
            },
            //弹窗确定
            modalSure() {
                if (this.modalType == 'see') {
                    this.modalShow = false
                } else {
                    console.log(this.$refs.selectPeople.peopleList);
                    this.confirmLoading = true;
                    this.form.people.user = this.$refs.selectPeople.peopleList;
                    this.form.people.dep = this.$refs.selectPeople.depId;
                    this.form.people.userId = this.$refs.selectPeople.peopleId;
                    this.$refs.formName.validate(async valid => {
                        if (valid && this.form.people.user.length > 0) {
                            var userId = this.form.people.userId ? this.form.people.userId.join(',') : '';
                            var depId = this.form.people.dep ? this.form.people.dep.join(',') : '';
                            let param = {
                                tag_name: this.form.name,
                                userid: userId,
                                userid_list: userId,
                                dep_list: depId,
                            };
                            let fn;
                            if (this.modalType === 'add') {
                                param.type = 0
                                fn = await common.addTags(param)
                            } else if (this.modalType === 'edit') {
                                param.type = 1
                                param.id = this.form.id;
                                param.tagid = this.form.tagid;
                                param.parent_id = this.form.tagid;
                                fn = await common.addTags(param);
                            }
                            const {code, msg} = fn;
                            if (code) {
                                this.confirmLoading = false;
                                this.$message.success(msg, 2);
                                this.modalShow = false;
                                this.getData();
                            } else {
                                this.confirmLoading = true;
                                this.$message.error(msg, 2)
                            }
                        } else {
                            this.$message.error('检验失败，请检查输入项！', 2);
                            this.confirmLoading = false
                            return false;
                        }
                    });
                }
            },
            //弹窗取消
            cancelModel() {
                this.modalShow = false;
                this.$refs.formName.resetFields();
            },
            //批量删除
            delData() {
                let ids, arrLength;
                this.delMore = true;
                if (this.tableCheck.length === 0) {
                    this.$message.warning('请选择要删除的数据', 2)
                } else {
                    ids = this.tableCheck.join(',');
                    arrLength = this.tableCheck.length;
                    this.delSure(ids, arrLength)
                    this.delMore = false
                }
            },
            //确定删除
            delSure(ids, arrLength) {
                let _this = this;
                this.$confirm({
                    title: '是否确定删除' + arrLength + '项数据？',
                    content: '',
                    centered: true,
                    async onOk() {
                        const {code, msg} = await common.delTags({id: ids});
                        if (code) {
                            _this.$message.success(msg, 2);
                            _this.getData();
                        } else {
                            _this.$message.error(msg, 2)
                        }
                    },
                });
            },
        },

    }
</script>

<style scoped>
    @import "../assets/css/labelcssNew.css";
</style>
<style scoped>
    /deep/ .ant-checkbox-group {
        width: 100%;
    }

    /deep/ .ant-checkbox-wrapper {
        height: 50px;
        display: inline-block;

    }

    /deep/ .ant-checkbox-wrapper-checked :nth-child(2) > div {
        border: 1px solid #74c0ff !important;
    }

</style>