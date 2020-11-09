<template>
    <div class="encourage-words power">
        <header class="page-header">激励语管理</header>
        <div class="split-box split-box-thin"></div>
        <div class="action-bar clear-fix">
            <div class="bar-left">
                <p class="search-inp">
                    <a-input-search placeholder="激励语" @keyup.enter.native="getData(1)" @input.native="getData(1)" v-model="searchWord"/>
                </p>
                <a-button type="primary" class="search-btn" @click="getData(1)">搜索</a-button>
            </div>
            <div class="bar-right">
                <!--                <a-button @click="importIn()">导出</a-button>-->
                <!--                <a-button @click="importIn()">导入</a-button>-->
                <a-button @click="delData">批量删除</a-button>
                <a-button type="primary" @click="openModal('add')">新增</a-button>
            </div>
        </div>
        <div class="power-table">
            <div class="table-content" v-if="tableData.length > 0">
                <a-table :data-source="tableData" :pagination="pagination" :loading="loading"
                         :row-selection="{ selectedRowKeys: tableCheck, onChange: rowSelection }"
                         @change="handleTableChange" rowKey="id">
                    <!--title 标题  dataIndex数据字段 key vue需要的key-->
                    <a-table-column key="orderNum" title="序号" data-index="orderNum" :width="200" align="center"/>
                    <a-table-column key="content" title="激励语" data-index="content" align="center"/>
                    <a-table-column key="action" title="操作" :width="200" align="center">
                        <template slot-scope="scope">
                            <span>
                                 <a-button type="link" @click="openModal('edit',scope)">编辑</a-button>
                                 <a-button type="link" @click="delData(scope)" size="small"
                                           style="color: #FF6161">删除</a-button>
                            </span>
                        </template>
                    </a-table-column>
                </a-table>
            </div>
            <div class="no-data" v-else>
                <img src="@/assets/images/nodata.png" alt="暂无数据" class="no-data-img">
            </div>
        </div>
        <a-modal :title=" modalType === 'add' ? '添加激励语' :'编辑激励语'"
                 :visible=" modalShow" :confirm-loading="confirmLoading" :centered="true"
                 :destroyOnClose="true"
                 @ok=" modalSure" @cancel="cancelModel" ok-text="保存">
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="激励语" prop="content">
                    <div class="area-box">
                        <a-textarea placeholder="请输入..." :rows="4" v-model.trim="form.content"
                                    :maxLength="30"/>
                        <span class="count-length">{{form.content.length}} / 30</span>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>

</template>

<script>
    import {backManage} from "@/api";

    export default {
        name: "encourageWords",
        data() {
            return {
                searchWord: '',//搜索关键字
                selectedRows: [],//选择列
                loading: false,//加载
                pagination: {
                    current: 1,//当前页
                    pageSize: 10,//每页多少条
                    total: 5//总条数
                },
                tableData: [],//表格数据
                tableCheck: [],//选中的id
                modalType: 'add',//弹窗类型
                modalShow: false,//弹窗显示
                confirmLoading: false,//表单确定加载状态
                labelCol: {span: 4},
                wrapperCol: {span: 16},
                form: {
                    id: null,
                    content: '',
                },
                rules: {
                    content: [{required: true, message: '输入不能为空', trigger: 'blur'},
                        {max: 30, message: '输入字符应在20字内', trigger: 'blur'}],
                },
            };
        },
        computed: {
            hasSelected() {
                return this.tableCheck.length > 0;
            },
        },
        mounted() {
            this.getData()
        },
        methods: {
            //获取数据
            async getData(isSearch) {
                if (isSearch){
                    this.pagination.current = 1
                }
                let params = {
                    keyword: this.searchWord === undefined ? '' : this.searchWord,
                    page: this.pagination.current,
                    limit: this.pagination.pageSize
                }
                const {code, data, msg} = await backManage.getEncourage(params);
                if (code) {
                    this.tableData = [].concat(data.data);
                    if (this.tableData.length > 0){
                        this.tableData.forEach((item,index) =>{
                            item.orderNum = (this.pagination.current - 1) * this.pagination.pageSize + index + 1
                        })
                    }
                    this.pagination.total = data.total ? data.total : 0
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
            //打开弹窗
            openModal(type, record) {
                this.modalType = type;
                this.modalShow = true;
                this.confirmLoading = false;
                if (record) {
                    this.form.id = record.id;
                    this.form.content = record.content;
                } else {
                    this.form = {
                        id: null,
                        content: '',
                    }
                }
            },
            //弹窗确定
            modalSure() {
                this.$refs.ruleForm.validate(async valid => {
                    if (valid) {
                        this.confirmLoading = true
                        let param = {
                            content: this.form.content,
                        };
                        let fn;
                        if (this.modalType === 'add') {
                            fn = await backManage.addEncourage(param)
                        } else if (this.modalType === 'edit') {
                            param.id = parseInt(this.form.id)
                            fn = await backManage.editEncourage(param);
                        }
                        const {code, msg} = fn;
                        if (code) {
                            this.confirmLoading = false
                            this.$message.success(msg, 2)
                            this.modalShow = false;
                            this.getData();
                        } else {
                            this.confirmLoading = false
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
            //勾选列
            rowSelection(selectedRowKeys) {
                console.log(selectedRowKeys)
                this.tableCheck = [].concat(selectedRowKeys)
            },
            //批量删除
            delData(record) {
                if (this.tableCheck.length == 0 && !record.id) {
                    this.$message.warning('请选择要删除的数据', 2)
                } else {
                    // console.log(this.tableCheck)
                    let _this = this;
                    let length = 0
                    if (record.id) {
                        length = '该'
                    } else {
                        length = _this.tableCheck.length
                    }
                    _this.$confirm({
                        title: '是否确定删除' + length + '项数据？',
                        content: '',
                        centered: true,
                        async onOk() {
                            let id = null
                            if (record.id) {
                                id = record.id
                            } else {
                                id = _this.tableCheck.join(',')
                            }
                            const {code,msg} = await backManage.delEncourage({id: id})
                            if (code) {
                                _this.$message.success(msg, 2)
                                // _this.pagination.current = data.pages
                                // _this.pagination.total = data.total
                                const totalPage = Math.ceil((_this.pagination.total - 1) / _this.pagination.pageSize)
                                const pagenum = _this.pagination.current > totalPage ? totalPage : _this.pagination.current
                                _this.pagination.current = pagenum < 1 ? 1 : pagenum
                                _this.getData();
                                _this.tableCheck = [];
                            } else {
                                _this.$message.error(msg, 2)
                            }
                        },
                    });
                }
            },
            //导入 导出
            importIn() {
                this.$message.warning('功能暂未开放，请耐心等待！', 2)
            }

        },
    }
</script>

<style scoped>
    @import "../../assets/css/power.css";
</style>
<style lang="less" scoped>
    .area-box {
        position: relative;
    }

    textarea {
        resize: none;
    }
</style>