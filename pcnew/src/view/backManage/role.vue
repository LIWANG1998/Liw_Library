<template>
    <div class="power">
        <header class="page-header">权限管理</header>
        <div class="split-box split-box-thin"></div>
        <div class="action-bar clear-fix">
            <div class="bar-left">
                <p class="search-inp">
                    <a-input-search placeholder="角色名称" v-model="searchWord" @input="getData(1)"/>
                </p>
                <a-button type="primary" class="search-btn" @click="getData(1)">搜索</a-button>
            </div>
            <div class="bar-right">
                <a-button @click="openModal('add')">添加角色</a-button>
                <a-button type="primary" @click="delData">批量删除</a-button>
                <a-button @click="$router.go(0)">
                    <a-icon type="reload"/>
                    刷新
                </a-button>
            </div>
        </div>
        <div class="power-table">
            <div class="table-content" v-if="data.length > 0">
                <a-table :data-source="data" :pagination="pagination" :loading="loading"
                         @change="handleTableChange" :row-selection="rowSelection"
                         rowKey="id">
                    <!--title 标题  dataIndex数据字段 key vue需要的key-->
<!--                    <a-table-column key="id" title="ID" data-index="id"/>-->
                    <a-table-column key="name" title="角色" data-index="name"/>
                    <a-table-column key="remarks" title="描述" data-index="remarks" :ellipsis="true">
                        <template slot-scope="scope">
                            <a-tooltip placement="left" :title="scope">
                                <span>{{scope ? scope : '--'}}</span>
                            </a-tooltip>
                        </template>
                    </a-table-column>
                    <a-table-column key="state" title="状态" data-index="state">
                        <template slot-scope="scope,record">
                            <span>
                                 <a-switch :checked="scope === 0 ? true : false" :disabled="record.id === 1 || record.id === 2 || record.id === 3 || record.id === 4 "
                                           @change="changeRoleState(record)"/>
                            </span>
                        </template>
                    </a-table-column>
                    <a-table-column key="sort" title="排序" data-index="sort"/>
                    <a-table-column key="create_time" title="创建时间" data-index="create_time"/>
                    <a-table-column key="action" title="操作">
                        <template slot-scope="record">
                            <span>
                                 <a-button type="link" @click="openModal('edit',record)"
                                           v-if="record.id !== 1 && record.id !== 2 && record.id !== 3 && record.id !== 4 ">编辑</a-button>
                                 <a-button type="link" @click="goSetRole(record)">角色权限</a-button>
                            </span>
                        </template>
                    </a-table-column>
                </a-table>
            </div>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </div>
        <!--编辑弹窗 -->
        <a-modal :title=" modalType === 'add' ? '添加角色' :'编辑角色'"
                 :visible=" modalShow" :confirm-loading="confirmLoading" :centered="true"
                 :destroyOnClose="true"
                 @ok=" modalSure" @cancel="cancelModel">
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="角色名称" prop="name">
                    <a-input placeholder="请输入角色名称(限制10个字符以内)" v-model="form.name" :maxLength="10"/>
                </a-form-model-item>
                <a-form-model-item label="角色描述">
                    <textarea-limit :value="form.desc" ref="textAreaVal" :totalLength="100"></textarea-limit>
                </a-form-model-item>
                <a-form-model-item label="角色状态">
                    <a-switch :defaultChecked="form.state"
                              checked-children="启用" un-checked-children="禁用"
                              v-model="form.state"/>
                </a-form-model-item>
                <a-form-model-item label="角色排序" prop="sort">
                    <a-input placeholder="请输入角色排序" v-model="form.sort"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>

</template>

<script>
    import {backManage} from "@/api";
    import TextareaLimit from "../../components/textareaLimit";

    export default {
        name: "role",
        components: {TextareaLimit},
        data() {
            let checkSort = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入排序值'));
                } else if (isNaN(value)) {
                    return callback(new Error('请输入数字'));
                } else if (value < 2 || value > 100) {
                    return callback(new Error('排序值范围在 (1,100] 之间'));
                } else {
                    callback()
                }
            };
            return {
                data: [],//表格数据
                selectedRows: [],//选择列
                loading: false,//加载
                pagination: {
                    current: 1,//当前页
                    pageSize: 10,//每页多少条
                    total: 1//总条数
                },
                searchWord: '',//搜索
                modalType: 'add',//弹窗类型
                modalShow: false,//弹窗显示
                confirmLoading: false,//表单确定加载状态
                labelCol: {span: 4},
                wrapperCol: {span: 16},
                form: {
                    id: null,
                    name: '',
                    desc: '',
                    state: true,
                    sort: null
                },
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'},
                        {max: 20, message: '输入字符应在20字内', trigger: 'blur'}],
                    sort: [{required: true, message: '排序不能为空', trigger: 'blur'},
                        {validator: checkSort, trigger: 'blur'}],
                },
                tableCheck: []
            };
        },
        computed: {
            //勾选列
            rowSelection() {
                return {
                    onChange: (selectedRowKeys) => {
                        this.tableCheck = [].concat(selectedRowKeys)
                    },
                    getCheckboxProps: record => ({
                        props: {
                            disabled: record.id === 2 || record.id === 3 || record.id === 4 || record.id === 1,
                            name: record.name,
                        },
                    }),
                };
            },
        },
        created() {
            this.getData();
        },
        methods: {
            //获取数据
            async getData(isSearch) {
                if (isSearch){
                    this.pagination.current = 1
                }
                let params = {
                    name: this.searchWord === undefined ? '' : this.searchWord,
                    page: this.pagination.current,
                    num: this.pagination.pageSize
                }
                const {code, data, msg} = await backManage.getRole(params);
                if (code) {
                    this.data = [].concat(data.data);
                    this.pagination.total = data.total
                } else {
                    this.$message.error(msg, 2);
                }
            },
            //页码改变时
            handleTableChange(pagination) {
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                this.getData();
            },
            //角色状态改变时
            async changeRoleState(record) {
                record.state = record.state === 0 ? 1 : 0;
                const {code, msg} = await backManage.changeRoleState({id: record.id, state: record.state});
                if (code) {
                    this.$message.success(msg, 2)
                } else {
                    this.$message.error(msg, 2)
                }
            },
            //打开弹窗
            openModal(type, record) {
                this.modalType = type;
                this.modalShow = true;
                this.confirmLoading = false;
                if (record) {
                    this.form.id = record.id;
                    this.form.name = record.name;
                    this.form.desc = record.remarks;
                    this.form.state = record.state === 0 ? true : false;
                    this.form.sort = record.sort;
                } else {
                    this.form = {
                        id: null,
                        name: '',
                        desc: '',
                        state: true,
                        sort: null
                    }
                }
            },
            //弹窗确定
            modalSure() {
                this.$refs.ruleForm.validate(async valid => {
                    if (valid) {
                        this.confirmLoading = true
                        let param = {
                            name: this.form.name,
                            remarks: this.$refs.textAreaVal.inputVal,
                            sort: this.form.sort,
                            state: this.form.state ? 0 : 1,
                            is_initiate: 1,
                        };
                        let fn;
                        if (this.modalType === 'add') {
                            fn = await backManage.addRole(param)
                        } else if (this.modalType === 'edit') {
                            param.id = this.form.id
                            fn = await backManage.editRole(param);
                        }
                        const {code, msg} = fn;
                        if (code) {
                            this.confirmLoading = false
                            this.$message.success(msg, 2)
                            this.modalShow = false;
                            this.getData();
                        } else {
                            this.confirmLoading = true
                            this.$message.error(msg, 2)
                        }

                    } else {
                        this.$message.error('检验失败，请检查输入项！', 2)
                        return false;
                    }
                });
            },
            //弹窗取消
            cancelModel() {
                this.modalShow = false;
                this.$refs.ruleForm.resetFields();
            },
            //弹窗内开关
            modalSwitchChange(checked) {
                this.form.state = checked
            },
            //批量删除
            delData() {
                if (this.tableCheck.length == 0) {
                    this.$message.warning('请选择要删除的数据', 2)
                } else {
                    let _this = this;
                    this.$confirm({
                        title: '是否确定删除' + this.tableCheck.length + '项数据？',
                        content: '',
                        centered: true,
                        async onOk() {
                            const id = _this.tableCheck.join(',')
                            const {code, msg} = await backManage.delRole({id: id})
                            if (code) {
                                _this.$message.success(msg, 2)
                                const totalPage = Math.ceil((_this.pagination.total - 1) / _this.pagination.pageSize)
                                const pagenum = _this.pagination.current > totalPage ? totalPage : _this.pagination.current
                                _this.pagination.current = pagenum < 1 ? 1 : pagenum
                                _this.getData();
                            } else {
                                _this.$message.error(msg, 2)
                            }
                        },
                    });


                }
            },
            //角色权限
            goSetRole(record) {
                // this.$router.push({
                //     path: `/backManage/setRole/${record.id}`,
                // })
                this.$router.push(`/backManage/setRole?id=${record.id}`)
            },

        },
    }
</script>

<style scoped>
    @import "../../assets/css/power.css";
</style>