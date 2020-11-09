<template>
    <div>
        <!--生成pdf提示-->
        <a-modal
                title="生成预览文件"
                :visible="fileData.show"
                :footer="null"
                centered
                @cancel="cancel"
        >
            <div class="view_text">
                <div>提示</div>
                <div>预览文件生成中，请稍等...</div>
                <a-progress :percent="percent" status="active"/>
                <div>您可点击‘后台生成’按钮，关闭该窗口并在后台继续生成</div>
            </div>
            <div class="view_btn">
                <a-button type="primary"> 后台生成</a-button>
            </div>
        </a-modal>
        <!--pdfyulan-->
        <a-modal
                title="预览文件"
                :visible="showPdf"
                :footer="null"
                style="top: 20px;"
                :style="{height:filesuffix == 'pdf' ? 800 : height}"
                :width="filesuffix == 'pdf' ? 1000 : width"
                centered
                :fullScreen="true"
                @cancel="cancelView()"
        >
            <div style="width: 100%;" :style="{height:filesuffix == 'pdf' ? 800 : height}">
                <div v-if="filesuffix == 'pdf'">
                    <div class="file-name">
                        <span>{{fileName}}</span>
                    </div>
                    <iframe style="width: 100%; height: 800px" :src="url"></iframe>
                </div>
                <div v-else>
                    <img :src="url"/>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {common} from "@/api";
    import commonFn from "../assets/js/common";

    export default {
        name: "viewFile",
        data() {
            return {
                fileData: {},
                percent: 0,
                showPdf: false, //展示pdf
                filesuffix: "", //后缀
                url: "",
                width: null,
                height: null,
                fileName: null,
            };
        },
        props: {
            viewData: {
                type: Object,
                default: () => {
                },
            },
        },
        watch: {
            viewData: {
                deep: true,
                immediate: true,
                handler(val) {
                    //截取文件后缀
                    if (val && val.fileData.name) {
                        // console.log(222222);
                        let fileName = val.fileData.name;
                        this.fileName = fileName;
                        let first = fileName.lastIndexOf("."); //取到文件名开始到最后一个点的长度
                        let namelength = fileName.length; //取到文件名长度
                        let filesuffix = fileName.substring(first + 1, namelength); //截取获得后缀名
                        let _fileData = this.deepCopy(val);
                        if (!(filesuffix == "jpg" || filesuffix == "jpeg" || filesuffix == "pdf" || filesuffix == "png")) {
                            if (_fileData.show) {
                                this.openPdf(val.save_path);
                            }
                            this.fileData = _fileData;
                        } else {
                            if (filesuffix == "pdf") {
                                this.url = val.fileData.save_path;
                                this.filesuffix = "pdf";
                                this.width = 1000;
                                this.height = '800px'
                            } else {
                                let _warterMark = JSON.parse(sessionStorage.getItem("userInfo")).watermark;
                                commonFn.createImg(val.fileData.save_path, _warterMark).then((res) => {
                                    this.url = res;
                                    this.filesuffix = "";
                                });
                            }
                            _fileData.show = false;
                            this.showPdf = true;
                        }
                    }
                },
            },
        },
        methods: {
            deepCopy(v) {
                return JSON.parse(JSON.stringify(v));
            },
            cancel() {
                this.fileData.show = false;
                this.$emit("viewCancel", false);
                this.percent = 0;
            },
            //后台转pdf
            async openPdf() {
                // let res = await common.previewPdf({save_path: this.viewData.fileData.save_path})
                // console.log(res)
                let interval = setInterval(() => {
                    this.percent = this.percent + 2;
                    if (this.percent >= 80) {
                        clearInterval(interval);
                        this.$message.error("预览失败");
                    }
                }, 300);
                common.previewPdf({save_path: this.viewData.fileData.save_path}).then((res) => {
                        let _this = this;
                        if (res.code) {
                            clearInterval(interval);
                            _this.cancel();
                            _this.fileData.show = false;
                            if (res.data.url) {
                                let fileName = res.data.url;
                                let first = fileName.lastIndexOf("."); //取到文件名开始到最后一个点的长度
                                let namelength = fileName.length; //取到文件名长度
                                _this.filesuffix = fileName.substring(first + 1, namelength); //截取获得后缀名
                                _this.showPdf = true;
                                this.url =
                                    JSON.parse(sessionStorage.getItem("userInfo")).host +
                                    res.data.url;
                            }
                        } else {
                            setTimeout(() => {
                                _this.$message.error("预览失败");
                                _this.fileData.show = false
                                clearInterval(interval);
                                _this.cancel();
                            }, 600);
                        }
                    });
                this.percent = 0;
            },
            //预览页取消
            cancelView() {
                this.showPdf = false;
            },
        },
    };
</script>

<style scoped lang="less">
    /deep/.ant-modal-body{
        max-height: 750px;
        .file-name {
            position: absolute;
            z-index: 1;
            color: #fff;
            width: calc(100% - 60px);
            height: 50px;
            box-sizing: border-box;
            padding: 0 20px;
            line-height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .file-name span {
            position: absolute;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 90%;
            height: 50px;
            line-height: 50px;
            display: block
        }
    }
    .view_text {
        padding: 20px 0;
    }

    .view_btn {
        text-align: right;
    }

    .file-name {
        position: absolute;
        z-index: 1;
        color: #fff;
        width: calc(100% - 60px);
        height: 50px;
        box-sizing: border-box;
        padding: 0 20px;
        line-height: 50px;

        span {
            position: absolute;
        }

        &::before {
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            content: "";
            z-index: 0;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }

        &::after {
            background: #525659;
            position: absolute;
            content: "";
            z-index: -1;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
    }
</style>