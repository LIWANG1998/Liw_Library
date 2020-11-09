<template>
    <div class="add-task">
        <a-upload-dragger
                name="file"
                :multiple="true"
                :action="qiNiuUrl"
                :data="{token: qNParams.token,key: qNParams.key,}"
                @change="handleChange"
                :before-upload="beforeUpload"
                :showUploadList="false"
        >
            <a-button class="uploadFile" v-show="btnUploadShow">本地上传</a-button>
            <p class="ant-upload-drag-icon">
                <img src="@/assets/images/importIcon.png" alt="" class="uploadIcon">
            </p>
            <p class="tips">请拖需要上传的文件到此框内，自动上传！</p>
            <p class="desc">支持上传，.xls .xlsx .pptx .ppt .docx .doc .pdf .jpg. jpeg .png .bmp .gif .tif .zip .7z
                .rar格式，单文件不能超过100M</p>
        </a-upload-dragger>
        <file-list-module :file-arr="fileList" @data="getFileList"></file-list-module>
        <a-spin :spinning="loadingFile">
            <a-icon slot="indicator" type="loading" style="font-size: 24px" spin/>
        </a-spin>
    </div>

</template>

<script>
    import FileListModule from "./fileListModule";
    import {common} from "@/api";
    import commonFn from '../assets/js/common'

    export default {
        name: "uploadDrag",
        components: {FileListModule},
        props: {
            type: {
                type: String,
                default: 'file'
            },
            btnUploadShow: {
                type: Boolean,
                default: true,
            },
            defaultFileList: {
                type: Array,
            }
        },
        data() {
            return {
                qiNiuUrl: 'https://upload-z2.qiniup.com/',
                qNParams: {},//上传到七牛云的参数
                uploadListIcon: {
                    showPreviewIcon: true,
                    showRemoveIcon: false
                },
                fileList: [].concat(this.defaultFileList),//文件数组
                fileObj: { //单个文件对象
                    save_path: '',
                    type: '',
                    name: '',
                    time: '',
                    dep: '',
                    username: '',
                    fileIcon: '',
                },
                loadingFile: false,//文件加载中
            };
        },
        watch: {
            defaultFileList: {
                handler(val) {
                    this.fileList = [].concat(val);
                },
                deep: true
            },
        },
        methods: {
            //选择文件后
            handleChange(info) {
                this.loadingFile = true;
                const status = info.file.status;
                if (status !== 'uploading') {
                    this.loadingFile = true;
                }
                if (status === 'done') {
                    // console.log(info);
                    //往fileList 里面push数据
                    //截取文件后缀
                    let fileName = info.file.name;
                    let first = fileName.lastIndexOf(".");//取到文件名开始到最后一个点的长度
                    let namelength = fileName.length;//取到文件名长度
                    let filesuffix = fileName.substring(first + 1, namelength);//截取获得后缀名
                    const type = 'xls|xlsx|pptx|ppt|docx|doc|pdf|jpg|jpeg|png|bmp|gif|tif|zip|7z|rar';
                    let judgeType = type.indexOf(filesuffix) === -1;//-1没找到
                    const isLt100M = info.file.size / 1024 / 1024 < 100;
                    if (!isLt100M) {
                        this.$message.error('文件大小不能超过100M');
                    }
                    if (judgeType) {
                        this.$message.error('文件类型不支持！');
                    }
                    if (isLt100M && !judgeType) {
                        this.fileObj = {
                            save_path: this.qNParams.url + '/' + info.file.response.key,
                            type: info.file.type,
                            name: info.file.name,
                            time: this.qNParams.time,
                            dep: this.qNParams.dep,
                            username: this.qNParams.username,
                            fileIcon: '',
                        };
                        let fileType = info.file.name.split('.')[1];
                        //展示前面的icon
                        this.fileObj.fileIcon = commonFn.judeFileType(fileType, this.qNParams.url + '/' + info.file.response.key);
                        this.fileList.push(this.fileObj);
                        this.$emit("getFileList", this.fileList);
                    }
                    this.loadingFile = false;

                } else if (status === 'error') {
                    this.loadingFile = false;
                    this.$message.error(`文件“${info.file.name}”上传失败`);
                }
            },
            //上传前 请求获取七牛云token
            async beforeUpload(file) {
                // this.fileList = [...this.fileList, file];
                //截取文件后缀
                let fileName = file.name;
                let first = fileName.lastIndexOf(".");//取到文件名开始到最后一个点的长度
                let namelength = fileName.length;//取到文件名长度
                let filesuffix = fileName.substring(first + 1, namelength);//截取获得后缀名
                const data = await common.getQNToken({type: filesuffix});
                // console.log(data)
                if (data) {
                    this.qNParams = data
                }
                return false;
            },
            //任务文件删除时
            getFileList(data) {
                this.fileList = [].concat(data)
            },
        },
    }
</script>

<style scoped lang="less">
    /deep/ .ant-upload {
        background: #F9FCFF;
        position: relative;
    }

    #fileList .plan-file-list {
        width: 100%;
    }

    /deep/ .add-task .plan-file .plan-file-list {
        width: 100%;
    }

    .uploadFile {
        position: absolute;
        top: -50px;
        right: 0;

    }

    /*加载动画*/
    .ant-spin {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999999;
    }

</style>