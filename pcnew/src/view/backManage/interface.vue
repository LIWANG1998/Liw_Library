<template>
    <div class="interface">
        <header class="page-header">接口管理</header>
        <div class="split-box split-box-thin"></div>
        <div class="box">
            <ul>
                <li v-for="(item,index) in data" :key="index">
                    <img :src="item.img ? item.img :errorImg" class="img"
                         :onerror="errorImg"/>
                    <div class="url">{{item.target}}</div>
                    <div class="action" v-show="item.face_name !== '网盘'">
                        <a class="edit" @click="openModal('edit',item.id)"><i class="iconfont">&#xe639;</i>编辑</a>
                        <a class="start-use" v-if="item.state === 1">
                            <a-icon type="check-circle" @click="startStop('start',item.id)"/>启用</a>
                        <a class="stop-use" v-else  @click="startStop('stop',item.id)"><a-icon type="stop"/>停用</a>
                        <a class="stop-use" v-show="item.state === 1"  @click="delData(item.id)"><i class="iconfont">&#xe626;</i>删除</a>
                    </div>
                </li>
                <li class="add" @click="openModal('add')">
                    <div>
                        <a-icon type="plus"/>
                        <p>新增接口</p>
                    </div>
                </li>
            </ul>
        </div>
        <!--设置logo弹窗-->
        <a-modal :title="modalType === 'add' ? '添加接口' :'编辑接口'"
                 :visible="modalShow" :confirm-loading="confirmLoading" :centered="true"
                 :destroyOnClose="true"
                 @ok="modalSure" @cancel="cancelModal">
            <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                <!--          logo尺寸建议360*180-->
                <a-form-model-item label="接口图片">
                    <a-upload
                            name="file"
                            list-type="picture-card"
                            class="avatar-uploader"
                            :show-upload-list="false"
                            :action="qiNiuUrl"
                            :before-upload="beforeUpload"
                            :data="{token: qNParams.token,key: qNParams.key,}"
                            @change="upload">
                        <img v-if="form.imgUrl" :src="form.imgUrl" alt="avatar" class="interface-img"/>
                        <div v-else>
                            <img class="layui-upload-img" id="img" src="@/assets/images/interface.png">
                        </div>
                        <a-icon type="loading" v-show="uploadLoading" class="upload-loading"/>
                    </a-upload>
                    <p class="upload-tips">建议尺寸180*90，限制1张</p>
                </a-form-model-item>
                <a-form-model-item label="接口名称">
                    <a-input placeholder="请输入接口名称" v-model="form.name"/>
                </a-form-model-item>
                <a-form-model-item label="接口">
                    <a-input placeholder="请输入接口" v-model="form.interface"/>
                </a-form-model-item>
                <a-form-model-item label="账号">
                    <a-input placeholder="请输入账号" v-model="form.accout"/>
                </a-form-model-item>
                <a-form-model-item label="密码">
                    <a-input placeholder="请输入密码" v-model="form.psw" type="password"/>
                </a-form-model-item>
                <a-form-model-item label="备注">
                    <a-textarea placeholder="请输入备注" :rows="5" v-model="form.remarks"/>
                </a-form-model-item>

            </a-form-model>
        </a-modal>
        <!--               <div>
                           <div class="cutImg clear-fix">
                               <div class="cut-img-box">
                                   <img id="cutImg" src="" alt="">
                               </div>
                               <div class="cut-show-img">
                                   <p>预览</p>
                                   <p>
                                       <img src="" alt="" id="showCutImg">
                                   </p>
                               </div>
                           </div>
                       </div>-->
    </div>
</template>

<script>
    import {backManage, common} from "@/api";

    export default {
        name: "interface",
        data() {
            return {
                qiNiuUrl: 'https://upload-z2.qiniup.com/',
                qNParams: {},//上传到七牛云的参数
                imgUrl: '',
                data: [],
                errorImg: 'this.src="'+require('@/assets/images/nodata.png')+'"',
                labelCol: {span: 4},
                wrapperCol: {span: 16},
                modalShow: false,
                form: {
                    id: null,
                    imgUrl: '',
                    name: '',
                    interface: '',
                    accout: '',
                    psw: '',
                    remarks: '',
                },
                modalType: 'add',
                confirmLoading: false,
                uploadLoading: false,
            }
        },
        created() {
            this.getData();
        },
        methods: {
            async getData() {
                const {code, data} = await backManage.getInterFace();
                if (code) {
                    this.data = [].concat(data);
                }
            },
            //打开弹窗
            async openModal(type, id) {
                this.modalShow = true;
                this.modalType = type;
                if (type === 'add') {
                    this.form = {
                        id: null,
                        imgUrl: '',
                        name: '',
                        interface: '',
                        accout: '',
                        psw: '',
                        remarks: '',
                    }
                } else {
                    const {code, data} = await backManage.getOneInterface({id: id});
                    if (code) {
                        this.form = {
                            id: data.id,
                            imgUrl: data.img,
                            name: data.face_name,
                            interface: data.target,
                            accout: data.username,
                            psw: data.password,
                            remarks: data.remarks,
                        }
                    }
                }
            },
            //弹窗确定
            async modalSure() {
                this.confirmLoading = true
                let param = {
                    face_name: this.form.name,
                    remarks: this.form.remarks,
                    img: this.form.imgUrl,
                    username: this.form.accout,
                    password: this.form.psw,
                    target: this.form.interface
                };
                let fn;
                if (this.modalType === 'add') {
                    fn = await backManage.addInterFace(param)
                } else if (this.modalType === 'edit') {
                    param.id = this.form.id
                    fn = await backManage.editInterFace(param);
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
            },
            //弹窗取消
            cancelModal() {
                this.modalShow = false;
                this.$refs.ruleForm.resetFields();
            },
            //上传前 请求获取七牛云token
            async beforeUpload() {
                const data = await common.getQNToken();
                if (data) {
                    this.qNParams = data
                }
                return false;
            },
            //选择文件后
            upload(info) {
                this.uploadLoading = true;
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return;
                }
                if (info.file.status === 'error') {
                    this.uploadLoading = false;
                    this.$message.error('上传失败', 3)
                }
                if (info.file.status === 'done') {
                    this.uploadLoading = false;
                    this.form.imgUrl = this.qNParams.url + '/' + info.file.response.key;
                }
            },
            //启用停用
            startStop(type,id){
                let params = {
                    id:id
                },text='';
                if (type === 'start'){
                    text = '启用';
                    params.state = 0
                } else {
                    text = '停用'
                    params.state = 1
                }
                let _this = this;
                this.$confirm({
                    title: '是否确定' +text+ '该接口？',
                    content: '',
                    centered: true,
                    async onOk() {
                        const {code, msg} = await backManage.stopInterFace(params)
                        if (code) {
                            _this.$message.success(msg, 2)
                            _this.getData();
                        } else {
                            _this.$message.error(msg, 2)
                        }
                    },
                });
            },
            //删除
            delData(id){
                let params = {id:id}
                let _this = this;
                this.$confirm({
                    title: '是否确定删除该接口？',
                    content: '',
                    centered: true,
                    async onOk() {
                        const {code, msg} = await backManage.delInterFace(params)
                        if (code) {
                            _this.$message.success(msg, 2)
                            _this.getData();
                        } else {
                            _this.$message.error(msg, 2)
                        }
                    },
                });
            },
        }
    }
</script>

<style scoped>
    @import "../../assets/css/interface.css";
</style>
<style scoped>
    /deep/ .ant-upload #img, .interface-img {
        width: 180px;
        height: 90px;
    }

    /deep/ .ant-upload {
        width: 180px;
        height: 90px;
        padding: 0;
        margin-bottom: 0;
        position: relative;
    }

    /deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
        padding: 0;
    }

    .upload-tips {
        font-size: 12px;
        color: #b2bccc;
        margin-top: -20px;
    }

    .upload-loading {
        font-size: 20px;
        position: absolute;
        left: 80px;
        top: 35px;
    }
</style>